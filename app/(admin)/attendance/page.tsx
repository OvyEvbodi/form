import AttendanceSheet, { attendanceDataInterface, AttendanceSheetInterface } from "@/components/AttendanceSheet";
import { getSession, logout } from "@/app/(admin)/attendance/auth/lib"
import Link from "next/link";
import { redirect } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary";
import { PrismaClient } from "@prisma/client";

const AttendanceAdmin = async () => {
  const session = await getSession();
  if (session === null) redirect("/attendance/auth")
  
  const handleSignOut = async () => {
    "use server"
    await logout()
  };

  const getAttendees = async (lgaEntry: string) => {
    try {
      // replace space with underscore, make all lowercase
     const lgaName: string = lgaEntry.toLocaleLowerCase().replace(" ", "_")

     // query their lga table
     const db = new PrismaClient();

     const result = await (db[lgaName as keyof typeof db] as any).findMany({
       select: {
         phone_number: true,
         name: true
       },
     })
     return result
    } catch (error) {
      console.error(error)
      return //error
    }
  };
  const attendeesList: AttendanceSheetInterface[] = await getAttendees(session.user.lga);
  const attendeesData: attendanceDataInterface = {
    lga: session.user.lga,
    list: attendeesList
  }

  return (
    <div className="p-6">
      <div className="min-h-[10vh] flex justify-between items-center p-2 md:pl-8 ">
        <h1 className="font-extrabold uppercase text-cyan-900 md:text-2xl">Attendance page</h1>
        <Link href="/" className="text-cyan-800 hover:underline">Go Home</Link>
        <form action={handleSignOut}>
          <button type="submit" className="lg:min-w-[180px] lg:min-h-[40px] cursor-pointer p-2 lg:py-[11px] px-[27px] text-white font-semibold capitalize bg-cyan-800 rounded-lg hover:bg-cyan-900 transition-all">logout</button>
        </form>
      </div>
      <ErrorBoundary fallback={<div className="text-center">Something's not right. Please refresh the page.</div>}>
        <div className="m-2 flex flex-col justify-between items-center">
          <AttendanceSheet {...attendeesData}  />
        </div>
      </ErrorBoundary>
    </div>
  )
};

export default AttendanceAdmin