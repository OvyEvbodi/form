"use client"

import { lgaList } from "@/data";
import { useActionState } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface BankVerResponse extends Response {
  error?: string;
  success?: string;
  lga?: string;
  data?: any;
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
            className="lg:min-w-[227px] sm:min-h-[46px] cursor-pointer py-[11px] px-[27px] text-white font-semibold capitalize bg-cyan-800 rounded-lg hover:bg-cyan-900 transition-all"
          >
            Verify
          </button>
        </form>
        {
          state.lga && !state.error && (
            <div>{`${state.lga} LGA Bank Verifification Summary`}</div>
          )
        }
        {
          state.data && 
            state.data.map((entry: any, idx: any) => (
              <div key={idx} className="my-6">
                <div className={entry.message !== "successful" ? "text-red-800" : ""}>{JSON.stringify(entry, null, 4)}</div>
              </div>
            )
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
