'use server'
import { Pool } from "pg";

try {
  const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: 5432
  })
  
  const dbConnection = async() => {
    const db = pool.connect((error, client, release) => {
      if (error) {
        console.log(error)
      }
      console.log("connected ooooo") // release connection
    })
  };
  dbConnection()
} catch (error) {
  console.log(error)
}


export const handleFormSubmit = async (prevState: any, formData: FormData) => {
  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phone number") as string;
  const email = formData.get("email") as string;
  const lga = formData.get("lga") as string;
  const ward = formData.get("ward") as string;
  const gender = formData.get("gender") as string;
  const education = formData.get("education") as string;
  const hausa = formData.get("hausa") as string;
  const english = formData.get("english") as string;
  const communityBasedCoordination = formData.get("community-based coordination") as string;
  const dataCollectionTool = formData.get("data collection tool") as string;

  const filledFormData = {
    name,
    phoneNumber,
    email,
    lga,
    ward,
    gender,
    education,
    hausa,
    english,
    communityBasedCoordination,
    dataCollectionTool
  };

  console.log(filledFormData)
};

