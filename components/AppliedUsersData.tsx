
const AppliedUsers = ({userData}: any) => {
console.log(userData)
  return (
    <div className=" lg:w-3/4 p-4 md:p-10 ">
       <h2 className="text-2xl font-extrabold text-cyan-900">user profile (Initial Entry)</h2>
       <div className="flex flex-wrap gap-4 md:gap-10">
         <div>
            <h3>Personal Details</h3>
            <div><span className="font-extrabold text-gray-700">Name: </span>{userData.initialEntry && userData.initialEntry.name}</div> 
            <div><span>Date of Birth: </span>{userData.initialEntry && userData.initialEntry.dob}</div>
            <div><span>Gender: </span>{userData.regInfo && userData.initialEntry.gender}</div>
            <div><span>Phone Number: </span>{userData.initialEntry && userData.initialEntry.phone_number}</div>
            <div><span>WhatsApp Number: </span>{userData.initialEntry && userData.initialEntry.whatsapp}</div>
            <div><span>Email: </span>{userData.initialEntry && userData.initialEntry.email}</div>
            <div><span>Address: </span>{userData.initialEntry && userData.initialEntry.full_address}</div>
            <div><span>Latitude: </span>{userData.initialEntry && userData.initialEntry.latitude}</div>
            <div><span>Longitude: </span>{userData.initialEntry && userData.initialEntry.longitude}</div>
         </div>
         <div>
            <h3>Application Info</h3>
            <div>LGA: {userData.initialEntry && userData.initialEntry.lga}</div>
            <div>Ward: {userData.initialEntry && userData.initialEntry.ward}</div>
            <div>School Qualification: {userData.initialEntry && userData.initialEntry.school_qualification}</div>
            <div>Hausa Fluency: {userData.initialEntry && userData.initialEntry.hausa_fluency}</div>
            <div>English Fluency: {userData.initialEntry && userData.initialEntry.english_fluency}</div>
            <div>Status: {userData.initialEntry && userData.initialEntry.status}</div>
            <div>Device: {userData.initialEntry && userData.initialEntry.device}</div>
            <div>Valid Bank: {userData.initialEntry && userData.initialEntry.valid_bank}</div>
            <div>Years of Experience: {userData.initialEntry && userData.initialEntry.years_experience}</div>
         </div>
       </div>
    </div>
  )
};

export default AppliedUsers