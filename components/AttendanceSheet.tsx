"use client"

import InputField from "@/components/Input";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Checkbox } from "@/components/ui/checkbox"


export interface AttendanceSheetInterface {
  phone_number: string;
  name: string;
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
  
  


  return (
    <div className=" shadow-gray-800 shadow-lg sm:min-h-8/12 sm:min-w-2/3 text-gray-700 text-sm lg:max-w-[860px] p-4 sm:p-10 rounded-md max-w-screen bg-linear-to-b from-cyan-50/70 via-gray-200/80 to-gray-100/80">
      <div>
        <h1 className="py-2 sm:py-6 text-cyan-800 text-lg sm:text-3xl font-bold capitalize">Kano-IEV supervisors attendance list for <span className="text-gray-700">{props.lga}</span></h1>
      </div>
      <form action={action}>
        <InputField props={dateInput} />
        <table className="w-full">
          <thead>
            <tr>
              <th>status</th>
              <th>name</th>
              <th>phone number</th>
            </tr>
          </thead>
          <tbody>
            {
              props.list.map(person => (
                <tr key={person.phone_number}>
                  <td>
                  <Checkbox
                    name="staff" 
                    value={`${person.phone_number}-${person.name}`}
                    title={person.name}
                   />
                  </td>
                  <td>
                  <label 
                    htmlFor="staff" 
                    className="pl-2"
                  >
                    {person.name}
                  </label>
                  </td>
                  <td> {person.phone_number}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <input type="hidden" name="lga" value={props.lga} />
        <button
          type="submit"
          disabled={isPending}
          className={`"inline-block cursor-pointer mt-4 py-3 px-6 md:px-12 w-full text-white font-semibold capitalize bg-cyan-800 rounded-sm hover:bg-cyan-900 transition-all duration-300 ease-in-out ${isPending && "hover:bg-gray-700 hover:text-gray-300 hover:cursor-not-allowed"}`}
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  )
}

export default AttendanceSheet