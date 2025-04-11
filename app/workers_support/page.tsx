import NavBar from "@/components/NavBar"
import WorkersSupportForm from "@/components/WorkersSupportForm"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kano IEV Supervisor Complaint Form",
  description: "Allows supervisors submit complaint as seen on the ground"
};

const WorkersSupportPage = () => {
  return (
    <div className="support_img_wrap flex flex-col justify-center items-center min-h-screen p-4">
      <NavBar />
      <WorkersSupportForm />
    </div>
  )
}

export default WorkersSupportPage
