import { auth } from '@/auth';
import Link from 'next/link'
import React from 'react'

const MDCNavBar = async () => {
  const session = await auth();

  return (
    <nav className="text-gray-500 sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-800">MyDataCollect</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-800">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-800">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-indigo-800">Case Studies</a>
            </div>
            <div className="flex items-center space-x-4">
              {
                session?.user?.name ? (
                  <p>Welcome back, {session?.user?.name}</p>
                ) : 
                (
                  <Link href='/MDCSignIn'
                    className="text-gray-600 hover:text-indigo-800 py-2 px-3 rounded-md border border-indigo-800"
                  >
                    Sign In
                  </Link>
                )
              }
              <a 
                href="#pricing" 
                className="hidden sm:block px-4 py-2 bg-indigo-800 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>
  )
}

export default MDCNavBar