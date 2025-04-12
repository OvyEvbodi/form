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

const dateInput = {
  tag: "Pick a date to mark",
  placeholder: "",
  FieldError: false,
  name: "attendance_date",
  id: "attendance_date",
  iconUrl: "",
  type: "date",
  required: true,
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
    <div>
      <form action={action}>
        <h2>Attendance list</h2>
        {JSON.stringify(props.lga)}
        <InputField props={dateInput} />
        {
          props.list.map(person => (
            <div key={person.phone_number}>
              
              <Checkbox
                name="staff" 
                value={`${person.phone_number}-${person.name}`}
                title={person.name}
               />
              <label 
                htmlFor="staff" 
                className="pl-2"
              >
                {person.name} {person.phone_number}
              </label>
            </div>
          ))
        }
        <input type="hidden" name="lga" value={props.lga} />
        <button
          type="submit"
          disabled={isPending}
          className={`"inline-block cursor-pointer py-2 px-6 md:px-12 text-white font-semibold capitalize bg-cyan-800 rounded-sm hover:bg-cyan-900 transition-all ${isPending && "hover:bg-gray-700 hover:text-gray-300 hover:cursor-not-allowed"}`}
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  )
}

export default AttendanceSheet