
const AppliedUsers = ({userData}: any) => {
  return (
    <div className=" lg:w-3/4 p-4 md:p-10 text-sm sm:text-base">
      <h2 className="text-lg  md:text-3xl font-extrabold text-cyan-900">User Application (Initial Entry)</h2>
      <div className="flex flex-wrap gap-4 md:gap-10 justify-between w-full items-start">
        <div className="space-y-2 mt-2 sm:mt-6">
          <h3 className="sm:text-2xl font-bold mb-3 text-cyan-900 bg-gray-400 p-2 text-center">Personal Details</h3>
          <div className="grid sm:grid-cols-[minmax(100px,auto)_1fr] gap-x-4 gap-y-2 max-w-84">
            <div className="font-semibold text-gray-700">Name:</div>
            <div>{userData?.initialEntry?.name || '-'}</div>

            <div className="font-semibold text-gray-700">Date of Birth:</div>
            <div>{userData?.initialEntry?.dob || '-'}</div>

            <div className="font-semibold text-gray-700">Gender:</div>
            <div>{userData?.regInfo?.gender || userData?.initialEntry?.gender || '-'}</div>

            <div className="font-semibold text-gray-700">Phone Number:</div>
            <div>{userData?.initialEntry?.phone_number || '-'}</div>

            <div className="font-semibold text-gray-700">Email:</div>
            <div>{userData?.initialEntry?.email || '-'}</div>

            <div className="font-semibold text-gray-700">Latitude:</div>
            <div>{userData?.initialEntry?.latitude || '-'}</div>

            <div className="font-semibold text-gray-700">Longitude:</div>
            <div>{userData?.initialEntry?.longitude || '-'}</div>
          </div>
        </div>
        <div className="space-y-2  mt-2 sm:mt-6">
          <h3 className="sm:text-2xl font-bold mb-3 text-cyan-900 bg-gray-400 p-2 text-center">Application Info</h3>
          <div className="grid grid-cols-[minmax(100px,auto)_1fr] md:grid-cols-[minmax(160px,auto)_1fr] gap-x-4 gap-y-2 max-w-84">
            <div className="font-semibold text-gray-700">LGA:</div>
            <div>{userData?.initialEntry?.lga || '-'}</div>

            <div className="font-semibold text-gray-700">Ward:</div>
            <div>{userData?.initialEntry?.ward || '-'}</div>

            <div className="font-semibold text-gray-700">School Qualification:</div>
            <div>{userData?.initialEntry?.school_qualification || '-'}</div>

            <div className="font-semibold text-gray-700">Hausa Fluency:</div>
            <div>{userData?.initialEntry?.hausa_fluency || '-'}</div>

            <div className="font-semibold text-gray-700">English Fluency:</div>
            <div>{userData?.initialEntry?.english_fluency || '-'}</div>

            <div className="font-semibold text-gray-700">Status:</div>
            <div>{userData?.initialEntry?.status || '-'}</div>

            <div className="font-semibold text-gray-700">Device:</div>
            <div>{userData?.initialEntry?.device || '-'}</div>

            <div className="font-semibold text-gray-700">Valid Bank:</div>
            <div>{userData?.initialEntry?.valid_bank || '-'}</div>

            <div className="font-semibold text-gray-700">Years of Experience:</div>
            <div>{userData?.initialEntry?.years_experience || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default AppliedUsers