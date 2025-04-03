import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


interface LoginResult {
  success: boolean;
  message?: string;
}

const secretKey = process.env.JWT_SECRET;
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
  
  const role = formData.get("role");
  const adminPin = process.env.ADMIN_PIN;
  const superAdminPin = process.env.SUPER_ADMIN_PIN;
  const payloadPin = formData.get("admin_pin");
  if( role === "Admin" && adminPin !== payloadPin ) return { success: false, message: "Incorrect pin for Admin user!" }
  else if( role === "Super Admin" && superAdminPin !== payloadPin ) return { success: false, message: "Incorrect pin for Super Admin user!" }

  const user = {role};

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