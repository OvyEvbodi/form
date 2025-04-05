'use server'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { Prisma, PrismaClient } from "@prisma/client";
import { idUploadForPaymentSchema } from "@/zod_schema"
import { DefaultArgs } from "@prisma/client/runtime/library";

interface CastedFormInterface {
  phone_number: string;
  whatsapp: string;
  email?: string;
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
        listOfLGAs.map(async (roleTable) => {
          const result = await (dbClient[roleTable as keyof typeof dbClient] as any).findFirst({
            where: { account_number: bank_acct_no }
          });

          return {[roleTable]: result};
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

const getNewName: (oldFilename: string, phoneNumber: string) => string = (oldFilename: string, accountNumber: string) => {
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
      phone_number: filledForm.get("phone_number") as string || "",
      whatsapp: filledForm.get("whatsapp") as string || "",
      email: filledForm.get("email") as string || "",
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
          phone_number: formErrors?.phone_number,
          whatsapp: formErrors?.whatsapp,
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
    const imageFileName: string = getNewName(originalFileName, castedForm.account_number);
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
      Key: imageFileName || castedForm.account_number,
      Body: new Uint8Array(await idFile!.arrayBuffer()),
      ContentType: idFile!.type
    };

    const command = new PutObjectCommand(params);
    // const s3Res = await s3.send(command)
    // console.log(s3Res)

    delete (castedForm as any).id_file;
    delete (castedForm as any).confirm_bank_acct_no;

    console.log(castedForm)

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
