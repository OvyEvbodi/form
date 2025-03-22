'use client'

import InputField, { InputProps, RadioField, RadioProps } from "@/components/Input";
import Button, { ButtonProps } from "@/components/Button";
import { useActionState, useState } from "react";
import { handleFormSubmit } from "@/utils/handleFormSubmit";
import { lgaList, lgaWardsMap } from "@/data";
import BeatLoader from "react-spinners/BeatLoader";
import ClockLoader from "react-spinners/ClockLoader";
import Link from "next/link";
import axios from "axios";


export interface IEVFormProps {
  logoUrl?: string;
  title: string;
  description?: string;
  textFields: InputProps[];
  perRadioFields: RadioProps[];
  proRadioFields: RadioProps[];
  buttonInfo: ButtonProps;
  footerText?: string;
  footerLink: string;
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
  const [geoLoading, setGeoLoading] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [locationUrl, setLocationUrl] = useState("");


  const handleLgaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setLga(event.target.value)
    setWard('')
  };

  const handleWardChange  = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setWard(event.target.value)
  };

  const getState = async (latitude:string, longitude:string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    const { data, status } = await axios.get(url);

    if (status === 200) {
      const geoState: string = data.results[0]?.formatted_address;

      if (geoState.includes("Kano") || geoState.includes("kano") ) return true
      
    }

    return false
    } catch (error) {
      console.log(error)
      return false
    }
  };
  
  const handleGeolocation = async(event: React.MouseEvent<HTMLDivElement>) => {
    setGeoLoading(true)
    event.preventDefault()

    try {
      const success = async (position: any) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setGeolocationData(JSON.stringify(position))
        
        const isValidGeolocation = await getState(position.coords.latitude, position.coords.longitude);
        
        if (isValidGeolocation) {
          setConsent(true)
          setGeoLoading(false)
          setLocationError(false)
        } else {
          setConsent(false)
          setLocationError(true)
          setGeoLoading(false)
        }

      }

      const GeoErrorCallback = () => {
        setConsent(false)
        setLocationError(true)
        setGeoLoading(false)
      };

      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser")
      } else {
        // console.log("Getting location")
        
        navigator.geolocation.getCurrentPosition(success, GeoErrorCallback);
        // const geoWatchID = navigator.geolocation.watchPosition(success, GeoErrorCallback, options);

      }
    
    } catch (error) {
      setLocationError(true)
      console.error(error)
      setGeoLoading(false)
    }
    
  };

  const wards = lga ? lgaWardsMap[lga] : [];

  return (
    <div className="text-sm md:text-medium lg:max-w-[860px] opacity-[0.956] p-4 lg:p-12 rounded-lg max-w-screen bg-linear-to-b from-cyan-50 via-gray-200 to-gray-100">
      <div className={page === 2 ? "hidden sm_img_holder " : "sm_img_holder "}>
        <div className="bg-cyan-800 opacity-90 rounded-md text-white p-4 md:p-0 sm:bg-transparent sm:opacity-100 sm:text-black">
          <h1 className="pt-4 my-4 text-3xl font-extrabold text-gray-800">Kano State IEV Implementation Strategy - <span className="text-blue-500">Data Clerk</span> Application Form</h1>
            <p className="mb-4 font-medium text-sm lg:text-medium">
              Thank you for your interest in the <span className="text-blue-500 font-bold">Data Clerk</span> role for the Kano State Identify Enumerate and Vaccinate (IEV) strategy implementation. This project is coordinated by the Clinton Health Access Initiative (CHAI) in collaboration with the National Primary Health Care Development Agency (NPHCDA) and the Kano State Primary Health Care Management Board (SPHCMB).
              <br /><br />
              This application form is designed to collect essential information about your background, experience, and qualifications to ensure a fair and thorough selection process.
              <br /><br />
              <span className="text-black md:text-red-700">
                Please note that this application is open only to residents of Kano State. If you do not reside in Kano State, please do not apply. 
              </span>
              <br /><br />
              Take the time to complete all required fields accurately, as incomplete applications may not be considered. We appreciate your time and effort and look forward to reviewing your application.
              <br /><br />
              Best of luck!<br/>
              <span className="text-red-700">&#10038;</span> Required
            </p>
        </div>
      </div>
      <form name="iev" className="" action={action}>
        <div className={consent ? "hidden" : ""}>
          <p className="my-4 font-bold">
            Note: Only females can apply for this role. Also, to proceed with your application, you must allow access to your GPS location. This is required to verify your eligibility for the IEV work in Kano State. Click the button below to enable location access.
          </p>
          <input type="text" name="latitude" value={latitude} onChange={() => console.log(latitude)} className="hidden"/>
          <input type="text" name="longitude" value={longitude} onChange={() => console.log(longitude)} className="hidden"/>
          <input type="text" name="geolocationData" value={geolocationData} onChange={() => console.log(geolocationData)} className="hidden"/>
          <input type="text" name="jobRole" value="clerk" className="hidden" onChange={() => console.log(".")}/>
          {!geoLoading ? <div onClick={handleGeolocation} className="mb-4 lg:min-w-[227px] min-h-[46px] cursor-pointer py-[11px] px-[27px] text-white font-semibold capitalize bg-cyan-700 rounded-lg hover:bg-cyan-800 transition-all">Grant Location Access</div> :
          <div className="mb-4 lg:min-w-[227px] min-h-[46px] cursor-pointer py-[11px] px-[27px] text-white font-semibold capitalize bg-cyan-700 rounded-lg hover:bg-cyan-800 transition-all">
            <BeatLoader color="#ccc" />
          </div>
          }
          {
            locationError ? 
            <div>
              We couldn't determine your location. <br/> This could happen if:
              <ul>
                <li>Your network connection is poor</li>
                <li>You are not in Kano state</li>
                <li>Your location is turned off</li>
                <li>Your browser doesn't support this feature</li>
                <li>You need another device to access the form</li>
              </ul>
            </div> : 
            <div></div>
          }      
        </div>
  
        <div id="personal info" className={consent ? "" : "hidden"}>
        <div className="text-cyan-900 font-bold text-lg my-4">Personal Information</div>
          {
            props.textFields.map((item: InputProps, index) => (
              <InputField key={index} props={item} />
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
            props.perRadioFields.map((item: RadioProps, index) => (
              <RadioField key={index} props={item} />
            ))
          }
          {props.cautionText && <p className="text-xs mb-6">{props.cautionText}</p>}
        </div>
        <div id="professional info" className={consent ? "" : "hidden"}>
        <div className="text-cyan-900 font-bold text-lg my-4">Professional Assessment</div>
          {
            props.proRadioFields.map((item: RadioProps, index) => (
              <RadioField key={index} props={item} />
            ))
          }
          <div className="flex gap-4">
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

const DataClerksIEVForm = () => {

  const inputFieldsData: InputProps[] = [
    {
      tag: "Name",
      placeholder: "",
      FieldError: false,
      name: "name",
      id: "name",
      iconUrl: "/name_icon.png",
      type: "text",
      required: true,
      additionalStyle: "capitalize"
    },
    {
      tag: "Date of Birth (must be at least 18)",
      placeholder: "",
      FieldError: false,
      name: "dob",
      id: "dob",
      iconUrl: "",
      type: "date",
      required: true,
      max: "2007-03-01"
    },
    {
      tag: "Phone Number (must start with '0' and be 11 digits)",
      placeholder: "e.g 08045678910",
      FieldError: true,
      name: "phone number",
      id: "phone number",
      iconUrl: "/number_icon.png",
      type: "tel",
      required: true,
      pattern:"^0[0-9]{10}",
    },
    {
      tag: "Email Address",
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
      title: "Gender (females only)",
      tag: "gender",
      FieldError: true,
      name: "gender",
      options: ["Female"],
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
    {
      title: "For this role, you will need to install a data collection app that only works on Android phone. If selected, do you have an Android phone you can use?",
      tag: "device",
      FieldError: true,
      name: "device",
      options: ["Yes", "No"],
      required: true
    },
    {
      title: "Due to policy restrictions, we are unable to process payments through the following banks: Kuda Microfinance Bank, Opay, Momo, Palmpay Limited, MoniePoint Microfinance Bank and other wallet accounts. If you are selected, do you have another functional CONVENTIONAL BANK account IN YOUR NAME?",
      tag: "valid_bank",
      FieldError: true,
      name: "valid_bank",
      options: ["Yes", "No"],
      required: true
    }
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
      title: "If you chose yes above, how many years of experience do you have?",
      tag: "years of experience coordinating",
      FieldError: true,
      name: "community years coordinating",
      options: ["Less than a year", "1-3 Years", "3 Years and above", "Not Applicable"],
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
      title: "Where should you record the data/information you collect during a data collection exercise?",
      tag: "data entry ethics",
      FieldError: true,
      name: "data entry ethics",
      options: ["On the official data collection form or electronic device provided.", "On any piece of paper you have.", "In your personal notebook.", "You don't need to write anything down."],
      required: true
    },
    {
      title: "If you notice an inconsistency in the data, what is your first course of action?",
      tag: "data inconsistencies",
      FieldError: true,
      name: "how to resolve data inconsistencies",
      options: ["Ignore it and continue entering data.", "Correct the error based on previous data entries.", "Report the discrepancy to a supervisor or relevant team.", "Delete the data and start over." ],
      required: true
    },
    {
      title: "How would you handle incomplete data fields when entering records?",
      tag: "incomplete data",
      FieldError: true,
      name: "handling incomplete data entries",
      options: ["Leave them blank.", "Fill in estimated values.", "Do nothing.", "Delete the record."],
      required: true
    },
    {
      title: "Should you share the personal information you collect from a data collection exercise with people outside the enumeration team?",
      tag: "sharing data",
      FieldError: true,
      name: "unauthorized sharing of data",
      options: ["Yes, with friends and family.", "Yes, with community leaders.", "No, the information is confidential.", "Only if they ask for it."],
      required: true
    },
    {
      title: "What is your understanding of the importance of accurate data entry?",
      tag: "understanding importance of accurate data entry",
      FieldError: true,
      name: "importance of accurate data entry",
      options: ["It doesn't really matter if the numbers are there.", "It is crucial for generating reliable reports and making informed decisions.", "It saves time if you enter quickly, even with mistakes.", "Someone else will correct any errors."],
      required: true
    }
  ];

  const buttonInfoData: ButtonProps = {
    text: "Submit",
    type: "button",
    filled: true,
    additionalStyle: "w-full"
  };

  const ievFormData: IEVFormProps = {
      title: "",
      description: "",
      logoUrl: "/logo.png",
      textFields: inputFieldsData,
      perRadioFields: perRadioFieldsData,
      proRadioFields: proRadioFieldsData,
      buttonInfo: buttonInfoData,
      footerText: "Are you experiencing any technical issues? ",
      footerLinkText: "Contact support here",
      footerLink: "/support",
      accentColour: "cyan-800"
    };


  return (
    <div className="md:bg-light_grey min-h-screen flex justify-center items-center">
      <FormTemplate {...ievFormData}/>
    </div>
  )
};

export default DataClerksIEVForm;
