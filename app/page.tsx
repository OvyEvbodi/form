import Link from "next/link";

export default function Home() {

  const lga: LinkProps = {
    hrefString: "application/lga_assistant",
    linkText: "An LGA Assistant"
  };
  const ward: LinkProps = {
    hrefString: "application/ward_assistant",
    linkText: "A Ward Assistant"
  };
  const clerk: LinkProps = {
    hrefString: "application/data_clerk",
    linkText: "A Data Clerk"
  };

  return (
    <div className="bg_img_holder flex flex-col justify-center items-center min-h-screen p-6 -px-2 gap-6 lg:gap-16 lg:p-12 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-lg md:text-3xl font-extrabold mb-6 text-gray-700">Kano State IEV Implementation Strategy</h1>
      <div className="flex flex-col justify-center items-center min-h-2/3 text-sm md:text-medium lg:max-w-[860px] p-8 lg:p-12 rounded-lg max-w-screen bg-linear-to-b from-cyan-50/85 via-gray-200/85 to-gray-100/85 md:p-20">
      <h2 className="text-lg md:text-3xl font-extrabold mb-6 text-gray-700">Apply to be:</h2>
        <LinkRoute props={lga} />
        <LinkRoute props={ward} />
        <LinkRoute props={clerk} />
      </div>
    </div>
  );
}

interface LinkProps {
  hrefString: string;
  linkText: String;
}
const LinkRoute = ({props}:  {props: LinkProps}) => {
  return (
    <div className="mb-4 cursor-pointer text-center sm:min-w-md md:min-w-2xl py-4 px-14 sm:px-16 text-white font-bold sm:text-3xl capitalize bg-cyan-700 rounded-lg hover:bg-cyan-800 transition-all">
      <Link href={props.hrefString}>{props.linkText}</Link>
    </div>
  )
};