"use client"

import { bankList, bankNames, lgaList, lgaWardsMap } from "@/data";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { RadioField } from "@/components/Input";

const AddRecords = (session: any) => {
  const router = useRouter();
  const initialState: any = {};
  const [ view, setView ] = useState(1);
  const [ accountNo, setAccountNo ] = useState("");
  const [ bank, setBank ] = useState("");
  const [ accountNoError, setAccountNoError ] = useState(false);
  const [ bankError, setBankError ] = useState(false);
  const [ designation, setDesignation ] = useState("");
  const [ nubanLoading, setNubanLoading ] = useState(false);
  const lga = session.user.lga;
  const [ ward, setWard ] = useState("");
  const [ name, setName ] = useState("");
  const [ phone, setPhone ] = useState("");
  const wards = lga ? lgaWardsMap[lga] : [];
  const [ wardError, setWardError ] = useState(false);
  const [ nameError, setNameError ] = useState(false);
  const [ phoneError, setPhoneError ] = useState(false);
  const [ designationError, setDesignationError] = useState(false);

  
  const handleAccountNoChange  = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNoError(false)
    setName("")
    if (event.target.value.trim().length !== 10
      || Number.isNaN(Number(event.target.value.trim())
    )) setAccountNoError(true)
    else setAccountNo(event.target.value.trim())
  };

  const handlePhoneNoChange  = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneError(false)
    if (event.target.value.trim().length !== 11
      || event.target.value[0] !== '0'
      || Number.isNaN(Number(event.target.value.trim())
    )) setPhoneError(true)
    else setPhone(event.target.value.trim())
  };

  const handleBankChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBankError(false)
    setName("")
    setBank(event.target.value)
  };

  const handleView = (viewRequest: number) => {

    if (!accountNo && !name && view === 1) {
      setNameError(true)
      setAccountNoError(true)
    } 
    else if (!accountNoError && name && !nameError && viewRequest === 2) setView(viewRequest)
    else if (viewRequest === 1) setView(viewRequest)
    
    if (viewRequest === 3 && !phone && !ward && !designation ) {
      setWardError(true)
      setPhoneError(true)
      setDesignationError(true)
    }
    else if (viewRequest === 3 && phoneError) setPhoneError(true)
    else if (viewRequest === 3 && !ward)  setWardError(true)
    else if (viewRequest === 3 && !designation) setDesignationError(true)
    else if (viewRequest === 3) setView(viewRequest)

  };

  const handleCheckBankDetails = async () => {

    setNubanLoading(true)
    setNameError(false)
    setName("")
    const bankCode = bankList[bank];

    try {
      const url = `https://app.nuban.com.ng/api/${process.env.NEXT_PUBLIC_NUBAN_API_KEY}?bank_code=${bankCode}&acc_no=${accountNo}`;
      const {data, status} = await axios.get(url);
      if (status === 200) {
        if (data instanceof Array) {
          const nubanBankName = data[0].bank_name;
          const nubanAccName = data[0].account_name;
          // understand result and return all accounts
          setName(nubanAccName)
        } else {
          console.log("Invalid")
          setNameError(true)
        }
        
      } else {
        
        console.log("Error. Please try again.")
      }
    } catch (error) {
      console.error(error)
    }
    setNubanLoading(false)
  };

  const handleWardChange  = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setWardError(false)
    setWard(event.target.value)
  };
  const handleDesignationChange  = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDesignationError(false)
    setDesignation(event.target.value)
    console.log(event.target.value)
  };

  const designationProps = {
    title: "Designation",
    tag: "designation",
    FieldError: false,
    name: "designation",
    options: ["Data Clerk", "Local guide"],
    required: true,
    onChange: handleDesignationChange
  };

  const handleAddNewRecord: (prevState: any, formData: FormData) => Promise<any> = async (prevState: any, formData: FormData) => {

        const result = await fetch("/api/new_record", {
          method: "POST",
          body: formData
        });
  
        const feedback = await result.json();
    
        if (result.status === 200) router.push("/thank-you")
       
        return {
          error: feedback.error || null,
          success: feedback.success || null,
          data: feedback.data || null,
        } as any
      };
      const [ state, action, isPending ] = useActionState(handleAddNewRecord, initialState);

  return (
    <div className="sm:min-h-8/12 sm:min-w-2/3 text-gray-700 text-sm lg:max-w-[860px] p-4 sm:p-10 rounded-md max-w-screen bg-linear-to-b from-cyan-100/70 via-gray-300/80 to-gray-200/80">
      <div>
        <h1 className="py-2 sm:py-6 text-cyan-800 text-lg sm:text-3xl font-bold">New Records Form</h1>
      </div>
      <form action={action}>
        <section className={view !== 1 ? "hidden" : "flex flex-col gap-6"}>
          <div>
            <div>
              <h2 className="py-2 sm:pb-5 text-lg sm:text-xl font-bold">Bank Details</h2>
            </div>
            <div>
              <div className="mb-2">
                <label htmlFor="account_no" className="font-bold text-md mb-1">Bank Account number</label><span className=" ml-1 text-red-700">&#10038;</span>
                <input
                  type="text"
                  name="account_no"
                  onChange={handleAccountNoChange}
                  className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700"
                  placeholder="Enter 10-digit account number"
                />
                <div className={`mt-1 h-4  ${accountNoError && "text-xs text-red-700"} `}>{accountNoError && "Account number must be 10 digits"}</div>
              </div>
              <div className="mb-2">
                <label htmlFor="bank" className="font-bold text-md mb-1">Bank Name</label><span className=" ml-1 text-red-700">&#10038;</span>
                <select name="bank" value={bank} required onChange={ handleBankChange } className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700">
                  <option value="">Select bank</option>
                  {bankNames.map((item: string, index: number) => (
                    <option key={index}  value={item}>{item}</option>
                  ))}
                </select>
                <div className={`mt-1 h-4  ${bankError && "text-xs text-red-700"} `}>{bankError && "Please choose a bank"}</div>
              </div>
              <div>
                <input type="hidden" value={name} name="name" />
                <div className="text-green-800">{name && name}</div>
                <div className={`mt-1 h-4  ${nameError && "text-xs text-red-700"} `}>{nameError && "Invalid bank details. Please check and try again"}</div>
              </div>
            </div>
          </div>
          <div
            onClick={ handleCheckBankDetails }
            className={`self-end inline-block cursor-pointer py-2 px-6 md:px-12 text-white font-semibold capitalize bg-cyan-800 rounded-sm  hover:bg-cyan-900 transition-all ${nubanLoading && "hover:bg-gray-700 hover:text-gray-300 hover:cursor-not-allowed"}`}
            >
              {nubanLoading ? "Checking..." : "Get name"}
          </div>
          <div 
            onClick={() => handleView(2)}
            className="inline-block cursor-pointer py-2 px-6 md:px-12 text-white font-semibold capitalize bg-cyan-800 rounded-sm  hover:bg-cyan-900 transition-all"
          >
            Next
          </div>
        </section>
        <section className={view !== 2 ? "hidden" : "flex flex-col gap-6"}>
          <div>
            <div>
              <h2 className="py-2 sm:pb-5 text-lg sm:text-xl font-bold">Staff Details</h2>
            </div>
            <div>
              <div className="mb-2">
                  <label htmlFor="phone_no" className="font-bold text-md mb-1">Phone Number</label><span className=" ml-1 text-red-700">&#10038;</span>
                  <input
                    type="text"
                    name="phone_no"
                    onChange={handlePhoneNoChange}
                    className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700"
                    placeholder="Enter 11-digit phone number"
                  />
                  <div className={`mt-1 h-4  ${phoneError && "text-xs text-red-700"} `}>{phoneError && "Phone number must be 11 digits and start with '0'"}</div>
                </div>
                <div className="mb-2">
                  <label htmlFor="ward" className="font-bold text-md mb-1">Ward</label><span className=" ml-1 text-red-700">&#10038;</span>
                  <select  name="ward" value={ward} required disabled={!lga} onChange={handleWardChange} className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700">
                    <option value="">Choose a ward</option>
                    {
                      wards.map((item: string, index: number) => (
                        <option key={index}  value={item}>{item}</option>
                      ))
                    }
                  </select>
                  <div className={`mt-1 h-4  ${wardError && "text-xs text-red-700"} `}>{wardError && "Please select a ward"}</div>
                </div>
                <div>
                  <RadioField props={designationProps} />
                  <div className={`mt-1 h-4  ${designationError && "text-xs text-red-700"} `}>{designationError && "Please choose a designation"}</div>
                </div>
                <div>
                <input type="hidden" value={lga} name="lga"  />
                </div>
                {/* <div>{JSON.stringify(lga)}</div> */}
              </div>
          </div>
          <div className="flex justify-between">
            <div 
              onClick={() => handleView(1)}
              className="inline-block cursor-pointer py-2 px-6 md:px-12 text-white font-semibold capitalize bg-cyan-800 rounded-sm  hover:bg-cyan-900 transition-all"
            >
              back
            </div>
            <div 
              onClick={() => handleView(3)}
              className="inline-block cursor-pointer py-2 px-6 md:px-12 text-white font-semibold capitalize bg-cyan-800 rounded-sm  hover:bg-cyan-900 transition-all"
            >
              Next
            </div>
          </div>
                  
        </section>
        <section className={view !== 3 ? "hidden" : "flex flex-col gap-6"}>
          <div 
                onClick={() => handleView(2)}
                className="self-start cursor-pointer py-2 px-6 md:px-12 text-white font-semibold capitalize bg-cyan-800 rounded-sm  hover:bg-cyan-900 transition-all"
              >
                back
              </div>
          <button
            type="submit"
            className={`"inline-block cursor-pointer my-4 py-3 px-6 md:px-12 w-full text-white font-semibold capitalize bg-cyan-800 rounded-sm hover:bg-cyan-900 transition-all duration-300 ease-in-out  `}
          >
            Create Record
          </button>
        </section>
      </form>
      
    </div>
  )
}

export default AddRecords