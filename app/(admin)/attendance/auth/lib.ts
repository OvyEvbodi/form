import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";


interface LoginResult {
  success: boolean;
  message?: string;
}

const secretKey = process.env.ATTENDANCE_JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(formData: FormData): Promise<LoginResult> {
  
  const lga = formData.get("lga") as string;
  const ROLE = `${lga.toUpperCase().replace(" ", "_")}_ADMIN_ATTENDANCE_PIN`;
  const adminPin = process.env[ROLE];
  const payloadPin = formData.get("lga_admin_pin");
  
  console.log(ROLE)

  if( adminPin !== payloadPin ) return { success: false, message: "Incorrect pin for this LGA admin user!" }


  const user = {lga};

  // Create the session // change expiration -------------------------
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  (await cookies()).set("session", session, { expires, httpOnly: true });
  return { success: true, message: "Signed in successfully" };
}
export async function logout() {
  // Destroy the session
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  //get current session
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}