import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";



export const POST = async (request: NextRequest) => {
  let initialRole = "";

  try {
    const phoneNumber = await request.json();
    console.log(phoneNumber)

    const db = new PrismaClient();

    const listOfRoles = [
      "lga_supervisor_application", 
      "ward_supervisor_application", 
      "data_clerk_application"
    ] as const;

    type RoleTable = (typeof listOfRoles)[number];
    const applicantData = await Promise.all(
      listOfRoles.map(async (roleTable) => {
        const result = await (db[roleTable as keyof typeof db] as any).findFirst({
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
    
    if (!hasValidEntry) {
      return NextResponse.json({
        message: "Not found! Invalid applicant. Please check the phone number and try again."
      }, {status: 400})
    }

    const initialEntry = applicantData.flatMap(Object.values).find(entry => entry !== null);
    delete (initialEntry as any).total_points;
    // console.log(initialEntry)

    const regInfo = await db.shortlisted_applicant_form.findFirst({
      where: { phone_number: phoneNumber }
    }) || null;

    console.log(regInfo)

    return NextResponse.json({
      data: {
        initialEntry,
        initial_role: initialRole,
        regInfo
      }
    }, {status: 200})


  } catch(error) {
    console.warn("Unable to fetch applicant")
    console.error(error)

    return NextResponse.json(
      { errors: "Internal Server Error" },
      { status: 500 }
    )
  }
};