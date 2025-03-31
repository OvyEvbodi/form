'use server'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { Prisma, PrismaClient } from "@prisma/client";
import { shortlistedSchema } from "@/zod_schema"
import { DefaultArgs } from "@prisma/client/runtime/library";

interface CastedFormInterface {
  firstname: string;
  lastname: string;
  dob: string;
  phone_number: string;
  whatsapp: string;
  email?: string;
  lga: string;
  ward: string;
  full_address: string;
  willing_to_be_reassigned: string;
  willing_to_be_redeployed: string;
  first_choice_ward_for_redeployment?: string;
  second_choice_ward_for_redeployment?: string;
  id_type: string;
  name_of_bank: string;
  bank_acct_name: string;
  bank_acct_no: string;
  confirm_bank_acct_no?: string;
  gender: string;
  id_file?: File;
  middlename?: string;
};


var initialRole = "";
// implement not allowed methods

const verifiedApplicant: (
  phoneNumber: string, 
  dbClient: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
) => Promise<boolean> = async (
  phoneNumber: string,
   dbClient: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  ) => {
    const listOfRoles = [
      "lga_qualified_applicant", 
      "ward_qualified_applicant", 
      "dataclerk_qualified_applicant"
    ] as const;

    type RoleTable = (typeof listOfRoles)[number];

    try {
      const applicantData = await Promise.all(
        listOfRoles.map(async (roleTable) => {
          const result = await (dbClient[roleTable as keyof typeof dbClient] as any).findFirst({
            where: { phone_number: phoneNumber }
          });

          if (result !== null) {
            initialRole = roleTable.split("_")[0];
            console.log(initialRole)
          }
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

const saveToDb = async (form: CastedFormInterface, imageFileName: string) => {
  const id = uuidv4();
  try {
    const created_at = new Date();

    const db = new PrismaClient();

    const result = await verifiedApplicant(form.phone_number, db);
    console.log(result)
    if(!result) {
      return "Invalid"
    }
    console.log(initialRole)
    const dbData = {
      ...form,
      id,
      created_at,
      file_name: imageFileName,
      initial_role: initialRole
    };

    const addEntry = await db.shortlisted_applicant_form.create({ 
      data: {
        ...dbData
      }
    });
    
    console.log(addEntry)
    if (addEntry === null) return "savingError"
    console.log("Congratulations! You have successfully been registered.")
  } catch (error) {
    console.error(error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Specific handling for phone_number unique violation
      if (error.code === 'P2002' && ( error.meta?.target as string[] ).includes('phone_number')) {
        return "duplicatePhone";
      }
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Specific handling for phone_number unique violation
      if (error.code === 'P2002' && ( error.meta?.target as string[] ).includes('id')) {
        return "duplicateId";
      }
    }
    return "savingError" // add message, and propagate feedback
  } finally {
    // redirect workaround
  }
};

const getNewName: (oldFilename: string, phoneNumber: string) => string = (oldFilename: string, phoneNumber: string) => {
  let newFileName = "";
  if ( oldFilename.endsWith(".pdf") || oldFilename.endsWith(".PDF") ) newFileName = `${phoneNumber}.pdf`;
  if ( oldFilename.endsWith(".png") || oldFilename.endsWith(".PNG") ) newFileName = `${phoneNumber}.png`;
  if ( oldFilename.endsWith(".jpg") || oldFilename.endsWith(".JPG") ) newFileName = `${phoneNumber}.jpg`;
  if (oldFilename.endsWith(".jpeg") || oldFilename.endsWith(".JPEG") ) newFileName = `${phoneNumber}.jpeg`;

  return newFileName
};

export const POST = async (request: NextRequest) => {
  try {
    // validate data
    const filledForm = await request.formData();

    const castedForm: CastedFormInterface = {
      firstname: filledForm.get("firstname") as string || "",
      lastname: filledForm.get("lastname") as string || "",
      dob: filledForm.get("dob") as string || "",
      phone_number: filledForm.get("phone_number") as string || "",
      whatsapp: filledForm.get("whatsapp") as string || "",
      email: filledForm.get("email") as string || "",
      lga: filledForm.get("lga") as string || "",
      ward: filledForm.get("ward") as string || "",
      full_address: filledForm.get("full_address") as string || "",
      willing_to_be_reassigned: filledForm.get("willing_to_be_reassigned") as string || "",
      willing_to_be_redeployed: filledForm.get("willing_to_be_redeployed") as string || "",
      first_choice_ward_for_redeployment: filledForm.get("first_choice") as string || "",
      second_choice_ward_for_redeployment: filledForm.get("second_choice") as string || "",
      id_type: filledForm.get("id_type") as string || "",
      name_of_bank: filledForm.get("name_of_bank") as string || "",
      bank_acct_name: filledForm.get("bank_acct_name") as string || "",
      confirm_bank_acct_no: filledForm.get("confirm_bank_acct_no") as string || "",
      bank_acct_no: filledForm.get("bank_acct_no") as string || "",
      gender: filledForm.get("gender") as string || "",
      id_file: filledForm.get("id_file") as File,
      middlename: filledForm.get("middlename") as string || "",
    };

    const validatedForm = shortlistedSchema.safeParse(castedForm);
    

    if (!validatedForm.success) {
      const formErrors = validatedForm.error.flatten().fieldErrors;

      console.log(formErrors)
      
      return NextResponse.json( {
        zodErrors: {
          firstname: formErrors?.firstname,
          lastname: formErrors?.lastname,
          dob: formErrors?.dob,
          phone_number: formErrors?.phone_number,
          whatsapp: formErrors?.whatsapp,
          full_address: formErrors?.full_address,
          bank_acct_name: formErrors?.bank_acct_name,
          bank_acct_no: formErrors?.bank_acct_no,
          confirm_bank_acct_no: formErrors?.confirm_bank_acct_no,
          // first_choice: formErrors?.first_choice,
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
    const imageFileName: string = getNewName(originalFileName, castedForm.phone_number);
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
      Key: imageFileName || castedForm.phone_number,
      Body: new Uint8Array(await idFile!.arrayBuffer()),
      ContentType: idFile!.type
    };

    const command = new PutObjectCommand(params);
    // const s3Res = await s3.send(command)
    // console.log(s3Res)

    delete (castedForm as any).id_file;
    delete (castedForm as any).confirm_bank_acct_no;

    console.log(castedForm)
    const dbFeedback = await saveToDb(castedForm, imageFileName);
    if (dbFeedback === "Invalid") {
      console.warn("Not shortlisted")
      return NextResponse.json({
        notShortlisted: {
          phoneNumber: castedForm.phone_number,
          message: "It appears you were not shortlisted for this role. Make sure you use the phone number you applied with."
        }
      }, { status: 400 })
    } else if (dbFeedback === "savingError") {
      console.error("Error registering")
      return NextResponse.json({
        errors: {
          message: "Error registering you. Please check your connection and make sure you're not sending a duplicate entry."
        }
      }, { status: 500 })
    } else if (dbFeedback === "duplicatePhone") {
      console.warn("duplicate phone number")
      return NextResponse.json({
        errors: {
          message: "Duplicate entry. You have already been registered"
        }
      }, { status: 400 })
    } else if (dbFeedback === "duplicateId") {
      console.error("duplicateId")
      return NextResponse.json({
        errors: {
          message: "Error registering you. Please check your connection and make sure you're not sending a duplicate entry."
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
