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
    <div className=" lg:w-3/4 p-4 md:p-10 text-sm sm:text-base">
      <h2 className="text-lg sm:text-3xl font-extrabold text-cyan-900">Registered User Profile</h2>
      <div className="flex flex-wrap gap-4 md:gap-10 justify-between w-full items-start">
        <div className="space-y-2 mt-2 sm:mt-6">
          <h3 className="sm:text-2xl font-bold mb-3 text-cyan-900 bg-gray-400 p-2 text-center">Personal Details</h3>
          <div className="grid sm:grid-cols-[minmax(100px,auto)_1fr] gap-2 max-w-84">
            <span className="font-semibold text-gray-700">First Name:</span>
            <span>{userData?.regInfo?.firstname || '-'}</span>

            <span className="font-semibold text-gray-700">Middle Name:</span>
            <span>{userData?.regInfo?.middlename || '-'}</span>

            <span className="font-semibold text-gray-700">Last Name:</span>
            <span>{userData?.regInfo?.lastname || '-'}</span>

            <span className="font-semibold text-gray-700">Date of Birth:</span>
            <span>{userData?.regInfo?.dob || '-'}</span>

            <span className="font-semibold text-gray-700">Gender:</span>
            <span>{userData?.regInfo?.gender || '-'}</span>

            <span className="font-semibold text-gray-700">Phone Number:</span>
            <span>{userData?.regInfo?.phone_number || '-'}</span>

            <span className="font-semibold text-gray-700">WhatsApp Number:</span>
            <span>{userData?.regInfo?.whatsapp || '-'}</span>

            <span className="font-semibold text-gray-700">Email:</span>
            <span>{userData?.regInfo?.email || '-'}</span>

            <span className="font-semibold text-gray-700">Address:</span>
            <span>{userData?.regInfo?.full_address || '-'}</span>

            <span className="font-semibold text-gray-700">ID Type:</span>
            <span>{userData?.regInfo?.id_type || '-'}</span>

            <span className="font-semibold text-gray-700">File Name:</span>
            <span>{userData?.regInfo?.file_name || '-'}</span>
          </div>
        </div>
        <div className="space-y-2 mt-2 sm:mt-6">
          <h3 className="sm:text-2xl font-bold mb-3 text-cyan-900 bg-gray-400 p-2 text-center">Application Info</h3>
          <div className="grid grid-cols-[minmax(100px,auto)_1fr] md:grid-cols-[minmax(160px,auto)_1fr] gap-x-4 gap-y-2 max-w-84">
            <div className="font-semibold text-gray-700">LGA:</div>
            <div>{userData?.regInfo?.lga || '-'}</div>
          
            <div className="font-semibold text-gray-700">Ward:</div>
            <div>{userData?.regInfo?.ward || '-'}</div>
          
            <div className="font-semibold text-gray-700">Redeploy:</div>
            <div>{userData?.regInfo?.willing_to_be_redeployed || '-'}</div>
          
            <div className="font-semibold text-gray-700">First Choice:</div>
            <div>{userData?.regInfo?.first_choice_ward_for_redeployment || '-'}</div>
          
            <div className="font-semibold text-gray-700">Second Choice:</div>
            <div>{userData?.regInfo?.second_choice_ward_for_redeployment || '-'}</div>
          
            <div className="font-semibold text-gray-700">Initial Role:</div>
            <div>{userData?.regInfo?.initial_role || '-'}</div>
          </div>
        </div>
        <div className="space-y-2  mt-2 sm:mt-6">
          <h3 className="sm:text-2xl font-bold mb-3 text-cyan-900 bg-gray-400 p-2 text-center">Bank Details</h3>
          <div className="grid  grid-cols-[minmax(100px,auto)_1fr] md:grid-cols-[minmax(160px,auto)_1fr] gap-x-4 gap-y-2 max-w-84">
            <div className="font-semibold text-gray-700">Bank Account Name:</div>
            <div>{userData?.regInfo?.bank_acct_name || '-'}</div>

            <div className="font-semibold text-gray-700">Bank Account Number:</div>
            <div>{userData?.regInfo?.bank_acct_no || '-'}</div>

            <div className="font-semibold text-gray-700">Name of Bank:</div>
            <div>{userData?.regInfo?.name_of_bank || '-'}</div>
          </div>
        </div>
      </div>
      <div className="my-10">
        <DownloadButton fileKey={userData.regInfo.file_name || ""} className="bg-cyan-800 max-w-max py-3 my-4 px-8 text-white font-semibold hover:bg-gray-700 shadow shadow-gray-900">
          Download ID
        </DownloadButton>
      </div>
    </div>
  )
};

export default ShortlistedUsersData
