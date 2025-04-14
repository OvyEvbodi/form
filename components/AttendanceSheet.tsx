"use client"

import InputField from "@/components/Input";
import { useRouter } from "next/navigation";
import { useActionState, useState, useMemo } from "react";
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
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());

  const handleSubmitAttendance: (prevState: any, formData: FormData) => Promise<any> = async (prevState: any, formData: FormData) => {
      // Add all selected staff to formData
      selectedStaff.forEach(staff => {
        formData.append("staff", staff);
      });
      
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
  
    // Memoize the grouped data for better performance
    const groupedByWard = useMemo(() => {
      return props.list.reduce((acc, person) => {
        if (!acc[person.ward]) acc[person.ward] = [];
        acc[person.ward].push(person);
        return acc;
      }, {} as Record<string, AttendanceSheetInterface[]>);
    }, [props.list]);

    // Memoize the filtered data
    const filteredWards = useMemo(() => {
      if (!searchTerm.trim()) {
        return Object.entries(groupedByWard).map(([ward, people]) => ({
          ward,
          people
        }));
      }

      const searchLower = searchTerm.toLowerCase();
      const result = Object.entries(groupedByWard)
        .map(([ward, people]) => ({
          ward,
          people: people.filter(person => 
            person.name.toLowerCase().includes(searchLower)
          )
        }))
        .filter(({ people }) => people.length > 0);

      return result;
    }, [groupedByWard, searchTerm]);

    // Track expanded wards state
    const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>({});

    const toggleWard = (ward: string) => {
      setExpandedWards(prev => ({
        ...prev,
        [ward]: !prev[ward]
      }));
    };

    const handleCheckboxChange = (staffValue: string) => {
      setSelectedStaff(prev => {
        const newSet = new Set(prev);
        if (newSet.has(staffValue)) {
          newSet.delete(staffValue);
        } else {
          newSet.add(staffValue);
        }
        return newSet;
      });
    };

  return (
    <div className="shadow-gray-800 shadow-lg sm:min-h-8/12 sm:min-w-2/3 text-gray-700 text-sm lg:max-w-[860px] p-4 sm:p-10 rounded-md max-w-screen bg-linear-to-b from-cyan-50/70 via-gray-200/80 to-gray-100/80">
      <div>
        <h1 className="py-2 sm:py-6 text-cyan-800 text-lg sm:text-3xl font-bold capitalize">Kano-IEV Data Clerks and Local Guides Attendance List for <span className="text-gray-700">{props.lga}</span></h1>
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
              {filteredWards.map(({ ward, people }) => (
                <React.Fragment key={ward}>
                  <tr 
                    className="bg-gray-300 cursor-pointer" 
                    onClick={() => toggleWard(ward)}
                  >
                    <td colSpan={4} id="ward-head" className="p-2 font-bold text-cyan-900">
                      {ward} ({people.length}) {expandedWards[ward] ? "▲" : "▼"}
                    </td>
                  </tr>
                  {people.map((person, idx) => {
                    const staffValue = `${person.account_number}+${person.name}`;
                    return (
                      <tr
                        key={`${ward}-${person.phone_number}`}
                        className={cn(
                          expandedWards[ward] ? "" : "hidden",
                          idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                        )}
                      >
                        <td data-label="" className="p-2">
                          <Checkbox
                            name="staff"
                            value={staffValue}
                            title={person.name}
                            checked={selectedStaff.has(staffValue)}
                            onCheckedChange={() => handleCheckboxChange(staffValue)}
                          />
                        </td>
                        <td data-label="Name" className="p-2 text-xs sm:text-base">
                          <label htmlFor="staff">{person.name}</label>
                        </td>
                        <td data-label="Designation" className="p-2 text-xs sm:text-base">
                          {person.designation}
                        </td>
                        <td data-label="Telephone" className="p-2 text-xs sm:text-base">
                          {person.phone_number}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
        <input type="hidden" name="lga" value={props.lga} />
        <div className="mt-2 text-sm text-gray-600">
          Selected: {selectedStaff.size} staff members
        </div>
        <button
          type="submit"
          disabled={isPending || selectedStaff.size === 0}
          className={cn(
            "inline-block mt-4 py-3 px-6 md:px-12 w-full text-white font-semibold capitalize bg-cyan-800 rounded-sm hover:bg-cyan-900 transition-all duration-300 ease-in-out",
            {
              "opacity-50 cursor-not-allowed": isPending || selectedStaff.size === 0,
              "cursor-pointer": !isPending && selectedStaff.size > 0
            }
          )}
        >
          {isPending ? "Submitting..." : `Submit (${selectedStaff.size} selected)`}
        </button>
      </form>
    </div>
  )
}

export default AttendanceSheet