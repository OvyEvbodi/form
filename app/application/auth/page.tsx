import { getSession, login } from "@/lib";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";


// interface AuthPageProps {
//   searchParams: {
//     error?: string;
//   };
// }

export default async function IEVAuth({ searchParams }: any) {
  // First await the session check
  const session = await getSession();
  if (session) redirect("/application/admin");

  // Properly handle searchParams by extracting values immediately
  const errorMessage = searchParams?.error;

  async function handleSignIn(formData: FormData) {
    "use server";
    try {
      const result = await login(formData);
      
      if (result?.success) {
        redirect("/application/admin");
      } else {
        redirect(`/application/auth?error=${encodeURIComponent(result?.message || "Authentication failed")}`);
      }
    } catch (error) {
      redirect(`/application/auth?error=${encodeURIComponent("Incorrect pin for this user!")}`);
    }
  }

  return (
    <div className="bg-gray-300 flex flex-col gap-8 flex-wrap justify-center items-center min-h-screen min-w-screen p-6">
      <ErrorBoundary fallback={<div className="text-center">The Admin page displays sensitive information, so access to it is limited. You have entered the wrong pin. Please refresh the page and try with the correct pin for your user. Kindly note that you may lock the page with too many incorrect tries.</div>}>
        <h1 className="font-extrabold text-cyan-900 text-2xl md:text-3xl capitalize">
          Please sign in to view admin page
        </h1>
        
        {/* Display error message if exists */}
        {errorMessage && (
          <div className="text-red-500 bg-red-50 px-4 py-2 rounded-md max-w-md text-center mb-4">
            {decodeURIComponent(errorMessage)}
          </div>
        )}

        <form 
          action={handleSignIn}
          className="max-w-max bg-white shadow-xl rounded-md shadow-cyan-900 text-center p-12 flex flex-col gap-3"
        >
          <label htmlFor="role" className="font-bold text-md capitalize text-gray-700">
            Select user & enter pin
          </label>
          <select 
            name="role" 
            required 
            className="block mt-2 w-full bg-gray-200 p-2 rounded-md outline-none border-b-2 border-cyan-700"
          >
            <option>Admin</option>
            <option>Super Admin</option>
          </select>
          <input 
            required 
            name="admin_pin" 
            type="password" 
            placeholder="Enter admin pin" 
            className="text-center w-full outline-none bg-gray-200 p-2 rounded-md" 
          />
          <button 
            type="submit" 
            className="lg:min-w-[227px] min-h-[46px] cursor-pointer py-[11px] px-[27px] text-white font-semibold capitalize bg-cyan-800 rounded-lg hover:bg-cyan-900 transition-all"
          >
            Sign in
          </button>
        </form>
      </ErrorBoundary>
    </div>
  );
}