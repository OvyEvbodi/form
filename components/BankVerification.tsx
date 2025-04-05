"use client"

import { lgaList } from "@/data";
import { useActionState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import BankInfo from "@/components/BankInfo";
import { BankDataType } from "@/app/api/bank_verification/route";


interface BankVerResponse extends Response {
  error?: string;
  success?: string;
  lga?: string;
  data?: BankDataType;
}

const BankVerification = () => {

  const handleBankVerification: (prevState: any, formData: FormData) => Promise<BankVerResponse> = async (prevState: any, formData: FormData) => {
    const saveData: BankVerResponse = await fetch("/api/bank_verification", {
      method: "POST",
      body: formData
    })

    const lga = formData.get("lga")

    const feedback = await saveData.json();

    return {
      error: feedback.error || null,
      success: feedback.success || null,
      data: feedback.data || null,
      lga
    } as BankVerResponse
  };

  const initialState: any = {};
  const [ state, action, isPending ] = useActionState(handleBankVerification, initialState);

  return (
    <div className="bg-gray-300 flex flex-col gap-8 flex-wrap justify-center items-center min-h-screen min-w-screen p-6">
      <ErrorBoundary fallback={<div className="text-center">Something went wrong. Please refresh the page.</div>}>
        <h1 className="font-extrabold text-cyan-900 sm:text-2xl md:text-3xl capitalize">
          Bank details verification page (LGA level)
        </h1>
        <form 
          action={action}
          className="max-w-max bg-white shadow-xl rounded-md shadow-cyan-900 text-center p-12 flex flex-col gap-3"
        >
          <label htmlFor="lga" className="font-bold text-md capitalize text-gray-700">
              Select LGA
          </label>
          <select 
            name="lga" 
            required
            className="block mt-2 w-full bg-gray-200 p-2 rounded-md outline-none border-b-2 border-cyan-700"
          >
            <option value="">Please choose lga to verify </option>
            {
              lgaList.map((lga, idx) => (
                <option key={idx}>{lga}</option>
              ))
            }
          </select>
          <button
            type="submit"
            disabled={isPending}
            className={`"lg:min-w-[227px] sm:min-h-[46px] cursor-pointer py-[11px] px-[27px] text-white font-semibold capitalize bg-cyan-800 rounded-lg hover:bg-cyan-900 transition-all ${isPending && "hover:bg-gray-700 hover:text-gray-300 hover:cursor-not-allowed"}`}
          >
            {isPending ? "Checking details...." : "Verify"}
          </button>
        </form>
        {
          state.lga && !state.error && (
            <div>{`${state.lga} LGA Bank Verifification Summary`}</div>
          )
        }
          {
            state.data && 
            (
              <table className="p-4">
              <thead>
                <tr>
                  <th>serial no.</th>
                  <th>phone number</th>
                  <th>account number</th>
                  <th>account name</th>
                  <th>nuban account name</th>
                  <th>bank name</th>
                  <th>nuban bank name</th>
                  <th>status</th>
                </tr>
              </thead>
              <tbody>
                {

                  state.data.map((entry: BankDataType, idx: any) => {
                    const numberedEntry: BankDataType = {
                      ...entry,
                      idx
                    }; 
                    return (
                      <BankInfo props={numberedEntry}  key={idx}/>
                    )
                    
                  })
  
                }
              </tbody>
              </table>
            )
          }
        {
          state.error && (
            <div className="text-red-500 bg-red-50 px-4 py-4 rounded-md max-w-md text-center mb-4">{state.error}</div>
          )
        }
      </ErrorBoundary>
    </div>
  )
};

export default BankVerification;
