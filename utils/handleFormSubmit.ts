'use server'
import { Pool } from "pg";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from "@prisma/client";
import { redirect } from 'next/navigation';


export const handleFormSubmit = async (prevState: any, formData: FormData) => {
  const name = formData.get("name") as string;
  const dob = formData.get("dob");
  const phoneNumber = formData.get("phone number") as string;
  const email = formData.get("email") as string;
  const lga = formData.get("lga") as string;
  const ward = formData.get("ward") as string;
  const gender = formData.get("gender") as string;
  const education = formData.get("education") as string;
  const hausa = formData.get("hausa") as string;
  const english = formData.get("english") as string;
  const latitude = formData.get("latitude") as string;
  const longitude = formData.get("longitude") as string;
  const geolocationData = formData.get("geolocationData") as string;
  const communityCoordination = formData.get("community-based coordination") as string;
  const dataCollectionTools = formData.get("data collection tool") as string;
  const equipmentMalfunctioned = formData.get("equipment malfunctioned") as string;
  const communityResistance = formData.get("resistance from community members") as string;
  const communitySupport = formData.get("support from community leaders") as string;
  const caregiversConerns = formData.get("caregivers raise concerns") as string;
  const hardtoreachCommunities = formData.get("hard-to-reach communities") as string;
  const id = uuidv4();
  const submissionTime = new Date();
  let points = 0;
  const status = "qualified"; //sort out logic

  const calculatePoints = () => {
    communityCoordination === "Yes" && points++
    dataCollectionTools !== "None" && points++
    equipmentMalfunctioned === "Assess the situation, troubleshoot where possible, and implement alternative solutions while keeping stakeholders informed." && points++
    communityResistance === "Politely listen to their concerns, address them respectfully using the information provided during training, and try to build trust and understanding." && points++
    communitySupport === "Clearly explain the project's objectives, benefits, and addressing potential concerns openly and honestly." && points++
    caregiversConerns === "Politely listen to their specific concerns, provide accurate information based on your training and approved materials, and address their questions respectfully." && points++
    hardtoreachCommunities === "Adapting data collection strategies, communication methods, and engaging with community-specific gatekeepers and influencers to build trust and access." && points++
  };
  calculatePoints()

  try {
    const db = new PrismaClient();
    const addNewEntry = await db.lga_supervisor_application.create({
      data: {
        id,
        name,
        phone_number: phoneNumber, 
        email,
        lga,
        ward,
        gender,
        school_qualification: education,
        hausa_fluency: hausa,
        english_fluency: english,
        latitude,
        longitude,
        full_cordinates: geolocationData,
        submission_time: submissionTime,
        total_points: points,
        status
      }
    })
  } catch (error) {
    console.log(error)
  } finally {
    redirect("/thank-you")
  }
  
  const filledFormData = {
    id,
    name,
    dob,
    phoneNumber, 
    email,
    lga,
    ward,
    gender,
    education,
    hausa,
    english,
    latitude,
    longitude,
    geolocationData,
    submissionTime,
    communityCoordination,
    dataCollectionTools,
    equipmentMalfunctioned,
    communityResistance,
    communitySupport,
    caregiversConerns,
    hardtoreachCommunities,
    points,
    status
  };

  console.log(filledFormData)
  
};