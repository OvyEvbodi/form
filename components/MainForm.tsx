'use client'

import InputField, { InputProps, RadioField, RadioProps } from "@/components/Input";
import Button, { ButtonProps } from "@/components/Button";
import { useActionState, useEffect, useState } from "react";
import { handleFormSubmit } from "@/utils/handleFormSubmit";
import { lgaList, lgaWardsMap } from "@/data";
import { useGeolocated } from "react-geolocated";
import axios, { AxiosError } from "axios";



export interface IEVFormProps {
  logoUrl?: string;
  title: string;
  description?: string;
  textFields: InputProps[];
  perRadioFields: RadioProps[];
  proRadioFields: RadioProps[];
  buttonInfo: ButtonProps;
  footerText?: string;
  footerLink?: string;
  accentColour?: string;
  footerLinkText?: string;
  cautionText?: string;
}

const FormTemplate = (props: IEVFormProps) => {
  const [lastResult, action, isPending] = useActionState(handleFormSubmit, null);
  // const [filledForm, filledFields] = useForm({lastResult})
  const [page, setPage] = useState(1);
  const [lga, setLga] = useState("");
  const [ward, setWard] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [geolocationData, setGeolocationData] = useState("");
  const [consent, setConsent] = useState(false);


  const handleChangePage = (page: number) => {
    setPage(page)
  };

  const handleLgaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setLga(event.target.value)
    setWard('')
  };

  const handleWardChange  = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setWard(event.target.value)
  };

  const handleGeolocation = async(event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    try {
      const success = async (position: any) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setGeolocationData(JSON.stringify(position))
        setConsent(true)
      }

      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser")
      } else {
        console.log("Getting location")
        navigator.geolocation.getCurrentPosition(success); // add error callback
        console.log("successful")
      }
    
    } catch (error) {
      // for dev
      console.log(error)
    }
    
  };

  const wards = lga ? lgaWardsMap[lga] : [];


  return (
    <div className="lg:max-w-[860px] opacity-90 p-4 lg:p-12 rounded-lg max-w-screen bg-linear-to-b from-cyan-50 via-gray-200 to-gray-100">
      <div className="">
      <h1 className="pt-4 my-4 text-3xl font-extrabold text-gray-800">Kano State IEV Implementation Strategy - <span className="text-blue-500">LGA Supervisor</span> Application Form</h1>
        <p className="mb-4 font-medium">
          Thank you for your interest in the <span className="text-blue-500 font-bold">LGA Supervisor</span> role for the Kano State Identify Enumerate and Vaccinate (IEV) strategy implementation. This project is led by Clinton Health Access Initiative (CHAI) in collaboration with the National Primary Health Care Development Agency (NPHCDA) and the Kano State Primary Health Care Management Board (SPHCMB).
          <br /><br />
          This application form is designed to collect essential information about your background, experience, and qualifications to ensure a fair and thorough selection process.
          <br /><br />
          <span className="text-red-700">
            Please note that this application is open only to residents of Kano State. If you do not reside in Kano State, please do not apply. 
          </span>
          <br /><br />
          Take the time to complete all required fields accurately, as incomplete applications may not be considered. We appreciate your time and effort and look forward to reviewing your application.
          <br /><br />
          Best of luck!<br/>
          <span className="text-red-600">&#10036;</span> Required
        </p>
      </div>
      
      <form name="iev" className="" action={action}>
        <div className={consent ? "hidden" : ""}>
          <p className="mb-4 font-bold">
            Note: To proceed with your application, you must allow access to your GPS location. This is required to verify your eligibility for the IEV work in Kano State. Click the button below to enable location access.
          </p>
          <input type="text" name="latitude" value={latitude} onChange={() => console.log(latitude)} className="hidden"/>
          <input type="text" name="longitude" value={longitude} onChange={() => console.log(longitude)} className="hidden"/>
          <input type="text" name="geolocationData" value={geolocationData} onChange={() => console.log(geolocationData)} className="hidden"/>
          <div onClick={handleGeolocation} className="mb-4 lg:min-w-[227px] min-h-[46px] py-[11px] px-[27px] text-white font-semibold capitalize bg-cyan-700 rounded-lg hover:bg-cyan-900 transition-all">Grant Location Access</div>
        </div>
  
        <div id="personal info" className={page === 1 && consent ? "" : "hidden"}>
        <div className="text-cyan-900 font-bold text-lg">Personal Information</div>
          {
            props.textFields.map((item: InputProps, index) => (
              <InputField key={index} props={item} />
            ))
          } 
          <div className="mb-2">
            <label htmlFor="lga" className="font-bold text-md mb-1">LGA of Residence</label><span className="text-red-600">&#10036;</span>
            <select name="lga" value={lga} required onChange={ handleLgaChange }>
              <option value="">select lga</option>
              {lgaList.map((item: string, index: number) => (
                <option key={index}  value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="ward" className="font-bold text-md mb-1">Name of Ward</label><span className="text-red-600">&#10036;</span>
            <select  name="ward" value={ward} required disabled={!lga} onChange={handleWardChange}>
              {/* <option value="">Choose a ward</option> */}
              {
                wards.map((item: string, index: number) => (
                  <option key={index}  value={item}>{item}</option>
                ))
              }
            </select>
          </div>
          {
            props.perRadioFields.map((item: RadioProps, index) => (
              <RadioField key={index} props={item} />
            ))
          }
          {props.cautionText && <p className="text-xs mb-6">{props.cautionText}</p>}
          <div onClick={() => handleChangePage(2)} className="lg:min-w-[227px] min-h-[46px] py-[11px] px-[27px] text-white font-semibold capitalize bg-cyan-700 rounded-lg hover:bg-cyan-900 transition-all">Next</div>
        </div>
        <div id="professional info" className={page === 2 ? "" : "hidden"}>
        <div className="text-cyan-900 font-bold text-lg">Professional Assessment</div>
          {
            props.proRadioFields.map((item: RadioProps, index) => (
              <RadioField key={index} props={item} />
            ))
          }
          <div className="flex gap-4">
            <div onClick={() => handleChangePage(1)} className="lg:min-w-[227px] min-h-[46px] py-[11px] px-[27px] text-white font-semibold capitalize bg-gray-700 rounded-lg hover:bg-gray-400 transition-all">Back</div>
            <Button props={props.buttonInfo} />
          </div>
        </div>
      </form>
    </div>
  )
};


const IEVForm = () => {

  const inputFieldsData: InputProps[] = [
    {
      tag: "Name",
      placeholder: "John Doe",
      FieldError: false,
      name: "name",
      id: "name",
      iconUrl: "/name_icon.png",
      type: "text",
      required: true,
      additionalStyle: "capitalize"
    },
    {
      tag: "Date of Birth",
      placeholder: "",
      FieldError: false,
      name: "dob",
      id: "dob",
      iconUrl: "",
      type: "date",
      required: true
    },
    {
      tag: "Phone number (11 digits)",
      placeholder: "Enter your phone number",
      FieldError: true,
      name: "phone number",
      id: "phone number",
      iconUrl: "/number_icon.png",
      type: "number",
      required: true
    },
    {
      tag: "Email address",
      placeholder: "Enter your email",
      FieldError: true,
      name: "email",
      id: "email",
      iconUrl: "",
      type: "email",
      required: false
    }
  ];

  const perRadioFieldsData: RadioProps [] = [
    {
      title: "Gender",
      tag: "gender",
      FieldError: true,
      name: "gender",
      options: ["Male", "Female"],
      required: true
    },
    {
      title: "What is your highest educational qualification?",
      tag: "education",
      FieldError: true,
      name: "education",
      options: ["None", "Primary", "Secondary", "Tertiary"],
      required: true
    },
    {
      title: "How fluent are you in Hausa?",
      tag: "hausa",
      FieldError: true,
      name: "hausa",
      options: ["Beginner", "Fluent", "Native", "I don't speak Hausa"],
      required: true
    },
    {
      title: "How fluent are you in English?",
      tag: "english",
      FieldError: true,
      name: "english",
      options: ["Fluent", "Not Fluent"],
      required: true
    },
  ];

  const proRadioFieldsData: RadioProps [] = [
    {
      title: "Do you have experience in coordinating community-based programs and data collection activities?",
      tag: "experience in coordinating community-based programs",
      FieldError: true,
      name: "community-based coordination",
      options: ["Yes", "No"],
      required: true
    },
    {
      title: "What data collection tool or technology are you most familiar with?",
      tag: "data collection tool or technology",
      FieldError: true,
      name: "data collection tool",
      options: ["ODK", "Kobo Kollect", "CommsCare", "Optics", "None"],
      required: true
    },
    {
      title: "How would you respond if team members failed to show up or data collection equipment malfunctioned during a project?",
      tag: "respond if team members failed to show up or data collection equipment malfunctioned",
      FieldError: true,
      name: "equipment malfunctioned",
      options: ["Abandon the affected part of the project and move forward with what is available.", "Wait and hope the issues resolve themselves over time.", "Assess the situation, troubleshoot where possible, and implement alternative solutions while keeping stakeholders informed.", "Escalate the issue immediately to senior management without attempting any solutions."],
      required: true
    },{
      title: "In a case where there is resistance or concerns from community members, care givers or head of household regarding data collection, how would you handle the situation?",
      tag: "resistance or concerns from community members",
      FieldError: true,
      name: "resistance from community members",
      options: ["Politely listen to their concerns, address them respectfully using the information provided during training, and try to build trust and understanding.", "Insist on their participation and explain that it is mandatory.", "Offer them an incentive (like money or goods) to participate.", "Immediately stop the data collection attempt and move to the next household."],
      required: true
    },
    {
      title: "You are planning to gain support from community leaders and members on a project, which of the following steps are crucial to building trust?",
      tag: "gain support from community leaders",
      FieldError: true,
      name: "support from community leaders",
      options: ["Minimize communication to avoid potential disagreements or questions.", "Present the project as a directive from a higher authority without seeking their input.", "Clearly explain the project's objectives, benefits, and addressing potential concerns openly and honestly.", "Promise individual benefits to key leaders in exchange for their support."],
      required: true
    },
    {
      title: "In a scenario where caregivers raise concerns or misconceptions about the vaccination, how would you best approach this?",
      tag: "caregivers raise concerns or misconceptions",
      FieldError: true,
      name: "caregivers raise concerns",
      options: ["Tell them that their concerns are wrong and that they should trust the health authorities without question.", "Politely listen to their specific concerns, provide accurate information based on your training and approved materials, and address their questions respectfully.", "Dismiss their concerns and insist that vaccination is necessary.", "Immediately stop discussing vaccination and focus only on the data collection."],
      required: true
    },
    {
      title: "What step is integral to ensuring that marginalized or hard-to-reach communities are included a data collection process?",
      tag: "step is integral to ensuring that marginalized or hard-to-reach communities",
      FieldError: true,
      name: "hard-to-reach communities",
      options: ["Focusing data collection efforts primarily in easily accessible urban areas to maximize efficiency.", "Assuming that if the general population is covered, marginalized communities will naturally be included in the data.", "Utilizing only standardized data collection methods that are universally applicable across all communities.", "Adapting data collection strategies, communication methods, and engaging with community-specific gatekeepers and influencers to build trust and access."],
      required: true
    },
  ];

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
    perRadioFields: perRadioFieldsData,
    proRadioFields: proRadioFieldsData,
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