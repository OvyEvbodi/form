import IEVForm from "@/components/MainForm";
import LinkRoute from "@/components/LinkRoute";
import { clerk, ward } from "@/data/links";

export default function LgaCoordinator() {

  const isDeactivated = false;

  return (
    <div className="bg_img_holder flex flex-col justify-center items-center min-h-screen p-6 -px-2 gap-6 lg:gap-16 lg:p-12 font-[family-name:var(--font-geist-sans)]">
      <div className={ isDeactivated ? "hidden" : "flex flex-col justify-center items-center" }>
        <IEVForm />
      </div>
      <div className={ !isDeactivated ? "hidden" : "flex justify-center items-center p-4 font-medium text-medium min-h-screen min-w-screen"}>
        <div className="bg-cyan-700/60 flex flex-col justify-center items-center p-4">
        {/* <Image src={checkIcon} height={80} width={80} alt="check-icon"/> */}
        <div className="mb-6 p-10 md:p-20 bg-cyan-800/80 text-white text-base sm:text-lg text-center">
          Thank you for your interest in the LGA Assistant role. Due to the number of submissions received,  application for this role is now closed. <br /> Kindly consider applying for: Ward Assistant or Data Clerk (females only)
        </div>
        <LinkRoute props={clerk} />
        <LinkRoute props={ward} />
        </div>
      </div>
    </div>
  );
}
