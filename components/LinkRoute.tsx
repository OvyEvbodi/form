import Link from "next/link";

export interface LinkProps {
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

export default LinkRoute;