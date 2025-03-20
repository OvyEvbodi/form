'use client'

import InputField, { InputProps, RadioField, RadioProps, ra } from "@/components/Input";
import Button, { ButtonProps } from "@/components/Button";
import { useActionState } from "react";
import { handleFormSubmit } from "@/utils/handleFormSubmit";

export interface IEVFormProps {
  logoUrl?: string;
  title: string;
  description?: string;
  textFields: InputProps[];
  radioFields: RadioProps[];
  buttonInfo: ButtonProps;
  footerText?: string;
  footerLink?: string;
  accentColour?: string;
  footerLinkText?: string;
  cautionText?: string;
}

const FormTemplate = (props: IEVFormProps) => {
  const [result, action, isPending] = useActionState(handleFormSubmit, null)
  console.log(result)

  return (
    <div>
      <form className="" action={action}>
          {
            props.textFields.map((item: InputProps, index) => (
              <InputField key={index} props={item} />
            ))
          }
          {
            props.radioFields.map((item: RadioProps, index) => (
              <RadioField key={index} props={item} />
            ))
          }
          {props.cautionText && <p className="text-xs mb-6">{props.cautionText}</p>}

          <Button props={props.buttonInfo} />
        </form>
    </div>
  )
};


const IEVForm = () => {

  const inputFieldsData: InputProps[] = [
    {
      tag: "name",
      placeholder: "John Doe",
      FieldError: false,
      name: "name",
      id: "name",
      iconUrl: "/name_icon.png",
      type: "text",
      required: true
    },
    {
      tag: "phone number (11 digits)",
      placeholder: "Enter your phone number",
      FieldError: true,
      name: "phone number",
      id: "phone number",
      iconUrl: "/number_icon.png",
      type: "number",
      required: true
    },
    {
      tag: "email address",
      placeholder: "Enter your email",
      FieldError: true,
      name: "email",
      id: "email",
      iconUrl: "",
      type: "email"
    }
  ];

  const radioFieldsData: RadioProps [] = [
    {
      title: "Gender",
      tag: "gender",
      FieldError: true,
      name: "gender",
      options: ["male", "female"],
      cumpulsory: true
    },
    {
      title: "What is your highest educational qualification?",
      tag: "education",
      FieldError: true,
      name: "education",
      options: ["None", "Primary", "Secondary", "Tertiary"],
      cumpulsory: true
    },
    {
      title: "How fluent are you in Hausa?",
      tag: "hausa",
      FieldError: true,
      name: "hausa",
      options: ["Beginner", "Fluent", "Native", "I don't speak Hausa"],
      cumpulsory: true
    },
    {
      title: "How fluent are you in English?",
      tag: "english",
      FieldError: true,
      name: "english",
      options: ["Fluent", "Not Fluent"],
      cumpulsory: true
    },
  ]

  const buttonInfoData: ButtonProps = {
    text: "Submit",
    type: "button",
    filled: true,
    additionalStyle: "w-full"
  };

  const ievFormData: IEVFormProps = {
    title: "Login",
    description: "Add your details below to get back into the app",
    logoUrl: "/logo.png",
    textFields: inputFieldsData,
    radioFields: radioFieldsData,
    buttonInfo: buttonInfoData,
    footerText: "Don't have an account?",
    footerLinkText: "Create account",
    footerLink: "/signup",
    accentColour: "purple"
  };

  
  return (
    <div className="md:bg-light_grey min-h-screen flex justify-center items-center">
      <FormTemplate {...ievFormData}/>
    </div>
  )
};

export default IEVForm;