import LinkRoute from "@/components/LinkRoute";
import { clerk, lga, ward } from "@/data/links";
import Link from "next/link";

export default function Home() {

  return (
    <div className="bg_img_holder flex flex-col justify-center items-center min-h-screen p-6 -px-2 gap-6 lg:gap-16 lg:p-12 font-[family-name:var(--font-geist-sans)]">
      <Link href="/application/admin" className="text-cyan-800 hover:underline">Go to Admin Page</Link>
      <h1 className="text-lg md:text-3xl font-extrabold mb-6 text-gray-700 bg-gray-50/70 p-4 ">Kano State IEV Implementation Strategy</h1>
      <div className="flex flex-col justify-center items-center min-h-2/3 text-sm md:text-medium lg:max-w-[860px] p-8 lg:p-12 rounded-lg max-w-screen bg-linear-to-b from-cyan-50/85 via-gray-200/85 to-gray-100/85 md:p-20">
      {/* <h2 className="text-lg md:text-3xl font-extrabold mb-6 text-gray-700">Apply to be:</h2> */}
        <LinkRoute props={lga} />
        <LinkRoute props={ward} />
        <LinkRoute props={clerk} />
      </div>
    </div>
  );
}

