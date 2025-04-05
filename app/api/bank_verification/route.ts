import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { lgaBankDetailsList } from "@/data/bank_dummy_data";
import axios from "axios";

interface BankDataType {
  phone_number: string;
  bank_code: string;
  account_number: string;
  name: string;
  bank_name: string;
}

export const POST = async (request: NextRequest) => {

  try {

    // get an lga from req
    const lgaBankForm = await request.formData();
    const lgaEntry: string = lgaBankForm.get("lga") as string || "";
    console.log(lgaEntry)

    // replace space with underscore, make all lowercase
    const lgaName: string = lgaEntry.toLocaleLowerCase().replace(" ", "_")
    console.log(lgaName)

    // query their lga table
    const db = new PrismaClient();

    const result = await (db[lgaName as keyof typeof db] as any).findMany({
      select: {
        phone_number: true,
        bank_code: true,
        account_number: true,
        name: true,
        bank_name: true
      },
    })
    // console.log(result)

    // create a list of bank account and bank code obj
    // we should already have a list from the db query
    const bankDetailsList: BankDataType [] = result;

    // map that list and query api
    const nubanResponse = await Promise.all( bankDetailsList.map( async (userDetails) => {
      // query
      const url = `https://app.nuban.com.ng/api/${process.env.NUBAN_API_KEY}?bank_code=${userDetails.bank_code}&acc_no=${userDetails.account_number}`;
      const {data, status} = await axios.get(url);
      if (status === 200) {
        if (data instanceof Array) {
          const nubanBankName = data[0].bank_name;
          const nubanAccName = data[0].account_name;
          // understand result and return all accounts
          return {
            ...userDetails,
            nuban_bank_name: nubanBankName,
            nuban_acc_name: nubanAccName,
            message: "successful"
          }
        } else {
          return {
            ...userDetails,
            message: "Unable to retrieve account details"
          }
        }
        // console.log(data)

      } else {
        return {
          error: "Error. Please try again."
        }
      }
    }))
    console.log(nubanResponse)

    // get an lga from req
    // replace space with underscore, make all lowercase
    // query their lga table

    // create a list of bank account and bank code obj
    // map that list and query api
    // understand result and return all invalid accounts
    // search for corresponding entries against the initial data from db (no second db trip!)

    return NextResponse.json({
      succeess: `Successfully verified bank details for ${lgaEntry} LGA.`,
      data: nubanResponse
    }, {status: 200})

  } catch (error){
    console.error(error)
    return NextResponse.json({
      error: "Error verifying bank details for this LGA. Please try again."
    }, {status: 500})
  }
};