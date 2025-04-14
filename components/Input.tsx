"use client"

import { ChangeEventHandler, ReactNode } from "react";

export interface InputProps {
  title?: string;
  tag: string;
  iconUrl?: string;
  FieldError?: boolean;
  onChange?: ChangeEventHandler;
  additionalStyle?: string;
  placeholder: string;
  id?: string;
  name: string;
  type: string;
  value?: string;
  required: boolean;
  pattern?: string;
  min?: string;
  max?: string;
  errorMessage?: string;
}

export interface RadioProps {
  title: string;
  tag: string;
  FieldError?: boolean;
  onChange?:  (e: React.ChangeEvent<HTMLInputElement>) => void;
  additionalStyle?: string;
  name: string;
  options: string [];
  required: boolean;
  errorMessage?: string;
}

export interface SelectProps {
  title: string;
  tag: string;
  FieldError?: boolean;
  onChange?: ChangeEventHandler;
  additionalStyle?: string;
  name: string;
  options: string [];
  required: boolean;
  errorMessage?: string;
}

const InputField = ({props}: { props: InputProps }) => {
  // Get and parse the data
  var storedData:any = '{}';
  if (typeof window !== 'undefined') storedData = JSON.parse(sessionStorage.getItem('userData') || '{}');

  return (
    <div className={` ${props?.FieldError && "text-red border-red"} `}>
      <div>
       { props?.tag && <span className="text-md font-bold text-gray-900">{props.tag}</span> } {props.required && <span className="text-red-600">&#10038;</span>}
      </div>
      <div className={`mb-6 flex gap-3 items-center  rounded-sm bg-white hover:border-b-2 border-cyan-700 p-2 px-4 group  ${props?.FieldError && "text-red border-red"}`}>
        {/* { props.iconUrl && <Image src={props.iconUrl} alt={props?.tag}  width={16} height={16}/> } */}
        <input defaultValue={storedData && storedData[props.name]} title={props.errorMessage} required={props.required} pattern={props?.pattern} value={props?.value} type={props.type} min={props?.min} max={props?.max} placeholder={props?.placeholder} onChange={props?.onChange && props.onChange} className={`w-full outline-none  ${props?.FieldError && "placeholder:text-red border-red"} ${props?.additionalStyle && props.additionalStyle}`} name={props?.name} id={props?.id} />
      </div>
    </div>
  )
};

export const RadioField = ({props}: { props: RadioProps }) => {
  return (
    <div className="flex flex-col gap- p-4">
      <p className="font-bold text-md mb-4 lg:mb-6">{props.title} {props.required && <span className="text-red-600">&#10038;</span>}</p>
      {
        props.options.map((item: string, index) => (
          // <label key={index} className="mb-4 font-medium " htmlFor={props.name}>{item}
          //   <input required={props.required} type="radio" name={props.name} value={item} className="mr-3" />
          //   <span className="checkmark"></span>
          // </label>
          <div key={index} className="mb-4 font-medium" >
            <input title={props.errorMessage} onChange={props.onChange} required={props.required} type="radio" name={props.name} value={item} className="mr-3" />
            <label  className="mb-4 font-medium " htmlFor={props.name}>{item} </label>
            <span className="checkmark"></span>
          </div>
        ))
      }
    </div>
  )
}

export const SelectField = ({props}: { props: SelectProps }) => {
  return (
    <div>
      <label htmlFor={props.name} className="font-bold text-md mb-1">{props.title}</label><span className="text-red-700">&#10038;</span>
      <select title={props.errorMessage} name={props.name} required onChange={props.onChange} className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700">
        <option value="">Select an option</option>
        {props.options.map((item: string, index: number) => (
          <option key={index}  value={item}>{item}</option>
        ))}
      </select>
    </div>
  )
};


export default InputField;
