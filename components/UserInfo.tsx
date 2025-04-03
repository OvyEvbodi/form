"use client"

import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import ClockLoader from "react-spinners/ClockLoader";

// import interface

interface DownloadButtonProps {
  fileKey: string;
  children: React.ReactNode;
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  fileKey, 
  children,
  className = '' 
}) => {
  return (
    <a
      href={`/api/file_download?fileKey=${encodeURIComponent(fileKey)}`}
      download
      target="_blank"
      rel="noopener noreferrer"
      className={`cursor-pointer ${className}`}
    >
      {children}
    </a>
  );
};

const UserInfo = () => {
  const [ phoneNumber, setPhoneNumber ] = useState("");
  const [ userData, setUserData ]= useState<any>(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ fileName, setFileName ] = useState("");
  const [ message, setMessage ] = useState("");

  const handlePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    // event.preventDefault()
    setPhoneNumber(event.target.value)
  };

  const HandleGetApplicant = async () => {
    setIsLoading(true)
    setUserData(null)
    const saveData = await fetch("/api/user_search", {
      method: "POST",
      body: JSON.stringify(phoneNumber)
    })

    const feedback = await saveData.json();
    if (saveData.status === 200){
      setUserData(feedback.data)
      setFileName(feedback.data?.regInfo?.file_name || "")
    } 

    if (saveData.status === 400) {
      //error mess here
    }

    console.log(userData)
    setIsLoading(false)
  };

  return (
    <div className=" text-gray-800 min-h-screen md:flex bg-gray-200">
      <div className="bg-cyan-800 text-cyan-950 lg:w-1/4 p-4 md:p-8 ">
        <div className="bg-cyan-50 p-2 rounded-sm">
          <input onChange={handlePhoneNumber} name="phoneNumber" type="text" placeholder="Enter a number" className="px-2 " />
          <button onClick={HandleGetApplicant}>go</button>
        </div>
      </div>
      {
        userData && userData.regInfo !== null ?
        (
        <div className=" lg:w-3/4 p-4 md:p-10 ">
        <h2 className="text-2xl font-extrabold text-cyan-900">user profile</h2>
        <div className="flex flex-wrap gap-4 md:gap-10">
          <div>
            <h3>Personal Details</h3>
            <div><span className="font-extrabold text-gray-700">First Name: </span>{userData.regInfo && userData.regInfo.firstname}</div> 
            <div><span>Middle Name: </span>{userData.regInfo && userData.regInfo.middlename}</div>
            <div><span>Last Name: </span>{userData.regInfo && userData.regInfo.lastname}</div>
            <div><span>Date of Birth: </span>{userData.regInfo && userData.regInfo.dob}</div>
            <div><span>Phone Number: </span>{userData.regInfo && userData.regInfo.phone_number}</div>
            <div><span>WhatsApp Number: </span>{userData.regInfo && userData.regInfo.whatsapp}</div>
            <div><span>Email: </span>{userData.regInfo && userData.regInfo.email}</div>
            <div><span>Address: </span>{userData.regInfo && userData.regInfo.full_address}</div>
            <div><span>ID Type: </span>{userData.regInfo && userData.regInfo.id_type}</div>
            <div><span>File Name: </span>{userData.regInfo && userData.regInfo.file_name}</div>
          </div>
          <div>
            <h3>Application Info</h3>
            <div>LGA: {userData.regInfo && userData.regInfo.lga}</div>
            <div>Ward: {userData.regInfo && userData.regInfo.ward}</div>
            <div>Redeploy: {userData.regInfo && userData.regInfo.willing_to_be_redeployed}</div>
            <div>First Choice: {userData.regInfo && userData.regInfo.first_choice_ward_for_redeployment}</div>
            <div>Second Choice: {userData.regInfo && userData.regInfo.second_choice_ward_for_redeployment}</div>
            <div>Initial Role: {userData.regInfo && userData.regInfo.initial_role}</div>
          </div>
          <div>
            <h3>Bank Details: {userData.regInfo && userData.regInfo.lga}</h3>
            <div>Bank Account Name: {userData.regInfo && userData.regInfo.lga}</div>
            <div>Bank Account Number: {userData.regInfo && userData.regInfo.lga}</div>
            <div>Name of Bank: {userData.regInfo && userData.regInfo.lga}</div>
          </div>
        </div>
        <div className="my-6">
          <DownloadButton fileKey={fileName} className="bg-cyan-800 max-w-max py-2 my-4 px-8 text-white font-semibold hover:bg-gray-700 shadow shadow-gray-900">
            Download ID
          </DownloadButton>
        </div>
      </div>
        ) : 
        (<div>No data available</div>)
      }
      { isLoading ? 
      <div className="fixed top-0 left-0 flex flex-col justify-center items-center w-screen h-screen bg-neutral-900/85">
        <div className="text-center text-lg text-white font-bold mb-6">Retrieving user data</div>
        <div className="p-12 sm:px-20 bg-gray-100 rounded-lg font-bold text-xl text-center max-w-md">
          <ClockLoader color="#169285" />
        </div>
      </div> :
      <div>
      </div>}
    </div>
  )
};

export default UserInfo
