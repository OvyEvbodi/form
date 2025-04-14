import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';


export interface AttendanceRecordDataType {
  name: string;
  phone_number: string;
  lga: string;
  created_at: Date;
  ward: string;
  designation: string;
  account_number: string;
  bank_name: string;
  id: string;
}

export const POST = async (request: NextRequest) => {

  try {
    const createdAt = new Date();
    const id = uuidv4();

    const formEntry = await request.formData();


    const newRecordData: AttendanceRecordDataType = {
      name: formEntry.get("name") as string || "",
      phone_number: formEntry.get("phone_no") as string || "",
      lga: formEntry.get("lga") as string || "",
      ward: formEntry.get("ward") as string || "",
      designation: formEntry.get("designation") as string || "",
      account_number: formEntry.get("account_no") as string || "",
      bank_name: formEntry.get("bank") as string || "",
      created_at: createdAt,
      id
    };
      
    console.log(newRecordData)

    // save to db 
    const db = new PrismaClient();
    // new_staff
    const newStaffEntry = await db.new_staff.create({
      data: {
        ...newRecordData
      }
    })

    console.log(newStaffEntry)

    return NextResponse.json({
      success: {
        mesage: "successful"
      }
    }, {status: 200})
  } catch (error) {
    console.error(error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
              // Specific handling for phone_number + date unique violation
              if (error.code === 'P2002' ) {
                console.log(error.meta && ( error.meta?.target as string[] ).includes('account_number'))
                console.log()
                return NextResponse.json({
                  error: {
                    message: `Duplicate record! This record has already been created. Please allow up to 24 hours for verification to be completed.`
                  }
                }, {status: 400})
              }
            }

    return NextResponse.json({
      error: {
        message: "Unable to add record, please try again."
      }
    }, {status: 500})
  }
};
