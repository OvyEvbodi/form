import AttendanceForm from "@/components/AttendanceForm";
import Link from "next/link";

const AttendancePage = () => {
  const isDeactivated = false;

  return (
    <div className="bg_img_holder flex flex-col justify-center items-center min-h-screen p-6 -px-2 gap-6 lg:gap-16 lg:p-12 font-[family-name:var(--font-geist-sans)]">
      {
        !isDeactivated &&
          <div className={ isDeactivated ? "hidden" : "flex flex-col justify-center items-center" }>
            <AttendanceForm />
          </div>
      }
      {
        isDeactivated &&
          <div className={ !isDeactivated ? "hidden" : "flex justify-center items-center p-4 font-medium text-medium min-h-screen min-w-screen"}>
            <div className="bg-cyan-700/60 flex flex-col justify-center items-center p-4">
              {/* <Image src={checkIcon} height={80} width={80} alt="check-icon"/> */}
              <div className="mb-6 p-10 md:p-20 bg-cyan-800/80 text-white text-base sm:text-lg text-center">
                <p>
                  This page has been deactivated.
                </p>
                <Link href="/" className="block m-3 text-gray-400 underline hover:text-gray-200">Go back home</Link>
              </div>
            </div>
          </div>
      }
    </div>
  );
};

export default AttendancePage;
