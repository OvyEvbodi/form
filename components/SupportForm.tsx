'use client'
import { useState } from "react";
import ClockLoader from "react-spinners/ClockLoader";

const SupportForm = () => {

  const [isPending, setIsPending ] = useState(false);
  
  return (
    <div className="flex justify-center items-center min-h-2/3 min-w-2/3 text-sm md:text-medium lg:max-w-[860px]">
      <div className="max-w-[70vh] w-full shadow-md shadow-cyan-800 opacity-[0.956] p-4 lg:p-12 rounded-lg bg-linear-to-b from-cyan-100 via-gray-200 to-gray-100">
        <div id="form_wrap">
          <form className="support_form" method="POST" action="https://formspree.io/f/mpwpdzae" >
              <h3 id="form_title" >let us help you</h3>
              
              <div className="form_unit">
                  <input name="name" type="text" placeholder="Enter you name" />
                  <label htmlFor="email"></label>
              </div>
              <div className="form_unit">
                  <input name="email" type="email" required placeholder="Enter you email" />
                  <label htmlFor="email"></label>
              </div>
              <div className="form_unit">
                  <textarea name="message" required placeholder="Your message...." />
                  <label htmlFor="message"></label>
              </div>
              <input id="submit_btn" type="submit" className="" value="contact support" onClick={() => { setIsPending(true); setTimeout(() => setIsPending(true), 10000) }} onChange={() => console.log("")} />
          </form>
          { isPending ? <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen bg-neutral-900/85"><div className="p-12 sm:px-20 bg-gray-100 rounded-lg font-bold text-xl text-center max-w-md"><ClockLoader color="#169285" /></div></div> : <div></div>}
        </div>
      </div>
    </div>
  )
};

export default SupportForm;