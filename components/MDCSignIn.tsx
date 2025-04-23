import { auth, signIn } from "@/auth"
import { redirect } from "next/navigation";

const SignIn = async () => {

  const session = await auth();

  if ( session ) redirect("/")

  const handleSignIn = async () => {
    "use server"
    await signIn("google")
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      
      <form action={handleSignIn}>
        <button 
          type="submit"
          className="bg-indigo-800 hover:bg-indigo-600 p-2 cursor-pointer"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  )
}

export default SignIn
