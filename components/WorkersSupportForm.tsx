"use client"

import { WorkerComplaintType } from "@/app/api/workers_support/route";
import { lgaList, lgaWardsMap } from "@/data";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react"


export interface WorkerComplaintResponse extends Response  {
  error?: string;
  success?: string;
  data?: WorkerComplaintType;
}
type FormPreviewType = {
  [key: string]: string[];
};


const WorkersSupportForm = () => {
  const initialState: any = {};
  const [ validForm, setValidForm ] = useState(false);
  const [ view, setView ] = useState(1);
  const [ lga, setLga ] = useState("");
  const [ ward, setWard ] = useState("");
  const wards = lga ? lgaWardsMap[lga] : [];
  const [ lgaError, setLgaError ] = useState(false);
  const [ wardError, setWardError ] = useState(false);
  const [ formPreview, setFormPreview ] = useState<FormPreviewType>({
    Data: [],
    Fieldwork: [],
    Technology: [],
    Resistance: []
  });

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
  const [ state, action, isPending ] = useActionState(handleSubmitComplaint, initialState);


  const handleView = (view: number) => {
    if (!lga && !ward) {
      setLgaError(true)
      setWardError(true)
    } else if (!ward) setWardError(true)
    // else if (view === 2 && formPreview empty ) handle empty entries & set error
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

  const handleFormPreview = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const index = formPreview[event.target.name].indexOf(event.target.title);
    if (index === -1) { 
      // add item
      setFormPreview({
        ...formPreview,
        [event.target.name]: [
          ...formPreview[event.target.name], 
          event.target.title 
        ]
      });
    } else { 
      // remove item
      setFormPreview({
        ...formPreview,
        [event.target.name]: formPreview[event.target.name].filter(
          (_: any, i: any) => i !== index
        )
      });
    }

  };

  useEffect(() => {
    console.log("Change updated!")
  }, [ formPreview ]); 

  return (
    <div className="sm:min-h-8/12 sm:min-w-2/3 text-gray-700 text-sm lg:max-w-[860px] p-4 sm:p-10 rounded-md max-w-screen bg-linear-to-b from-cyan-100/70 via-gray-300/80 to-gray-200/80">
      <div>
        <h1 className="py-2 sm:py-6 text-cyan-800 text-lg sm:text-3xl font-bold">Kano-IEV Supervisors Complaint Form</h1>
      </div>
      <form action={action}>
       
            <section className={view !== 1 ? "hidden" : "flex flex-col gap-6"}>
              <div>
                <div>
                  <h2 className="py-2 sm:pb-5 text-lg sm:text-xl font-bold">Demographics</h2>
                </div>
                <div>

                  <div className="mb-2">
                    <label htmlFor="name" className="font-bold text-md mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="phone_number" className="font-bold text-md mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone_number"
                      required
                      className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="org" className="font-bold text-md mb-1">Organization</label>
                    <input
                      type="text"
                      name="org"
                      className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700"
                      placeholder="Enter your organization"
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="lga" className="font-bold text-md mb-1">Affected LGA</label><span className=" ml-1 text-red-700">&#10038;</span>
                    <select name="lga" value={lga} required onChange={ handleLgaChange } className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700">
                      <option value="">Select LGA</option>
                      {lgaList.map((item: string, index: number) => (
                        <option key={index}  value={item}>{item}</option>
                      ))}
                    </select>
                    {lgaError && (<span className="my-2 text-xs text-red-700">Please select an LGA</span>)}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="ward" className="font-bold text-md mb-1">Affected Ward</label><span className=" ml-1 text-red-700">&#10038;</span>
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

                  <div className="mb-2">
                    <label htmlFor="settlement" className="font-bold text-md mb-1">Affected Settlement</label>
                    <input
                      type="text"
                      name="settlement"
                      className="block mt-2 w-full bg-white p-3 rounded-md outline-none border-b-2 border-cyan-700"
                      placeholder="Enter affected settlement name"
                    />
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
                  <h3 className="py-2 sm:pb-5 text-lg sm:text-xl font-bold">Check all that apply</h3>
                </div>
                <div>
                  <div className="mb-2">
                    <h6 className="font-bold text-md mb-1">Data Collection Challenges</h6>
                    <div>
                      <input 
                        name="Data" 
                        value="reluctance" 
                        title="Reluctance to Share Information"
                        type="checkbox" 
                        onChange={handleFormPreview}
                      />
                      <label htmlFor="Data" 
                        className="pl-2">Reluctance to Share Information
                      </label>
                    </div>
                    <div>
                      <input 
                        name="Data" 
                        value="Inaccurate" 
                        title="Inaccurate or Incomplete Responses"
                        type="checkbox"
                        onChange={handleFormPreview} 
                      />
                      <label 
                        htmlFor="Data" 
                        className="pl-2"
                      >
                        Inaccurate or Incomplete Responses
                      </label>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h6 className="font-bold text-md mb-1">Fieldwork Difficulties</h6>
                    <div>
                      <input 
                        name="Fieldwork" 
                        value="Logistical" 
                        title="Logistical Issues"
                        type="checkbox" 
                        onChange={handleFormPreview}
                      />
                      <label 
                        htmlFor="Fieldwork" 
                        className="pl-2"
                      >
                        Logistical Issues
                      </label>
                    </div>
                    <div>
                      <input 
                        name="Fieldwork" 
                        value="Safety" 
                        title="Safety Concerns"
                        type="checkbox" 
                        onChange={handleFormPreview}
                      />
                      <label 
                        htmlFor="Fieldwork" 
                        className="pl-2"
                      >
                        Safety Concerns
                      </label>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h6 className="font-bold text-md mb-1">Technology & Tools Problems</h6>
                    <div>
                      <input 
                        name="Technology" 
                        value="Device" 
                        title="Device Failures"
                        type="checkbox" 
                        onChange={handleFormPreview}
                      />
                      <label 
                        htmlFor="Technology" 
                        className="pl-2"
                      >
                        Device Failures
                      </label>
                    </div>
                    <div>
                      <input 
                        name="Technology" 
                        value="Software" 
                        title="Software Glitches"
                        type="checkbox" 
                        onChange={handleFormPreview}
                      />
                      <label 
                        htmlFor="Technology" 
                        className="pl-2"
                      >
                        Software Glitches
                      </label>
                    </div>

                    <div>
                      <input 
                        name="Technology" 
                        value="Mismatch" 
                        title="Team code does not match settlement"
                        type="checkbox" 
                        onChange={handleFormPreview}
                      />
                      <label 
                        htmlFor="Technology" 
                        className="pl-2"
                      >
                        Team code does not match settlement
                      </label>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h6 className="font-bold text-md mb-1">Stakeholder Response</h6>
                    <div>
                      <input 
                        name="Resistance" 
                        value="Suspicion" 
                        title="Suspicion of Motives"
                        type="checkbox" 
                        onChange={handleFormPreview}
                        />
                      <label 
                        htmlFor="Resistance" 
                        className="pl-2"
                        >
                          Suspicion of Motives
                        </label>
                    </div>
                    <div>
                      <input 
                        name="Resistance" 
                        value="Religious" 
                        title="Poor cooperation from Religious/Traditional leaders"
                        type="checkbox" 
                        onChange={handleFormPreview} 
                      />
                      <label 
                        htmlFor="Resistance" 
                        className="pl-2"
                      >
                        Poor cooperation from Religious/Traditional leaders
                      </label>
                    </div>

                    <div>
                      <input 
                        name="Resistance" 
                        value="Community" 
                        title="Poor cooperation from community leaders"
                        type="checkbox" 
                        onChange={handleFormPreview}
                        />
                      <label 
                        htmlFor="Resistance" 
                        className="pl-2"
                        >
                          Poor cooperation from community leaders
                        </label>
                    </div>

                    <div>
                      <input 
                        name="Resistance" 
                        value="lga_team" 
                        title="Poor cooperation from LGA team"
                        type="checkbox" 
                        onChange={handleFormPreview}
                        />
                      <label 
                        htmlFor="Resistance" 
                        className="pl-2"
                        >
                          Poor cooperation from LGA team
                        </label>
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
                <div>
                <div>
    {lga && Object.entries(formPreview)
      .filter(([_, val]) => val.length > 0)
      .map(([key, val]) => (
        <div key={key}>
          <h3>{key}</h3>
          <ul className="list-disc list-inside ml-4">
            {val.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
  </div>
                </div>
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
                  disabled={isPending}
                  className={`"inline-block cursor-pointer py-2 px-6 md:px-12 text-white font-semibold capitalize bg-cyan-800 rounded-sm hover:bg-cyan-900 transition-all ${isPending && "hover:bg-gray-700 hover:text-gray-300 hover:cursor-not-allowed"}`}
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
