'use server'
import { Pool } from "pg";
import { v4 as uuidv4 } from 'uuid';


export const handleFormSubmit = async (prevState: any, formData: FormData) => {
  const name = formData.get("name") as string;
  const dob = formData.get("name");
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
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT) || 5432,
      //ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, 
      ssl: { rejectUnauthorized: false },
    })
    
    
    
    const dbConnection = async() => {
      // const db = pool.connect((error, client, release) => {
      //   if (error) {
      //     console.log(error)
      //   }
      //   console.log("connected ooooo") // release connection
      //   const newEntry = pool.query('INSERT INTO public.lga_supervisor_application(id, name, lga, ward, latitude, longitude, total_points, submission_time, phone_number, email, gender, school_qualification, hausa_fluency, english_fluency, full_cordinates) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);',
      //     [id, name, lga, ward, latitude, longitude, points, submissionTime, phoneNumber, email, gender, education, hausa, english])
      //     console.log("posted ooooo") // release connection
      // })
    

      console.log("DB Connection:", process.env.DB_HOST);

        const query = `
          INSERT INTO public.lga_supervisor_application 
          (name, lga, ward, latitude, longitude, total_points, submission_time, phone_number, email, gender, school_qualification, hausa_fluency, english_fluency, full_cordinates, status, dob) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          RETURNING *;`;

        const values = [
          id, name, lga, ward, latitude, longitude, points, submissionTime, 
          phoneNumber, email, gender, education, hausa, english, 
          geolocationData, status, dob
      ];

    const result = await pool.query(query, values);
    // console.log(result)
    };

    dbConnection()
  } catch (error) {
    console.log(error)
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
