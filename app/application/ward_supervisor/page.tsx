import WardIEVForm from "@/components/WardForm";

export default function WardSupervvisor() {
  return (
    <div className="bg_img_holder flex flex-col justify-center items-center min-h-screen p-6 -px-2 gap-6 lg:gap-16 lg:p-12 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col justify-center items-center">
        <WardIEVForm />
      </div>
    </div>
  );
}
