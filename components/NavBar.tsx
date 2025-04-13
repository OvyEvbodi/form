import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/logo.jpeg'

const NavBar = () => {
  return (
    <Link href="/" className="bg-white min-h-[10vh] flex justify-center items-center gap-4 p-3 md:pl-8 w-full">
      <Image src={logo} height={40} width={40} alt="nphcda logo" />
      <div className="text-cyan-800 font-extrabold hover:underline">Home</div>
    </Link>
  )
}

export default NavBar