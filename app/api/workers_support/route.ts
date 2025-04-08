import { NextRequest, NextResponse } from "next/server";


export interface WorkerComplaintType {
  lga: string;
  ward: string;
  data: string;
}

export const POST = async (request: NextRequest) => {

  try {
    const formEntry = await request.formData();
    const complaintForm: WorkerComplaintType = {
      lga: formEntry.get("lga") as string || "",
      ward: formEntry.get("ward") as string || "",
      data: formEntry.get("data") as string || "",
    };

    console.log(complaintForm)

    // save to db (after table creation by Chee-zaram)

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