import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';


export interface AttendanceDbDataType {
  lga: string;
  attendanceList: string [];
  date: string;
}

export const POST = async (request: NextRequest) => {

  try {
    const date = new Date().toLocaleDateString();
    console.log(date)
    const formEntry = await request.formData();

    const attendanceData: AttendanceDbDataType = {
      attendanceList: formEntry.getAll("staff") as string [] || [],
      lga: formEntry.get("lga") as string || "",
      date: formEntry.get("attendance_date") as string || "",
    };
      
    console.log(attendanceData)

    // save to db 
    const db = new PrismaClient();

    // const addEntry = await db.attendance.create({ 
    //   data: {
    //     ...attendanceData
    //   }
    // });

    return NextResponse.json({
      success: {
        mesage: "successful"
      }
    }, {status: 200})
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      error: {
        message: "Unable to save attendance, please try again."
      }
    }, {status: 500})
  }
};
