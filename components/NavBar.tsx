import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/logo.jpeg'

const NavBar = () => {
  return (
    <div className="min-h-[10vh] flex justify-between items-center gap-4 p-2 md:pl-8 min-w-screen">
      <Image src={logo} height={40} width={40} alt="nphcda logo" />
      <Link href="/" className="text-cyan-800 hover:underline">Go Home</Link>
    </div>
  )
}

export default NavBar