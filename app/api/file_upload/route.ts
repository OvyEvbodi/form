'use server'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from "@prisma/client";
import { redirect } from 'next/navigation';
import { z } from "zod";
import { ward } from "@/data/links";


const id = uuidv4();
const FieldErrorMsgs = {
  dob: "Please enter a valid date of birth",
  phone_number: "Phone number must start with a '0' and be 11 digits",
  bank_acct_no: "Account number must be 10 digits",
  full_address: "Address must be longer than 10 characters",
  bank_acct_name: "Please check that name is more than 3 characters",
  id_file: "Please upload a valid ID of the type you chose above"
};

const shortlistedSchema = z.object({
  firstname: z.string({required_error: "First name is required"}).trim(),
  lastname: z.string({required_error: "Last name is required"}).trim(),
  dob: z.string({required_error: "Date of birth is required"}).date(),
  phone_number: z.string({required_error: "Phone number is required"}).length(11, {message: FieldErrorMsgs.phone_number }),
  full_address: z.string({required_error: "Address is required"}).min(10, {message: FieldErrorMsgs.full_address }),
  bank_acct_name: z.string({required_error: "Bank account name is required"}).trim().min(3, {message: FieldErrorMsgs.bank_acct_name }),
  bank_acct_no: z.string({required_error: "Bank account name is required"}).length(10, {message: FieldErrorMsgs.bank_acct_no }),
  id_file: z.instanceof(File)
    .refine(file => file.size <= 2 * 1024 * 1024, {message: "File size must be 2MB or less"})
    .refine((file) => ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type), {
      message: "Only JPG, PDF, PNG, and JPEG files are allowed",
  })
})


// implement not allowed methods
const saveToDb = async (form: any, imageFileName: string) => { //interface later
  try {
    
    const created_at = new Date();
    const dbData = {
      ...form,
      id,
      created_at,
      file_name: imageFileName
    };

    const warddb = new PrismaClient();
      const addWordEntry = await warddb.shortlisted_applicant_form.create({ 
        data: {
          ...dbData
        }
      })
  } catch (error) {
    console.error(error)
  } finally {
    // redirect workaround
  }
};

const getNewName: (oldFilename: string, id: string, firstName: string, lastName: string) => string = (oldFilename: string, id: string, firstName: string, lastName: string) => {
  let newFileName = "";
  if (oldFilename.endsWith(".pdf")) newFileName = `${firstName}-${lastName}-${id}.pdf`;
  if (oldFilename.endsWith(".png")) newFileName = `${firstName}-${lastName}-${id}.png`;
  if (oldFilename.endsWith(".jpg")) newFileName = `${firstName}-${lastName}-${id}.jpg`;
  if (oldFilename.endsWith(".jpeg")) newFileName = `${firstName}-${lastName}-${id}.jpeg`;

  return newFileName
};

export const POST = async (request: NextRequest) => {
  try {
    // validate data
    const filledForm = await request.formData();

    const castedForm = {
      firstname: filledForm.get("firstname") as string,
      lastname: filledForm.get("lastname") as string,
      dob: filledForm.get("dob") as string,
      phone_number: filledForm.get("phone_number") as string,
      email: filledForm.get("email") as string,
      lga: filledForm.get("lga") as string,
      ward: filledForm.get("ward") as string,
      full_address: filledForm.get("full_address") as String,
      willing_to_be_reassigned: filledForm.get("willing_to_be_reassigned") as string,
      willing_to_be_redeployed: filledForm.get("willing_to_be_redeployed") as string,
      id_type: filledForm.get("id_type") as string,
      name_of_bank: filledForm.get("name_of_bank") as string,
      bank_acct_name: filledForm.get("bank_acct_name") as string,
      bank_acct_no: filledForm.get("bank_acct_no") as string,
      gender: filledForm.get("gender") as string,
      id_file: filledForm.get("id_file") as File
    };

    const lowerFirstName = filledForm.get("firstname")?.toString().toLowerCase() || "";
    const lowerLastName = filledForm.get("lastname")?.toString().toLowerCase() || "";


    // const castedForm = {};
    // filledForm.forEach((value, key) => castedForm[key] = value);
    // const json = JSON.stringify(castedForm);

    const validatedForm = shortlistedSchema.safeParse(castedForm);

    console.log(filledForm)
    if (!validatedForm.success) {
      const formErrors = validatedForm.error.flatten().fieldErrors;

      console.log(formErrors)

      return NextResponse.json( {
        errors: {
          firstname: formErrors?.firstname,
          lastname: formErrors?.lastname,
          dob: formErrors?.dob,
          phone_number: formErrors?.phone_number,
          full_address: formErrors?.full_address,
          bank_acct_name: formErrors?.bank_acct_name,
          bank_acct_no: formErrors?.bank_acct_no,
          id_file: formErrors.id_file
        }
      })
    }


    // ---------------------remove next line after validation testing!!!
    // console.log(filledForm)
    // return NextResponse.json({success: "Nicely filled"})


    // try to upload
    // const data = await request.formData();
    const idFile: File | null = filledForm.get("id_file") as unknown as File;
    if (!idFile) return // add message
    const originalFileName = idFile?.name;  // rename file here!!! I'm tired abeg
    const imageFileName = getNewName(originalFileName, id, lowerFirstName, lowerLastName);
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
      Key: imageFileName,
      Body: new Uint8Array(await idFile!.arrayBuffer()),
      ContentType: idFile!.type
    };

    const command = new PutObjectCommand(params);
    const s3Res = await s3.send(command)
    console.log(s3Res)

    // then save entry into database
    // rename image
    // check size
    // add other form values to db data
    delete (castedForm as any).id_file;
    await saveToDb(castedForm, imageFileName)
    console.log("successfully registered........")

    return NextResponse.json(
      "", 
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    console.log("errorr oooo........")

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
};