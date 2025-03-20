import IEVForm from "@/components/MainForm";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-centermin-h-screen p-6 -px-2 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col justify-center items-center">
        <h1 className="p-4 text-3xl font-extrabold text-gray-800">Kano State IEV Implementation Strategy<span className="text-blue-500">LGA Supervisor</span> Application Form</h1>
        <IEVForm />
      </div>
    </div>
  );
}
