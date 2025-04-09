"use client"

import { WorkerComplaintType } from "@/app/api/workers_support/route";
import { lgaList, lgaWardsMap } from "@/data";
import { redirect } from "next/navigation";
import { useActionState, useState } from "react"


export interface WorkerComplaintResponse extends Response  {
  error?: string;
  success?: string;
  data?: WorkerComplaintType;
}

const WorkersSupportForm = () => {
  const handleSubmitComplaint: (prevState: WorkerComplaintType, formData: FormData) => Promise<WorkerComplaintResponse> = async (prevState: WorkerComplaintType, formData: FormData) => {
    const result = await fetch("/api/workers_support", {
      method: "POST",
      body: formData
    });
    const feedback = await result.json();

    if (result.status === 200) redirect("/thank-you")
   
    return {
      error: feedback.error || null,
      success: feedback.success || null,
      data: feedback.data || null,
    } as WorkerComplaintResponse
  };


  const initialState: any = {};
  const [ state, action, isPending ] = useActionState(handleSubmitComplaint, initialState);
  const [ validForm, setValidForm ] = useState(false);
  const [ view, setView ] = useState(1);
  const [ lga, setLga ] = useState("");
  const [ ward, setWard ] = useState("");
  const wards = lga ? lgaWardsMap[lga] : [];
  const [ lgaError, setLgaError ] = useState(false);
  const [ wardError, setWardError ] = useState(false);


  const handleView = (view: number) => {
    if (!lga) setLgaError(true)
      else if (!ward) setWardError(true)
    else setView(view)
  };

  const handleLgaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLgaError(false)
    setLga(event.target.value)
    setWard('')
  };

  const handleWardChange  = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setWardError(false)
    setWard(event.target.value)
  };

  return (
    <div className="sm:min-h-8/12 sm:min-w-2/3 text-gray-700 text-sm lg:max-w-[860px] p-4 sm:p-10 rounded-md max-w-screen bg-linear-to-b from-cyan-100/70 via-gray-300/80 to-gray-200/80">
      <div>
        <h1 className="py-2 sm:py-6 text-cyan-800 text-lg sm:text-3xl font-bold">Kano-IEV Workers Support Form</h1>
      </div>
      <form action={action}>
       
            <section className={view !== 1 ? "hidden" : "flex flex-col gap-6"}>
              <div>
                <div>
                  <h2 className="py-2 sm:pb-5 text-lg sm:text-xl font-bold">Demographics</h2>
                </div>
                <div>
                  <div className="mb-2">
                    <label htmlFor="lga" className="font-bold text-md mb-1">LGA of Residence</label><span className=" ml-1 text-red-700">&#10038;</span>
                    <select name="lga" value={lga} required onChange={ handleLgaChange } className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700">
                      <option value="">Select LGA</option>
                      {lgaList.map((item: string, index: number) => (
                        <option key={index}  value={item}>{item}</option>
                      ))}
                    </select>
                    {lgaError && (<span className="my-2 text-xs text-red-700">Please select an LGA</span>)}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="ward" className="font-bold text-md mb-1">Ward of Residence</label><span className=" ml-1 text-red-700">&#10038;</span>
                    <select  name="ward" value={ward} required disabled={!lga} onChange={handleWardChange} className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700">
                      <option value="">Choose a ward</option>
                      {
                        wards.map((item: string, index: number) => (
                          <option key={index}  value={item}>{item}</option>
                        ))
                      }
                    </select>
                    {wardError && (<span className="my-2 text-xs text-red-700">Please select a ward</span>)}
                  </div>

                </div>
              </div>
              <div
                onClick={() => handleView(2)}
                className="self-end inline-block cursor-pointer py-2 px-6 md:px-12 text-white font-semibold capitalize bg-cyan-800 rounded-sm  hover:bg-cyan-900 transition-all"
                >
                  Next
              </div>
            </section>
{/*------------ section 2 --------------------- */}
            <section className={view !== 2 ? "hidden" : "flex flex-col gap-6 "}>
              <div>
                <div>
                  <h2 className="py-2 sm:pb-5 text-lg sm:text-xl font-bold">Complaint</h2>
                  <p>Check all that apply</p>
                </div>
                <div>
                  <div className="mb-2">
                    <h6 className="font-bold text-md mb-1">Data Collection Challenges</h6>
                    <div>
                      <input name="data" value="reluctance" type="checkbox" />
                      <label htmlFor="data" className="pl-2">Reluctance to Share Information</label>
                    </div>
                    <div>
                      <input name="data" value="Inaccurate" type="checkbox" />
                      <label htmlFor="data" className="pl-2">Inaccurate or Incomplete Responses</label>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h6 className="font-bold text-md mb-1">Fieldwork Difficulties</h6>
                    <div>
                      <input name="Fieldwork" value="Logistical" type="checkbox" />
                      <label htmlFor="Fieldwork" className="pl-2">Logistical Issues</label>
                    </div>
                    <div>
                      <input name="Fieldwork" value="Safety" type="checkbox" />
                      <label htmlFor="Fieldwork" className="pl-2">Safety Concerns</label>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h6 className="font-bold text-md mb-1">Technology & Tools Problems</h6>
                    <div>
                      <input name="Technology" value="Device" type="checkbox" />
                      <label htmlFor="Technology" className="pl-2">Device Failures</label>
                    </div>
                    <div>
                      <input name="Technology" value="Software" type="checkbox" />
                      <label htmlFor="Technology" className="pl-2">Software Glitches</label>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h6 className="font-bold text-md mb-1">Community Resistance</h6>
                    <div>
                      <input name="Resistance" value="Suspicion" type="checkbox" />
                      <label htmlFor="Resistance" className="pl-2">Suspicion of Motives</label>
                    </div>
                    <div>
                      <input name="Resistance" value="Religious" type="checkbox" />
                      <label htmlFor="Resistance" className="pl-2">Religious/Traditional Hinderance</label>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h6 className="font-bold text-md mb-1">Administrative & Systemic Issues</h6>
                    <div>
                      <input name="Administrative" value="Incentives" type="checkbox" />
                      <label htmlFor="Administrative" className="pl-2">Poor Incentives</label>
                    </div>
                    <div>
                      <input name="Administrative" value="Validation" type="checkbox" />
                      <label htmlFor="Administrative" className="pl-2">Slow Feedback</label>
                    </div>
                  </div>


                </div>
              </div>
              <div className="flex justify-between">
                <div 
                  onClick={() => handleView(1)}
                  className="inline-block cursor-pointer py-2 px-6 md:px-12 text-white font-semibold capitalize bg-cyan-800 rounded-sm  hover:bg-cyan-900 transition-all"
                >
                  back
                </div>
                <div 
                  onClick={() => handleView(3)}
                  className="inline-block cursor-pointer py-2 px-6 md:px-12 text-white font-semibold capitalize bg-cyan-800 rounded-sm  hover:bg-cyan-900 transition-all"
                >
                  Next
                </div>
              </div>
            </section>
       
{/*------------ section 3 --------------------- */}
            <section  className={view !== 3 ? "hidden" : "flex flex-col gap-6 "}>
              <div>
                <div>
                <h2 className="py-2 sm:pb-1 text-lg sm:text-xl font-bold">Complaint review</h2>
                <p className="py-2 sm:pb-2">selected options appear here after I get the questions</p>
                </div>
                <div>
                <div className="mb-2">
                    <h6 className="font-bold text-md mb-1">Review issues</h6>
                    <div>
                      <input name="agree" title="Please check that you've reviewed your complaint" required value="Validation" type="checkbox" />
                      <label htmlFor="agree" className="pl-2">I have reviewed my complaint</label><span className="ml-1 text-red-700">&#10038;</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div 
                  onClick={() => handleView(2)}
                  className="inline-block cursor-pointer py-2 px-6 md:px-12 text-white font-semibold capitalize bg-cyan-800 rounded-sm  hover:bg-cyan-900 transition-all"
                >
                  back
                </div>
                <button
                  type="submit"
                  disabled={isPending || validForm}
                  className={`"inline-block cursor-pointer py-2 px-6 md:px-12 text-white font-semibold capitalize bg-cyan-800 rounded-sm hover:bg-cyan-900 transition-all ${isPending || !validForm && "hover:bg-gray-700 hover:text-gray-300 hover:cursor-not-allowed"}`}
                >
                  {isPending ? "Submitting..." : "Submit"}
                </button>
              </div>
            </section>
      </form>
    </div>
  )
}

export default WorkersSupportForm
