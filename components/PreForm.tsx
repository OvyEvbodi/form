'use client'
import {  useState } from "react"
import { useGeolocated } from "react-geolocated";


const PreForm = () => {

  const [email, setEmail] = useState<string>('')

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
    
      const success = (position: any) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log({
          message: "Geolocation successfully detected", 
          email, 
          latitude, 
          longitude, 
          position
        })
        // post email and geolocation details to endpoint

        // redirect to main form
        // window.location.href = 'https://forms.office.com/pages/responsepage.aspx?id=1ZaE-EQo30OpmOXT4XMGwrJ_u3WTTuJAkGoCkBzgQTRUMUtRWU9ZVE9CVEZENFgwMUtXWU1MUklRNC4u&route=shorturl';
      }

      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser")
      } else {
        console.log("Getting location")
        navigator.geolocation.getCurrentPosition(success); // add error callback
      }
    
    } catch (error) {
      // for dev
      console.log(error)
    }
    
  }
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setEmail(event.target.value)
  }
  
  return (
    <form onSubmit={ handleSubmit } className='p-6 flex flex-col gap-4'>
      <label htmlFor="email"></label>
      <input type="email" id="email" name="email" required placeholder='Enter email' onChange={ handleEmail } className='rounded-md text-center p-4 px-8 md:px-14 border-1 border-y-gray-700'/>
      <button className='cursor-pointer bg-cyan-800 text-white p-4 rounded-md'>Start</button>
    </form>
  )
};

export default PreForm