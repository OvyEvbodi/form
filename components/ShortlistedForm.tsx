'use client'

import Button from "@/components/Button";
import { useActionState, useState, useRef } from "react";
import { lgaList, lgaWardsMap } from "@/data";
import BeatLoader from "react-spinners/BeatLoader";
import ClockLoader from "react-spinners/ClockLoader";
import Link from "next/link";
import { POST } from "@/app/api/file_upload/route";
import { ievShortlistData, IEVFormProps } from "@/data/shortlisted_questions";
import InputField, { InputProps, RadioField, RadioProps, SelectField, SelectProps } from "@/components/Input";

// create asterisks component

const handleSubmit = async (prevState: any, formData: FormData) => {
  const saveData = await fetch("/api/file_upload", {
    method: "POST",
    body: formData
  })
};

const FormTemplate = (props: IEVFormProps) => {
  const [state, action, isPending] = useActionState(handleSubmit, undefined);
  const [page, setPage] = useState(1);
  const [lga, setLga] = useState("");
  const [ward, setWard] = useState("");
  const [fileName, setFileName] = useState("");
  const uploadInputRef = useRef<HTMLInputElement | null > (null);


  const handleLgaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setLga(event.target.value)
    setWard('')
  };

  const handleWardChange  = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setWard(event.target.value)
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const idFile = event.target.files?.[0];
    setFileName(idFile?.name ?? "")
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
            <label htmlFor="ward" className="font-bold text-md mb-1">Name of Ward</label><span className="text-red-700">&#10038;</span>
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
            <div onClick={handleChooseFile} className="bg-cyan-800 max-w-max py-2 px-8 text-white font-semibold hover:bg-gray-700">Upload file <span className="text-red-700">&#10038;</span></div>
            <span className="my-1 text-sm text-gray-500">{fileName}</span>
            {/* {
              
              state.errors?.id_file && (<div className="my-2 border-b-1 border-red-700 text-sm text-red-700">
                  {state.errors?.id_file}
                </div>)
              } */}
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
              {
                item.FieldError && (<div className="my-2 border-b-1 border-red-700 text-sm text-red-700">
                  {item.errorMessage}
                </div>)
              }
              </div>
            ))
          }
          {
            props.secondSelectFields && props.secondSelectFields.map((item: SelectProps, index) => (
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
          <div className="flex gap-4 mt-4">
            <Button props={props.buttonInfo} />
          </div>
        </div>
        {/* <div className="mt-2 text-center text-sm text-gray-600 font-medium transition-all">
          <p>{props.footerText} <Link href={props.footerLink} className="text-cyan-950 font-medium hover:underline hover:text-cyan-800">{props.footerLinkText}</Link> </p>
        </div> */}
      </form> 
      { isPending ? <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen bg-neutral-900/85"><div className="p-12 sm:px-20 bg-gray-100 rounded-lg font-bold text-xl text-center max-w-md"><ClockLoader color="#169285" /></div></div> : <div></div>}
    </div>
  )
};

const IEVForm = () => {
  
  return (
    <div className="md:bg-light_grey min-h-screen flex justify-center items-center">
      <FormTemplate {...ievShortlistData}/>
    </div>
  )
};

export default IEVForm;
