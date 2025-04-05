"use client"

import { useState } from "react";
import ClockLoader from "react-spinners/ClockLoader";
import AppliedUsers from "@/components/AppliedUsersData";
import ShortlistedUsersData from "./ShortlistedUsersData";

// import interface

const UserInfo = () => {
  const [ phoneNumber, setPhoneNumber ] = useState("");
  const [ userData, setUserData ]= useState<any>(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ message, setMessage ] = useState("");
  const [ view, setView ] = useState("shortlisted");

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
    } 

    if (saveData.status === 400) {
      setMessage("Invalid applicant! Please check the number and try again")
    }

    console.log(userData)
    setIsLoading(false)
  };

  return (
    <div className=" text-gray-800 min-h-[90vh] md:flex bg-linear-to-b from-gray-300 via-gray-100 to-cyan-200">
      <div className="bg-cyan-800 text-cyan-950 lg:w-1/4 p-4 md:p-8 flex flex-col gap-3 md:gap-12">
        <div className="bg-cyan-50 p-2 rounded-sm flex flex-wrap gap-2">
          <input onChange={handlePhoneNumber} name="phoneNumber" type="text" placeholder="Enter a number" className="px-2 outline-none max-w-full" />
          <button onClick={HandleGetApplicant} className="bg-cyan-900 text-white font-extrabold px-3 rounded-sm cursor-pointer hover:bg-cyan-700" >GO!</button>
        </div>
        <div className="flex md:flex-col flex-wrap gap-2 md:gap-6 ">
          <button onClick={() => setView("shortlisted")} className={`text-cyan-900 p-2 cursor-pointer bg-cyan-50 text-xs md:text-base rounded-sm hover:bg-gray-200 uppercase font-bold transition-all ease-in-out ${view === "shortlisted" && "bg-gray-400 border border-cyan-300 hover:bg-gray-400 hover:cursor-not-allowed"}` }>registration <span>&gt;</span></button>
          <button onClick={() => setView("applied")} className={`text-cyan-900 p-2 cursor-pointer bg-cyan-50 text-xs md:text-base rounded-sm hover:bg-gray-200 uppercase font-bold transition-all ease-in-out ${view === "applied" && "bg-gray-400 border border-cyan-300 hover:bg-gray-400 hover:cursor-not-allowed"}` }>application <span>&gt;</span></button>
        </div>
      </div>
      {
        view === "shortlisted" && userData && userData.regInfo !== null ?
        (
          <ShortlistedUsersData userData={userData} /> 
        ) : view === "shortlisted" &&
        (<div className="p-4 md:p-8 font-bold text-gray-800 md:text-2xl">No registration data available for this number.</div>)
      }
      {
        view === "applied" && userData && userData.initialEntry !== null ? 
        (
          <AppliedUsers userData={userData}/>
        ) : view === "applied" &&
        (
          <div className="p-4 md:p-8 font-bold text-gray-800 md:text-2xl">No application data available for this number.</div>
        )
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
