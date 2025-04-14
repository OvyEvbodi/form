import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';


export interface AttendanceDbDataType {
  lga: string;
  attendanceList: string [];
  date: string;
}

export const POST = async (request: NextRequest) => {

  try {
    const createdAt = new Date();

    const formEntry = await request.formData();


    const attendanceData: AttendanceDbDataType = {
      attendanceList: formEntry.getAll("staff") as string [] || [],
      lga: formEntry.get("lga") as string || "",
      date: formEntry.get("attendance_date") as string || ""
    };
      
    console.log(attendanceData)

    // save to db 
    const db = new PrismaClient();
    const tableName = `attendance_${attendanceData.lga.toLowerCase().replace(" ", "_")}`;

    attendanceData.attendanceList.forEach( async (person: string) => {
      const separator = "+"; // to make future addition of info easy
      const name = person.split(separator)[1];

      const dailyRecord = {
        account_number: person.split(separator)[0],
        created_at: createdAt,
        attendance_date: attendanceData.date,
        id: uuidv4()
      };

      console.log(dailyRecord, tableName)

      try {
        const addEntry = await (db[tableName as keyof typeof db] as any).create({ 
          data: {
            ...dailyRecord
          }
        });
        console.log("successful", addEntry)
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // Specific handling for phone_number + date unique violation
          if (error.code === 'P2002' ) {
            console.log(error.meta)
            console.log(`Duplicate marking! ${name}'s attendance for ${dailyRecord.attendance_date} has already been marked`)
            return "duplicate entry";
          }
        }
      }
      
    })


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
