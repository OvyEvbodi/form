import NavBar from "@/components/NavBar"
import WorkersSupportForm from "@/components/WorkersSupportForm"

const WorkersSupportPage = () => {
  return (
    <div className="support_img_wrap flex flex-col justify-center items-center min-h-screen p-4">
      <NavBar />
      <WorkersSupportForm />
    </div>
  )
}

export default WorkersSupportPage
