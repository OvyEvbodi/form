import DataClerkForm from "@/components/DataClerkForm";

export default function DataClerk() {
  return (
    <div className="bg_img_holder flex flex-col justify-center items-center min-h-screen p-6 -px-2 gap-6 lg:gap-16 lg:p-12 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col justify-center items-center">
        <DataClerkForm />
      </div>
    </div>
  );
}
