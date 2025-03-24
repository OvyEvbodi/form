'use server'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const FieldErrorMsgs = {
  dob: "Please enter a valid date of birth",
  phone: "Phone number must start with a '0' and be 11 digits",
  bank_acct_no: "Account number must be 10 digits",
  address: "Address must be longer than 10 characters",
  bank_acct_name: "Please check that name is more than 3 characters",
  id_file: "Please upload a valid ID of the type you chose above"
};

const shortlistedSchema = z.object({
  firstname: z.string({required_error: "First name is required"}).trim(),
  lastname: z.string({required_error: "Last name is required"}).trim(),
  dob: z.string({required_error: "Date of birth is required"}).date(),
  phone: z.string({required_error: "Phone number is required"}).length(11, {message: FieldErrorMsgs.phone }),
  address: z.string({required_error: "Address is required"}).min(10, {message: FieldErrorMsgs.address }),
  bank_acct_name: z.string({required_error: "Bank account name is required"}).trim().min(3, {message: FieldErrorMsgs.bank_acct_name }),
  bank_acct_no: z.string({required_error: "Bank account name is required"}).length(10, {message: FieldErrorMsgs.bank_acct_no }),
  id_file: z.instanceof(File)
    .refine(file => file.size <= 2 * 1024 * 1024, {message: "File size must be 2MB or less"})
    .refine((file) => ["image/png", "image/jpeg", "image/jpg", "application/pdf"].includes(file.type), {
      message: "Only PNG, PDF and JPEG files are allowed",
  })
})

// implement not allowed methods

export const POST = async (request: NextRequest) => {
  try {
    // validate data
    const filledForm = await request.formData();
    const castedForm = {
      ...filledForm,
      firstname: filledForm.get("firstname") as String,
      lastname: filledForm.get("lastname") as String,
      dob: filledForm.get("dob") as String,
      phone: filledForm.get("phone") as String,
      address: filledForm.get("address") as String,
      bank_acct_name: filledForm.get("bank_acct_name") as String,
      bank_acct_no: filledForm.get("bank_acct_no") as String,
      id_file: filledForm.get("id_file") as File
    };
    const validatedForm = shortlistedSchema.safeParse(castedForm);

    if (!validatedForm.success) {
      const formErrors = validatedForm.error.flatten().fieldErrors;

      console.log(castedForm)
      console.log(formErrors)
      console.log(validatedForm)

      return NextResponse.json( {
        errors: {
          firstname: formErrors?.firstname,
          lastname: formErrors?.lastname,
          dob: formErrors?.dob,
          phone: formErrors?.phone,
          address: formErrors?.address,
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
    const imageFileName = idFile?.name;  // rename file here!!! I'm tired abeg
    console.log(filledForm)
    console.log(idFile)
    // s3 upload
    const cred = {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY ?? "",
      secretAccessKey: process.env.AWS_S3_SECRET_KEY ?? ""
    }

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