import UserInfo from "@/components/UserInfo"
import { getSession, logout } from "@/lib"
import { redirect } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary";

const Admin = async () => {
  const session = await getSession();
  if (session === null) redirect("/application/auth")
  
  const handleSignOut = async () => {
    "use server"
    await logout()
  };

  return (
    <div>
      <div className="flex justify-between p-2">
      <h1 className="font-extrabold uppercase text-cyan-900 md:text-2xl">Admin page</h1>
      <form action={handleSignOut}>
        <button type="submit" className="lg:min-w-[180px] lg:min-h-[40px] cursor-pointer p-2 lg:py-[11px] px-[27px] text-white font-semibold capitalize bg-cyan-800 rounded-lg hover:bg-cyan-900 transition-all">logout</button>
      </form>
      </div>
      <ErrorBoundary fallback={<div className="text-center">Something's not right. Please refresh the page.</div>}>
        <UserInfo />
      </ErrorBoundary>
    </div>
  )
};

export default Admin