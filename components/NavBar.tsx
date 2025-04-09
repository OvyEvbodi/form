import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/logo.jpeg'

const NavBar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Image 
                src={logo} 
                height={40} 
                width={40} 
                alt="nphcda logo" 
                className="rounded-full border-2 border-white"
              />
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Home
              </Link>
              <Link 
                href="/application/admin" 
                className="text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <Link 
              href="/" 
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar