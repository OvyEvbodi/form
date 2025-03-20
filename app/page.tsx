import IEVForm from "@/components/MainForm";

export default function Home() {
  return (
    <div className=" bg_img_holder flex flex-col justify-center items-centermin-h-screen p-6 -px-2 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col justify-center items-center">
        <IEVForm />
      </div>
    </div>
  );
}
