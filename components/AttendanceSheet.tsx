"use client"

import InputField from "@/components/Input";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import React from "react";
import { cn } from "@/lib/utils";

export interface AttendanceSheetInterface {
  phone_number: string;
  account_number: string;
  name: string;
  ward: string;
  designation: string;
}
export interface attendanceDataInterface {
  lga: string;
  list: AttendanceSheetInterface []
}
const dateString = new Date().toISOString().split("T")[0];

const dateInput = {
  tag: "Pick a date to mark",
  placeholder: "dd/mm/yyyy",
  FieldError: false,
  name: "attendance_date",
  id: "attendance_date",
  iconUrl: "",
  type: "date",
  required: true,
  min: "2025-04-07",
  max: dateString,
  errorMessage: "Please enter a valid date (dd/mm/yyyy)"
};

const AttendanceSheet = (props: attendanceDataInterface) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const initialState: any = {};

  const handleSubmitAttendance: (prevState: any, formData: FormData) => Promise<any> = async (prevState: any, formData: FormData) => {
      const result = await fetch("/api/attendance_admin", {
        method: "POST",
        body: formData
      });
  
      const feedback = await result.json();
  
      if (result.status === 200) router.push("/thank-you")
     
      return {
        error: feedback.error || null,
        success: feedback.success || null,
        data: feedback.data || null,
      } as any
    };
    const [ state, action, isPending ] = useActionState(handleSubmitAttendance, initialState);
  
    const groupedByWard = props.list.reduce((acc, person) => {
      if (!acc[person.ward]) acc[person.ward] = [];
      acc[person.ward].push(person);
      return acc;
    }, {} as Record<string, AttendanceSheetInterface[]>);

    // Improved filter function for search
    const filteredWards = Object.entries(groupedByWard)
      .map(([ward, people]) => ({
        ward,
        people: people.filter(person => 
          person.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }))
      .filter(({ people }) => people.length > 0);

  return (
    <div className="shadow-gray-800 shadow-lg sm:min-h-8/12 sm:min-w-2/3 text-gray-700 text-sm lg:max-w-[860px] p-4 sm:p-10 rounded-md max-w-screen bg-linear-to-b from-cyan-50/70 via-gray-200/80 to-gray-100/80">
      <div>
        <h1 className="py-2 sm:py-6 text-cyan-800 text-lg sm:text-3xl font-bold capitalize">Kano-IEV supervisors attendance list for <span className="text-gray-700">{props.lga}</span></h1>
      </div>
      <form action={action}>
        <InputField props={dateInput} />
        
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-800"
          />
        </div>
        
        {filteredWards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? (
              <p>No matching results found for "{searchTerm}"</p>
            ) : (
              <p>No attendance data available</p>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th>status</th>
                <th>name</th>
                <th>designation</th>
                <th>phone number</th>
              </tr>
            </thead>
            <tbody>
              {filteredWards.map(({ ward, people }) => {
                const [isOpen, setIsOpen] = useState(false);
                const toggleWard = () => setIsOpen(!isOpen);
                return (
                  <React.Fragment key={ward}>
                    <tr className="bg-gray-300 cursor-pointer" onClick={toggleWard}>
                      <td colSpan={4} id="ward-head" className="p-2 font-bold text-cyan-900">
                        {ward} ({people.length}) {isOpen ? "▲" : "▼"}
                      </td>
                    </tr>
                    {people.map((person, idx) => (
                      <tr
                        key={person.phone_number}
                        className={cn(
                          isOpen ? "" : "hidden",
                          idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                        )}
                      >
                        <td data-label="" className="p-2">
                          <Checkbox
                            name="staff"
                            value={`${person.account_number}+${person.name}`}
                            title={person.name}
                          />
                        </td>
                        <td data-label="Name" className="p-2 text-xs sm:text-base">
                          <label className="" htmlFor="staff">{person.name}</label>
                        </td>
                        <td data-label="Designation" className="p-2 text-xs sm:text-base">{person.designation}</td>
                        <td data-label="Telephone" className="p-2 text-xs sm:text-base">{person.phone_number}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
        <input type="hidden" name="lga" value={props.lga} />
        <button
          type="submit"
          disabled={isPending || filteredWards.length === 0}
          className={`inline-block cursor-pointer mt-4 py-3 px-6 md:px-12 w-full text-white font-semibold capitalize bg-cyan-800 rounded-sm hover:bg-cyan-900 transition-all duration-300 ease-in-out ${
            (isPending || filteredWards.length === 0) ? "opacity-50 hover:bg-cyan-800 hover:cursor-not-allowed" : ""
          }`}
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  )
}

export default AttendanceSheet