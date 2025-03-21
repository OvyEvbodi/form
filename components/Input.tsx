import { ChangeEventHandler, ReactNode } from "react";
import Image from "next/image";

export interface InputProps {
  tag: string;
  iconUrl?: string;
  FieldError?: boolean;
  onChange?: ChangeEventHandler;
  additionalStyle?: string;
  placeholder: string;
  id?: string;
  name?: string;
  type: string;
  value?: string;
  required: boolean;
}

export interface RadioProps {
  title: string;
  tag: string;
  FieldError?: boolean;
  onChange?: ChangeEventHandler;
  additionalStyle?: string;
  name: string;
  options: string [];
  required: boolean;
}

const InputField = ({props}: { props: InputProps }) => {
  return (
    <div className={` ${props?.FieldError && "text-red border-red"} `}>
      <div>
       { props?.tag && <span className="text-lg font-medium text-gray-900">{props.tag}</span> } {props.required && <span className="text-red-600">&#10036;</span>}
      </div>
      <div className={`mb-6 flex gap-3 items-center  rounded-sm bg-white hover:border-b-2 border-cyan-700 p-2 px-4 group  ${props?.FieldError && "text-red border-red"}`}>
        {/* { props.iconUrl && <Image src={props.iconUrl} alt={props?.tag}  width={16} height={16}/> } */}
        <input required={props.required} value={props?.value} type={props.type} placeholder={props.placeholder} onChange={props?.onChange && props.onChange} className={`w-full outline-none  ${props?.FieldError && "placeholder:text-red border-red"} ${props?.additionalStyle && props.additionalStyle}`} name={props?.name} id={props?.id} />
      </div>
    </div>
  )
};

export const RadioField = ({props}: { props: RadioProps }) => {
  return (
    <div className="flex flex-col gap- p-4">
      <p className="font-bold text-md mb-4 lg:mb-6">{props.title} {props.required && <span className="text-red-600">&#10036;</span>}</p>
      {
        props.options.map((item: string, index) => (
          <label key={index} className="mb-4 font-medium container">{item}
            <input required={props.required} type="radio" name={props.name} value={item} className="mr-3" />
            <span className="checkmark"></span>
          </label>
        ))
      }
    </div>
  )
}



export default InputField;
