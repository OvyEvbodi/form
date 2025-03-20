'use client'
import {  useState } from "react"
import { useGeolocated } from "react-geolocated";


const PreForm = () => {

  const [email, setEmail] = useState<string>('')

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // post email and geolocation details to endpoint
    console.log({email, location: {lat: 5.34300, long: 5686.55}})
    // window.location.href = 'https://forms.office.com/pages/responsepage.aspx?id=1ZaE-EQo30OpmOXT4XMGwrJ_u3WTTuJAkGoCkBzgQTRUMUtRWU9ZVE9CVEZENFgwMUtXWU1MUklRNC4u&route=shorturl';
  }
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setEmail(event.target.value)
    console.log(email)
  }
  
  return (
    <form onSubmit={ handleSubmit } className='p-6 flex flex-col gap-4'>
      <label htmlFor="email"></label>
      <input type="email" id="email" name="email" required placeholder='Enter email' onChange={ handleEmail } className='rounded-md text-center p-4 border-1 border-y-gray-700'/>
      <button className='cursor-pointer bg-cyan-800 text-white p-4 rounded-md'>Start</button>
    </form>
  )
};

export default PreForm