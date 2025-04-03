"use client"

import { useState } from "react";

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

const ShortlistedUsersData = ({userData}: any) => {

  return (
    <div className=" lg:w-3/4 p-4 md:p-10 ">
      <h2 className="text-2xl font-extrabold text-cyan-900">Registered user profile</h2>
      <div className="flex flex-wrap gap-4 md:gap-10">
        <div>
          <h3>Personal Details</h3>
          <div><span className="font-extrabold text-gray-700">First Name: </span>{userData.regInfo && userData.regInfo.firstname}</div> 
          <div><span className="font-extrabold text-gray-700">Middle Name: </span>{userData.regInfo && userData.regInfo.middlename}</div>
          <div><span className="font-extrabold text-gray-700">Last Name: </span>{userData.regInfo && userData.regInfo.lastname}</div>
          <div><span className="font-extrabold text-gray-700">Date of Birth: </span>{userData.regInfo && userData.regInfo.dob}</div>
          <div><span className="font-extrabold text-gray-700">Gender: </span>{userData.regInfo && userData.regInfo.gender}</div>
          <div><span className="font-extrabold text-gray-700">Phone Number: </span>{userData.regInfo && userData.regInfo.phone_number}</div>
          <div><span className="font-extrabold text-gray-700">WhatsApp Number: </span>{userData.regInfo && userData.regInfo.whatsapp}</div>
          <div><span className="font-extrabold text-gray-700">Email: </span>{userData.regInfo && userData.regInfo.email}</div>
          <div><span className="font-extrabold text-gray-700">Address: </span>{userData.regInfo && userData.regInfo.full_address}</div>
          <div><span className="font-extrabold text-gray-700">ID Type: </span>{userData.regInfo && userData.regInfo.id_type}</div>
          <div><span className="font-extrabold text-gray-700">File Name: </span>{userData.regInfo && userData.regInfo.file_name}</div>
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
          <h3>Bank Details</h3>
          <div>Bank Account Name: {userData.regInfo && userData.regInfo.bank_acct_name}</div>
          <div>Bank Account Number: {userData.regInfo && userData.regInfo.bank_acct_no}</div>
          <div>Name of Bank: {userData.regInfo && userData.regInfo.name_of_bank}</div>
        </div>
      </div>
      <div className="my-6">
        <DownloadButton fileKey={userData.regInfo.file_name || ""} className="bg-cyan-800 max-w-max py-2 my-4 px-8 text-white font-semibold hover:bg-gray-700 shadow shadow-gray-900">
          Download ID
        </DownloadButton>
      </div>
      </div>
  )
};

export default ShortlistedUsersData
