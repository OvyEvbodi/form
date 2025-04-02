"use client"

import { useState } from "react";
import getApplicant from "@/utils/displayUser";


const UserInfo = () => {
  const [ phoneNumber, setPhoneNumber ] = useState("");
  const [ userData, setUserData ]= useState({});

  const handlePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setPhoneNumber(event.target.value)
  };


  const HandleGetApplicant = () => {
    const data = getApplicant(phoneNumber)
    console.log(data)
  };

  return (
    <div className=" text-gray-800 min-h-screen md:flex">
      <div className="bg-cyan-800 text-cyan-950 md:w-1/4 p-4 md:p-8 ">
        <div className="bg-cyan-50 p-2 rounded-sm">
          <input onChange={handlePhoneNumber} name="phoneNumber" type="text" placeholder="Enter a number" className="px-2 " />
          <button onClick={HandleGetApplicant}>go</button>
        </div>
      </div>
      <div className=" md:w-3/4 p-4 md:p-10 ">
        <h2 className="text-2xl font-extrabold text-cyan-900">user profile</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <h3>Personal details</h3>
            <div>first Name</div>
            <div>middlename</div>
            <div>last Name</div>
            <div>dob</div>
            <div>phone</div>
            <div>whatsapp</div>
            <div>email</div>
            <div>full_address</div>
            <div>id_type</div>
            <div>file_name:</div>
          </div>
          <div>
            <h3>Application info</h3>
            <div>lga</div>
            <div>ward</div>
            <div>willing_to_be_redeployed</div>
            <div>first_choice</div>
            <div>second_choice</div>
            <div>initial_role</div>
            <div>created_at</div>
          </div>
          <div>
            <h3>Bank details</h3>
            <div>bank_acct_name</div>
            <div>bank_acct_no</div>
            <div>name_of_bank</div>
          </div>
        </div>
        <div>
          <div className="bg-cyan-800 max-w-max py-2 my-4 px-8 text-white font-semibold hover:bg-gray-700 shadow shadow-gray-900">Download ID</div>

        </div>
      </div>
    </div>
  )
};

export default UserInfo
