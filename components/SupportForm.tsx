'use client'
import { useState } from "react";
import ClockLoader from "react-spinners/ClockLoader";

const SupportForm = () => {

  const [isPending, setIsPending ] = useState(false);
  
  return (
    <div className="flex justify-center items-center min-h-2/3 min-w-2/3 text-sm md:text-medium lg:max-w-[860px]">
      <div className="max-w-[70vh] w-full shadow-md shadow-cyan-800 opacity-[0.956] p-4 lg:p-12 rounded-lg bg-linear-to-b from-cyan-100 via-gray-200 to-gray-100">
        <div id="form_wrap">
          <form className="support_form" method="POST" action="https://formsubmit.co/ecokeke21@gmail.com">
              <h3 id="form_title" >let us help you</h3>
              <input type="hidden" name="_subject" value="New Kano IEV support message"></input>
              <input type="hidden" name="_cc" value="evbodiovo@gmmail.com,ecokeke21@gmail.com"></input>
              <input type="hidden" name="_autoresponse" value="We have received your message, and we will get back to you within 24 hours. Thank you"></input>
              {/* <input type="hidden" name="_next" value="https://kano-iev.mydatacollect.com/support_thank_you"></input> */}
              <input type="hidden" name="_next" value="http://127.0.0.1:3000/support_thank_you"></input>

              <div className="form_unit">
                  <input name="name" type="text" placeholder="Enter you name" />
                  <label htmlFor="email"></label>
              </div>
              <div className="form_unit">
                  <input name="email" type="email" placeholder="Enter you email" />
                  <label htmlFor="email"></label>
              </div>
              <div className="form_unit">
                  <textarea name="message" placeholder="Your message...." />
                  <label htmlFor="message"></label>
              </div>
              <input id="submit_btn" type="submit" className="" value="contact support" onClick={() => setIsPending(true)} onChange={() => console.log("")} />
          </form>
          { isPending ? <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen bg-neutral-900/85"><div className="p-12 sm:px-20 bg-gray-100 rounded-lg font-bold text-xl text-center max-w-md"><ClockLoader color="#169285" /></div></div> : <div></div>}
        </div>
      </div>
    </div>
  )
};

export default SupportForm;