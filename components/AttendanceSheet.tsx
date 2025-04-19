"use client"

import InputField from "@/components/Input";
import { useRouter } from "next/navigation";
import { useActionState, useState, useMemo, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronDown, ChevronUp, ArrowUp, Users, ChevronsUpDown, ChevronsDown, ChevronsUp } from "lucide-react";

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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);
  const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>({});

  // Track scroll position for "Go to top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Expand/collapse functions
  const expandAll = () => {
    const expanded: Record<string, boolean> = {};
    filteredWards.forEach(({ ward }) => {
      expanded[ward] = true;
    });
    setExpandedWards(expanded);
    setAllExpanded(true);
  };

  const collapseAll = () => {
    setExpandedWards({});
    setAllExpanded(false);
  };

  const toggleAll = () => {
    if (allExpanded) {
      collapseAll();
    } else {
      expandAll();
    }
  };

  const handleSubmitAttendance: (prevState: any, formData: FormData) => Promise<any> = async (prevState: any, formData: FormData) => {
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

  // Calculate selected count per ward
  const getSelectedCountForWard = (ward: string) => {
    const wardPeople = groupedByWard[ward] || [];
    return wardPeople.reduce((count, person) => {
      const staffValue = `${person.account_number}+${person.name}`;
      return selectedStaff.has(staffValue) ? count + 1 : count;
    }, 0);
  };

  return (
    <div className="shadow-gray-800 shadow-lg sm:min-h-8/12 sm:min-w-2/3 text-gray-700 text-sm lg:max-w-[860px] p-4 sm:p-10 rounded-md max-w-screen bg-linear-to-b from-cyan-50/70 via-gray-200/80 to-gray-100/80">
      <div>
        <h1 className="py-2 sm:py-6 text-cyan-800 text-lg sm:text-3xl font-bold capitalize">Kano-IEV Data Clerks and Local Guides Attendance List for <span className="text-gray-700">{props.lga}</span></h1>
      </div>
      
      {/* Total staff count */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-cyan-100 rounded-md">
        <Users className="text-cyan-800" size={20} />
        <span className="font-medium text-cyan-800">Total Staff: {props.list.length}</span>
      </div>
      
      <Link href="/new_record" >
        <button
          type="button"
          disabled={isPending}
          className={`"inline-block cursor-pointer my-4 py-3 px-6 md:px-12 w-full text-white font-semibold capitalize bg-cyan-800 rounded-sm hover:bg-cyan-900 transition-all duration-300 ease-in-out ${isPending && "hover:bg-gray-700 hover:text-gray-300 hover:cursor-not-allowed"}`}
        >
          Add a new record
        </button>
      </Link>
      <form action={action}>
        <InputField props={dateInput} />
        
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search staff by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border-2 border-cyan-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-800 text-gray-700 placeholder-gray-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={expandAll}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-cyan-100 text-cyan-800 rounded hover:bg-cyan-200 transition-colors"
          >
            <ChevronsDown size={16} />
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-cyan-100 text-cyan-800 rounded hover:bg-cyan-200 transition-colors"
          >
            <ChevronsUp size={16} />
            Collapse All
          </button>
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-cyan-100 text-cyan-800 rounded hover:bg-cyan-200 transition-colors"
          >
            <ChevronsUpDown size={16} />
            Toggle All
          </button>
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
              <tr className="bg-cyan-800 text-white">
                <th className="p-2">Status</th>
                <th className="p-2">Name</th>
                <th className="p-2">Designation</th>
                <th className="p-2">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredWards.map(({ ward, people }) => (
                <React.Fragment key={ward}>
                  <tr 
                    className="cursor-pointer hover:bg-cyan-100/50 transition-colors" 
                    onClick={() => toggleWard(ward)}
                  >
                    <td colSpan={4} className="p-3 font-bold text-cyan-800 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span>{ward}</span>
                        <span className="text-sm font-normal text-gray-600">({people.length} staff)</span>
                        {getSelectedCountForWard(ward) > 0 && (
                          <span className="flex items-center gap-1 text-sm bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">
                            <Users size={14} />
                            {getSelectedCountForWard(ward)} selected
                          </span>
                        )}
                      </div>
                      {expandedWards[ward] ? (
                        <ChevronUp className="text-cyan-800" />
                      ) : (
                        <ChevronDown className="text-cyan-800" />
                      )}
                    </td>
                  </tr>
                  {people.map((person, idx) => {
                    const staffValue = `${person.account_number}+${person.name}`;
                    return (
                      <tr
                        key={`${ward}-${person.phone_number}`}
                        className={cn(
                          expandedWards[ward] ? "" : "hidden",
                          idx % 2 === 0 ? "bg-white" : "bg-gray-100",
                          "hover:bg-cyan-50"
                        )}
                      >
                        <td data-label="" className="p-3">
                          <Checkbox
                            name="staff"
                            value={staffValue}
                            title={person.name}
                            checked={selectedStaff.has(staffValue)}
                            onCheckedChange={() => handleCheckboxChange(staffValue)}
                          />
                        </td>
                        <td data-label="Name" className="p-3 text-xs sm:text-base">
                          <label htmlFor="staff" className="cursor-pointer">{person.name}</label>
                        </td>
                        <td data-label="Designation" className="p-3 text-xs sm:text-base">
                          {person.designation}
                        </td>
                        <td data-label="Telephone" className="p-3 text-xs sm:text-base">
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
        <div className="mt-4 p-3 bg-cyan-100 rounded-md flex items-center gap-2">
          <Users className="text-cyan-800" size={20} />
          <span className="font-medium text-cyan-800">
            Selected: {selectedStaff.size} of {props.list.length} staff members
          </span>
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

      {/* Go to top button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-cyan-800 text-white p-3 rounded-full shadow-lg hover:bg-cyan-900 transition-colors"
          aria-label="Go to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  )
}

export default AttendanceSheet