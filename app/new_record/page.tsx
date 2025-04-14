import AddRecords from "@/components/AddRecords"
import { getSession, logout } from "@/app/(admin)/attendance/auth/lib"
import { redirect } from "next/navigation";

const NewRecordpage = async () => {
const session = await getSession();
  if (session === null) redirect("/attendance/auth")
    
  return (
    <div className="p-4 md:p-12">
      <AddRecords {...session} />
    </div>
  )
};

export default NewRecordpage