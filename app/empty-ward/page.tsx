
import LinkRoute from "@/components/LinkRoute";
import { clerk, ward } from "@/data/links";



const EmptyWard = () => {

  return (
    <div className="p-10 md:p-20 bg-cyan-700 text-white text-base sm:text-lg text-center">
      <div className="mb-6 p-10 md:p-20 bg-cyan-800/80 text-white text-base sm:text-lg text-center">
        <p className="mb-6 p-4">
          You didn't select a valid ward. <br /> Please try again by clicking on the appropriate link.
        </p>
        <LinkRoute props={clerk} />
        <LinkRoute props={ward} />
      </div>
    </div>  
  )
};

export default EmptyWard;
