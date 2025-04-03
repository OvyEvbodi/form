import { getSession, login } from "@/lib"
import { redirect } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary";
// import bcrypt from 'bcrypt'



const IEVAuth = async () => {

  const handleSignIn = async (formData: FormData) => {
    "use server"
    await login(formData)
  };
  
  const session = await getSession();
  if (session !== null) redirect("/application/admin")

  return (
    <div className="bg-gray-300 flex flex-col gap-8 flex-wrap justify-center items-center min-h-screen min-w-screen p-6">
      <ErrorBoundary fallback={<div className="text-center">Something's not right. Please refresh the page.</div>}>
      <h1 className="font-extrabold text-cyan-900 text-2xl md:text-3xl capitalize">Please sign in to view admin page</h1>
      <form action={handleSignIn} className="max-w-max bg-white shadow-xl rounded-md shadow-cyan-900 text-center p-12 flex flex-col gap-3">
        <label htmlFor="role" className="font-bold text-md capitalize text-gray-700">Select user & enter pin</label>
        <select name="role" required={true} className="block mt-2 w-full bg-gray-200 p-2 rounded-md outline-none border-b-2 border-cyan-700">
          <option>Admin</option>
          <option>Super Admin</option>
        </select>
        <input required={true} name="admin_pin" type="password" placeholder="Enter admin pin" className="text-center w-full outline-none bg-gray-200 p-2 rounded-md" />
        <button type="submit" className="lg:min-w-[227px] min-h-[46px] cursor-pointer py-[11px] px-[27px] text-white font-semibold capitalize bg-cyan-800 rounded-lg hover:bg-cyan-900 transition-all">Sign in</button>
      </form>
      </ErrorBoundary>
    </div>
  )
};

export default IEVAuth