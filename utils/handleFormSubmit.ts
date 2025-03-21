'use server'
import { Pool } from "pg";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from "@prisma/client";
import { redirect } from 'next/navigation';


export const handleFormSubmit = async (prevState: any, formData: FormData) => {
  const name = formData.get("name") as string;
  const dobString = formData.get("dob") as string;
  const phoneNumber = formData.get("phone number") as string;
  const email = formData.get("email") as string;
  const lga = formData.get("lga") as string;
  const ward = formData.get("ward") as string;
  const gender = formData.get("gender") as string;
  const education = formData.get("education") as string;
  const hausa = formData.get("hausa") as string;
  const english = formData.get("english") as string;
  const device = formData.get("device") as string;
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
  const jobRole = formData.get("jobRole") as string;
  const dob = new Date(dobString);
  
  const id = uuidv4();
  const submissionTime = new Date();
  let points = 0;

  const WardMinimumAge:(dob: Date) => boolean = (dob: Date) => {
      const today = new Date();
      
      // Calculate age in full years
      const age = today.getFullYear() - dob.getFullYear();
    
      // Adjust if the birthday hasn't occurred yet this year
      const birthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      if (today < birthdayThisYear) {
        return age - 1 >= 35; // Subtract one year if birthday hasn't occurred
      }
    
      return age >= 35;
  };
  const LgaMinimumAge:(dob: Date) => boolean = (dob: Date) => {
    const today = new Date();
    
    // Calculate age in full years
    const age = today.getFullYear() - dob.getFullYear();
  
    // Adjust if the birthday hasn't occurred yet this year
    const birthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (today < birthdayThisYear) {
      return age - 1 >= 18; // Subtract one year if birthday hasn't occurred
    }
  
    return age >= 18;
};

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

  const getStatus = () => {
    if (jobRole === "ward" && !WardMinimumAge(dob) ) return "Unqualified"
    if (jobRole === "lga" && !LgaMinimumAge(dob) ) return "Unqualified"
    if (device === "No") return "Unqualified"
    if (english !== "Fluent") return "Unqualified"
    if (hausa !== "Fluent" && hausa !== "Native") return "Unqualified"
    if (education !== "Secondary" && education !== "Tertiary")  return "Unqualified"
    if (points < 5) return "Unqualified"
    return "Qualified"
  }

  const status = getStatus();

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
    status,
    device,
    jobRole
  };

  console.log(filledFormData)

  if (jobRole === "ward") {
    try {
      const warddb = new PrismaClient();
      const addWordEntry = await warddb.ward_supervisor_application.create({ 
        data: {
          id,
          name,
          dob,
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
          full_coordinates: geolocationData,
          submission_time: submissionTime,
          total_points: points,
          device,
          status
        }
    })
      } catch (error) {
      console.log(error)
    } finally {
      redirect("/thank-you")
    }
  } else if (jobRole === "lga") {
    try {
      const db = new PrismaClient();
      const addNewEntry = await db.lga_supervisor_application.create({
        data: {
          id,
          name,
          dob,
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
          full_coordinates: geolocationData,
          submission_time: submissionTime,
          total_points: points,
          device,
          status
        }
    })
      } catch (error) {
      console.log(error)
    } finally {
      redirect("/thank-you")
    }
  }

};
