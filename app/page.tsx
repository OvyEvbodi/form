import IEVForm from "@/components/MainForm";
import PreForm from "@/components/PreForm";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-centermin-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-extrabold">Kano State IEV Implementation Strategy</h1>
        <PreForm />
        <IEVForm />
      </main>
    </div>
  );
}
