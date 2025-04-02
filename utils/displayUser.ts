import { Prisma, PrismaClient } from "@prisma/client";

const getApplicant = async (phoneNumber: string) => {
  // search database 
  
  // download ID file
  try {
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
          return result
        }
        // return {[roleTable]: result};
      })
    );
    

    return applicantData
  } catch(error) {
    console.warn("Error fetching applicant")
    console.error(error)
  }
};

export default getApplicant