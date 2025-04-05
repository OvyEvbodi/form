'use server'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { Prisma, PrismaClient } from "@prisma/client";
import { idUploadForPaymentSchema } from "@/zod_schema"
import { DefaultArgs } from "@prisma/client/runtime/library";

interface CastedFormInterface {
  lga: string;
  id_type: string;
  name_of_bank: string;
  bank_acct_name: string;
  bank_acct_no: string;
  confirm_bank_acct_no?: string;
  id_file?: File;
};


var initialRole = "";
// implement not allowed methods

const verifiedApplicant: (
  lga: string,
  bank_acct_no: string, 
  dbClient: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
) => Promise<boolean> = async (
  lga: string,
  bank_acct_no: string, 
   dbClient: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  ) => {
    const listOfLGAs = [
      "ajingi",
      "sumaila", 
    ] as const;

    const formLGA = lga.toLowerCase();
    if (!listOfLGAs.includes(formLGA as typeof listOfLGAs[number])) {
      console.log("Invalid LGA! Not allowed!");
      return false;
    }

    try {
      const applicantData = await Promise.all(
        listOfLGAs.map(async (lgaTable) => {
          const result = await (dbClient[lgaTable as keyof typeof dbClient] as any).findFirst({
            where: { account_number: bank_acct_no }
          });

          if (result !== null) {
            initialRole = lgaTable.split("_")[0];
            console.log(initialRole)
          }

          return {[lgaTable]: result};
        })
      );

      const hasValidEntry = applicantData.some((entry) =>
        Object.values(entry).some((value) => value !== null)
      );

      console.log(applicantData);
      if (hasValidEntry) console.log("Valid applicant")
      else console.log("Invalid applicant! Not allowed!")

      return hasValidEntry
    } catch (error) {
      console.log(error)
      return false;
    }

};

const getNewName: (oldFilename: string, accountNumber: string) => string = (oldFilename: string, accountNumber: string) => {
  let newFileName = "";
  if ( oldFilename.endsWith(".pdf") || oldFilename.endsWith(".PDF") ) newFileName = `${accountNumber}.pdf`;
  if ( oldFilename.endsWith(".png") || oldFilename.endsWith(".PNG") ) newFileName = `${accountNumber}.png`;
  if ( oldFilename.endsWith(".jpg") || oldFilename.endsWith(".JPG") ) newFileName = `${accountNumber}.jpg`;
  if (oldFilename.endsWith(".jpeg") || oldFilename.endsWith(".JPEG") ) newFileName = `${accountNumber}.jpeg`;

  return newFileName
};

export const POST = async (request: NextRequest) => {
  try {
    // validate data
    const filledForm = await request.formData();

    const castedForm: CastedFormInterface = {
      lga: filledForm.get("lga") as string || "",
      id_type: filledForm.get("id_type") as string || "",
      name_of_bank: filledForm.get("name_of_bank") as string || "",
      bank_acct_name: filledForm.get("bank_acct_name") as string || "",
      confirm_bank_acct_no: filledForm.get("confirm_bank_acct_no") as string || "",
      bank_acct_no: filledForm.get("bank_acct_no") as string || "",
      id_file: filledForm.get("id_file") as File,
    };

    const validatedForm = idUploadForPaymentSchema.safeParse(castedForm);
    

    if (!validatedForm.success) {
      const formErrors = validatedForm.error.flatten().fieldErrors;

      console.log(formErrors)
      
      return NextResponse.json( {
        zodErrors: {
          bank_acct_name: formErrors?.bank_acct_name,
          bank_acct_no: formErrors?.bank_acct_no,
          confirm_bank_acct_no: formErrors?.confirm_bank_acct_no,
          id_file: formErrors?.id_file,
          message: ""
        },
        castedForm
      }, { status: 400 })
    }

    // ---------------------remove next line after validation testing!!!
    // console.log(filledForm)
    // return NextResponse.json({success: "Nicely filled"})


    // try to upload
    const idFile: File | null = filledForm.get("id_file") as unknown as File;
    if (!idFile) return // add message
    const originalFileName = idFile!.name;  // rename file here!!! I'm tired abeg
    const imageFileName: string = getNewName(originalFileName, castedForm.bank_acct_no);
    console.log(filledForm)
    console.log(imageFileName)
    // s3 upload
    const cred = {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY ?? "",
      secretAccessKey: process.env.AWS_S3_SECRET_KEY ?? ""
    }

    // add useful feedback for errors......................
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials:  cred 
    })
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageFileName || castedForm.bank_acct_no,
      Body: new Uint8Array(await idFile!.arrayBuffer()),
      ContentType: idFile!.type
    };

    const command = new PutObjectCommand(params);
    // const s3Res = await s3.send(command)
    // console.log(s3Res)

    delete (castedForm as any).id_file;
    delete (castedForm as any).confirm_bank_acct_no;

    console.log(castedForm)
    const dbFeedback = await runValidate(castedForm, imageFileName);
    if (dbFeedback === "Invalid") {
      console.warn("Not shortlisted")
      return NextResponse.json({
        notShortlisted: {
          phoneNumber: castedForm.phone_number,
          message: "It appears you were not shortlisted for this role. Make sure you use the phone number you applied with."
        }
      }, { status: 400 })
    }

    const s3Res = await s3.send(command)
    console.log(s3Res)

    if (s3Res.$metadata.httpStatusCode !== 200) {
      console.error("Error uploading photo to s3")
      return NextResponse.json( {
        errors: {
          message: "Error uploading photo"
        }
      }, { status: 500 })
    }

    console.log("ID successfully uploaded to storage........")

    return NextResponse.json({
      success: {
        message:  "success"
      }
    }, 
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    console.log("errorr oooo........")

    return NextResponse.json(
      { errors: "Internal Server Error" },
      { status: 500 }
    )
  }
};

const runValidate = async (form: CastedFormInterface, imageFileName: string) => {
  try {
    const db = new PrismaClient();

    const result = await verifiedApplicant(form.bank_acct_no, db);
    console.log(result)
    if(!result) {
      return "Invalid"
    }

    console.log("Verification complete!")
  } catch (error) {
    console.error(error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    }
    return "savingError" // add message, and propagate feedback
  } finally {
    // redirect workaround
  }
};

