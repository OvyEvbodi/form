import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';


export interface WorkerComplaintType {
  lga?: string;
  ward?: string;
  name?: string;
  phone_number?: string;
  organization?: string;
  settlement?: string;
  type?: string;
  problem?: string;
  date?: string;
  id?: string;
  data?: string [] | string;
  fieldWork?: string [] | string;
  technology?:  string [] | string;
  resistance?:  string [] | string;
}

export const POST = async (request: NextRequest) => {

  try {
    const date = new Date().toLocaleDateString();
    const id = uuidv4();
    console.log(date)
    const formEntry = await request.formData();

    const complaintForm: any = [
      {data: formEntry.getAll("Data") as string [] || []},
      {fieldWork: formEntry.getAll("Fieldwork") as string [] || []},
      {technology: formEntry.getAll("Technology") as string [] || []},
      {resistance: formEntry.getAll("Resistance") as string [] || []},
    ];

    const bioForm = {
      lga: formEntry.get("lga") as string || "",
      ward: formEntry.get("ward") as string || "",
      name: formEntry.get("name") as string || "",
      phone_number: formEntry.get("phone_number") as string || "",
      organization: formEntry.get("org:") as string || "",
      settlement: formEntry.get("settlement") as string || "",
      date,
      id
    };

    // console.log(formEntry)
    // console.log(complaintForm)

    // save to db (after table creation by Chee-zaram)
    const db = new PrismaClient();

    for(const entry of complaintForm) {
      console.log(entry)
      for (const key in entry) {
        const problem = entry[key].toString();
        console.log(problem)
        console.log(key)
        const addEntry = await db.complaints.create({ 
          data: {
            ...bioForm,
            type: key,
            problem
          }
        });
      }
      
    }


    return NextResponse.json({
      success: {
        mesage: "successful"
      }
    }, {status: 200})
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      error: {
        message: "Unable to lodge complaint, please try again."
      }
    }, {status: 500})
  }
};