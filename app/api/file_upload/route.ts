'use server'

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const FieldErrorMsgs = {
  dob: "Please enter a valid date of birth",
  phone: "Phone number must start with a '0' and be 11 digits",
  bank_acct_no: "Account number must be 10 digits",
  address: "Address must be longer than 10 characters",
  bank_acct_name: "Please check that name is more than 3 characters"
};

const shortlistedSchema = z.object({
  firstname: z.string({required_error: "First name is required"}).trim(),
  lastname: z.string({required_error: "Last name is required"}).trim(),
  dob: z.string({required_error: "Date of birth is required"}).date(),
  phone: z.string({required_error: "Phone number is required"}).length(11, {message: FieldErrorMsgs.phone }),
  address: z.string({required_error: "Address is required"}).min(10, {message: FieldErrorMsgs.address }),
  bank_acct_name: z.string({required_error: "Bank account name is required"}).trim().min(3, {message: FieldErrorMsgs.bank_acct_name }),
  bank_acct_no: z.string({required_error: "Bank account name is required"}).length(10, {message: FieldErrorMsgs.bank_acct_no })
})


export const POST = async (request: NextRequest) => {
  try {
    // validate data
    const filledForm = await request.formData();
    const validatedForm = shortlistedSchema.safeParse(filledForm);

    if (!validatedForm.success) {
      const formErrors = validatedForm.error.flatten().fieldErrors;

      console.log(filledForm)
      console.log({
        firstname: formErrors?.firstname,
        lastname: formErrors?.lastname,
        dob: formErrors?.dob,
        phone: formErrors?.phone,
        address: formErrors?.address,
        bank_acct_name: formErrors?.bank_acct_name,
        bank_acct_no: formErrors?.bank_acct_no
      })

      return NextResponse.json( {
        errors: {
          firstname: formErrors?.firstname,
          lastname: formErrors?.lastname,
          dob: formErrors?.dob,
          phone: formErrors?.phone,
          address: formErrors?.address,
          bank_acct_name: formErrors?.bank_acct_name,
          bank_acct_no: formErrors?.bank_acct_no
        }
      })
    }


    // ---------------------remove next line after validation testing!!!
    console.log(filledForm)
    return NextResponse.json({success: "Nicely filled"})


    // try to upload
    const data = await request.formData();
    const idFile: File | null = data.get("id file") as unknown as File;
    // s3 upload

    // then save entry into database

    return NextResponse.json(
      "", 
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
};