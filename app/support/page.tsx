import SupportForm from "@/components/SupportForm";
import Link from "next/link";

const SupportPage = () => {
  const isDeactivated = true;

  return (
    <div>
      <div className={ isDeactivated ? "hidden" : "flex justify-center items-center min-w-screen min-h-screen"}>
        <SupportForm />
      </div>
      <div className={ !isDeactivated ? "hidden" : "flex justify-center items-center min-w-screen min-h-screen"}>
        <p>
          This page has been deactivated.
        </p>
        <Link href="/" className="block m-3 text-blue-800 underline hover:text-blue-600">Go back home</Link>
      </div>
    </div>
    
  )
};

export default SupportPage