'use client'

import Button from "@/components/Button";
import { useActionState, useState, useRef } from "react";
import { lgaList, lgaWardsMap } from "@/data";
import BeatLoader from "react-spinners/BeatLoader";
import ClockLoader from "react-spinners/ClockLoader";
import { idBankVerificationData, IDBankVerificationFormProps } from "@/data/id_bank_verification";
import InputField, { InputProps, RadioField, RadioProps, SelectField, SelectProps } from "@/components/Input";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";


// create asterisks component

interface DbResponse extends Response {
  zodErrors?: {
    phone_number?: string;
    whatsapp?: string;
    bank_acct_name?: string;
    bank_acct_no?: string;
    id_file?: string;
    message?: string;
  };
  errors?: {
    message: string;
  }
  success?: {
    message: string;
  };
  notShortlisted?: {
    message: string;
    accountNumber: string;
  };
  castedForm?: any;

}



const FormTemplate = (props: IDBankVerificationFormProps) => {
  const [page, setPage] = useState(1);
  const [lga, setLga] = useState("");
  const [ward, setWard] = useState("");
  const uploadInputRef = useRef<HTMLInputElement | null > (null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);


  const router = useRouter();

  const handleSubmit: (prevState: any, formData: FormData) => Promise<DbResponse> = async (prevState: any, formData: FormData) => {
    const saveData: DbResponse = await fetch("/api/id_payment_details", {
      method: "POST",
      body: formData
    })

    const feedback = await saveData.json();
    
    console.log(feedback)

    feedback.castedForm && sessionStorage.setItem('userData', JSON.stringify(feedback.castedForm));
    setFileName("")
    setFileSize(0)
    return {
      errors: feedback.errors || null,
      success: feedback.success || null,
      notShortlisted: feedback.notShortlisted || null,
      zodErrors: feedback.zodErrors || null,
    } as DbResponse
  };

  const [state, action, isPending] = useActionState(handleSubmit, undefined);


  if (state?.success?.message) {
    router.push("/thank-you")
  }

  const handleLgaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setLga(event.target.value)
    setWard('')
  };

  const handleWardChange  = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setWard(event.target.value)
  };

  const fileSizeInMB = (size: number) => (size / (1024 * 1024));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const idFile = event.target.files?.[0];
    setFileName(idFile?.name ?? "")
    const calculatedSize = fileSizeInMB(idFile!.size);
    setFileSize(calculatedSize)
  };

  const handleChooseFile = (event: React.MouseEvent<HTMLDivElement>) => {
    uploadInputRef.current?.click()
  };


  const wards = lga ? lgaWardsMap[lga] : [];

  return (
    <div className="text-sm md:text-medium lg:max-w-[860px] opacity-[0.956] p-4 lg:p-12 rounded-lg max-w-screen bg-linear-to-b from-cyan-50 via-gray-200 to-gray-100">
      <div className={page === 2 ? "hidden sm_img_holder " : "sm_img_holder "}>
        <div className="bg-cyan-800 opacity-90 rounded-md text-white p-4 md:p-0 sm:bg-transparent sm:opacity-100 sm:text-black">
          <h1 className="pt-4 my-4 text-3xl font-extrabold text-gray-800">{props.title}</h1>
            <p className="mb-4 font-medium text-sm lg:text-medium">
              {props.description}
            </p>
        </div>
      </div>
      <form name="iev" className="p-4" action={action}>
        <div id="personal info" >
          <h2 className="text-cyan-900 font-bold text-lg my-4">{props.firstSectionTitle}</h2>
          <p className="mb-4">
            {props.firstSectionDescription}
          </p>
          {
            props.firstTextFields && props.firstTextFields.map((item: InputProps, index) => (
              <div key={index} >
                <InputField props={item} />
              {
                item.FieldError && (<div className="my-2 border-b-1 border-red-700 text-sm text-red-700">
                  {item.errorMessage}
                </div>)
              }
              </div>
            ))
          }
          {/* ------------------2 dropdowns not dynamic -------------- */}
          <div className="mb-2">
            <label htmlFor="lga" className="font-bold text-md mb-1">LGA of Residence</label><span className="text-red-700">&#10038;</span>
            <select name="lga" value={lga} required onChange={ handleLgaChange } className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700">
              <option value="">Select LGA</option>
              {lgaList.map((item: string, index: number) => (
                <option key={index}  value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="ward" className="font-bold text-md mb-1">Ward of Residence</label><span className="text-red-700">&#10038;</span>
            <select  name="ward" value={ward} required disabled={!lga} onChange={handleWardChange} className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700">
              {/* <option value="">Choose a ward</option> */}
              {
                wards.map((item: string, index: number) => (
                  <option key={index}  value={item}>{item}</option>
                ))
              }
            </select>
          </div>
          {
            props.firstSelectFields && props.firstSelectFields.map((item: SelectProps, index) => (
              <div key={index} >
                <SelectField props={item} />
              {
                item.FieldError && (<div className="my-2 border-b-1 border-red-700 text-sm text-red-700">
                  {item.errorMessage}
                </div>)
              }
              </div>
            ))
          }
          {/* ------------------2 dropdowns not dynamic -------------- */}
          {
            props.firstRadioFields && props.firstRadioFields.map((item: RadioProps, index) => (
              <div key={index} >
                <RadioField props={item} />
              {
                item.FieldError && (<div className="my-2 border-b-1 border-red-700 text-sm text-red-700">
                  {item.errorMessage}
                </div>)
              }
              </div>
            ))
          }
          <div className="p-2 mb-4">
            <input ref={uploadInputRef} type="file" name="id_file" onChange={handleFileChange} className="absolute right-[999999999px]" />
            <div onClick={handleChooseFile} className="bg-cyan-800 max-w-max py-2 px-8 text-white font-semibold hover:bg-gray-700">You must click here to upload ID card selected (max: 2MB)<span className="text-red-700">&#10038;</span></div>
            <span className={fileSize > 2.00 ? "my-1 text-sm text-red-700" : "my-1 text-sm text-gray-500"}>{fileName} {fileSize > 0 && `(File size: ${fileSize.toFixed(2)}MB)`}</span>
            {fileSize > 2.00 ? <div className="my-1 text-sm text-red-700">This file is too large! Max size: 2MB</div> : <div></div>}
            {
              state?.zodErrors?.id_file && 
              (
              <div className="my-2 text-sm text-red-700">
                {state.zodErrors?.id_file[0]}
              </div>
              )
            }
          </div>
          {props.cautionText && <p className="text-xs mb-6">{props.cautionText}</p>}
        </div>
        {/* ----------- section 2 ---------- */}
        <div id="bank info" >
        <h2 className="text-cyan-900 font-bold text-lg my-4">{props.secondSectionTitle}</h2>
          <p className="mb-4">
            {props.secondSectionDescription}
          </p>
          {
            props.secondTextFields && props.secondTextFields.map((item: InputProps, index) => (
              <div key={index} >
                <InputField props={item} />
                {/* {
                  state?.errors?.bank_acct_name && 
                  (
                  <div className="my-2 text-sm text-red-700">
                    {state.errors?.bank_acct_name}
                  </div>
                  )
                } */}
              </div>
            ))
          }
          {
            props.secondSelectFields && props.secondSelectFields.map((item: SelectProps, index) => (
              <div key={index} >
                <SelectField props={item} />
                {/* {
                  state?.errors?.bank_acct_no && 
                  (
                  <div className="my-2 text-sm text-red-700">
                    {state.errors?.bank_acct_no}
                  </div>
                  )
                } */}
              </div>
            ))
          }
          {
            props.secondRadioFields && props.secondRadioFields.map((item: RadioProps, index) => (
              <div key={index} >
                <RadioField props={item} />
              {
                item.FieldError && (<div className="my-2 border-b-1 border-red-700 text-sm text-red-700">
                  {item.errorMessage}
                </div>)
              }
              </div>
            ))
          }
          {
            state?.notShortlisted && (
              <div className={!state?.notShortlisted ? "" : "my-3 text-red-900 font-medium p-3 bg-red-200 border rounded-sm border-red-900"}>{state.notShortlisted.message}<br/> Your current number is: {state?.notShortlisted.phoneNumber}</div>
            )
          }
          {
            state?.errors && (
              <div className="my-3 text-red-900 font-medium p-3 bg-red-200 border rounded-sm border-red-900">{state.errors.message}</div>
            )
          }
          {
            state?.zodErrors && Object.entries(state.zodErrors).map(([key, value]) => (
              <div key={key} className="my-3 text-red-900 font-medium p-3 bg-red-200 border rounded-sm border-red-900">{value[0]}</div>
            ))
          }
          <div className="flex gap-4 mt-4">
            <Button props={props.buttonInfo} />
          </div>
        </div>
        {/* <div className="mt-2 text-center text-sm text-gray-600 font-medium transition-all">
          <p>{props.footerText} <Link href={props.footerLink} className="text-cyan-950 font-medium hover:underline hover:text-cyan-800">{props.footerLinkText}</Link> </p>
        </div> */}
      </form> 
      { isPending ? 
      <div className="fixed top-0 left-0 flex flex-col justify-center items-center w-screen h-screen bg-neutral-900/85">
        <div className="text-center text-lg text-white font-bold mb-6">Please wait while we verify your eligibility</div>
        <div className="p-12 sm:px-20 bg-gray-100 rounded-lg font-bold text-xl text-center max-w-md">
          <ClockLoader color="#169285" />
        </div>
      </div> :
      <div>
      </div>}
    </div>
  )
};

const IDBankVerificationForm = () => {
  
  return (
    <div className="md:bg-light_grey min-h-screen flex justify-center items-center">
      <ErrorBoundary fallback={<div className="text-center">Something's not right. Please refresh the page and make sure your file is under 2mb and that you haven't registered before.</div>}>
        <FormTemplate {...idBankVerificationData}/>
      </ErrorBoundary>
    </div>
  )
};

export default IDBankVerificationForm;
