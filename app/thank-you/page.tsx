import Image from "next/image";
import checkIcon from "@/public/check_icon.png";
const ThankYou = () => {
  return (
    <div className="flex justify-center items-center p-4 font-medium text-medium min-h-screen min-w-screen">
      <div className="bg-cyan-800 flex flex-col justify-center items-center p-4">
      <Image src={checkIcon} height={80} width={80} alt="check-icon"/>
      <div className="p-10 md:p-20 bg-cyan-800 text-white text-base sm:text-lg text-center">Thank you for your response. <br/> You may close this page now. </div>
      </div>
    </div>
  )
};

export default ThankYou;
