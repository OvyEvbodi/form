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
    const createdAt = new Date().toLocaleDateString();

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
      const separator = "+";
      
      const dailyRecord = {
        number: person.split(separator)[0],
        name: person.split(separator)[1],
        ward: person.split(separator)[2],
        designation: person.split(separator)[3],
        created_at: createdAt,
        attendance_date: attendanceData.date,
        id:  uuidv4()
      };

      console.log(dailyRecord, tableName)

      // const addEntry = await (db[tableName as keyof typeof db] as any).create({ 
      //   data: {
      //     ...dailyRecord
      //   }
      // });

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
