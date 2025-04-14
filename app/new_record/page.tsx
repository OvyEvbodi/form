import AddRecords from "@/components/AddRecords"
import { getSession, logout } from "@/app/(admin)/attendance/auth/lib"
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";

const NewRecordpage = async () => {
const session = await getSession();
  if (session === null) redirect("/attendance/auth")
    
  return (
    <div className=" flex flex-col justify-center items-center min-h-screen p-4">
      <NavBar />
      <AddRecords {...session} />
    </div>
  )
};

export default NewRecordpage