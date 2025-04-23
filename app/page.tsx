import LandingPage from '@/components/LandingPage';
import { Metadata } from 'next';
import { auth } from "@/auth"



export const metadata: Metadata = {
  title: "MyDataCollect | Custom Form Solutions for Enterprises",
  description: "Professional custom form development with scalable database management for NGOs and enterprises",
};

import React from 'react'

const Home = async () => {
  return (
    <>
    <LandingPage />
    </>
  )
}

export default Home

