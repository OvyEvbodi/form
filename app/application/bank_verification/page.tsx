import BankVerification from "@/components/BankVerification";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kano IEV Bank verification",
  description: "Verifies bank details for registered applicants at LGA level",
};

const BankVerificationPage = () => {
  return (
    <div>
      <BankVerification />
    </div>
  )
};

export default BankVerificationPage
