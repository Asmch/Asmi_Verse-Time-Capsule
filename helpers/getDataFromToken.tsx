import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const getDataFromToken = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.warn("No token found in cookies");
      return null;
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as { 
      id?: string; 
      _id?: string; 
    };
    
    return decodedToken.id || decodedToken._id || null;
  } catch (error: any) {
    console.error("Token decoding failed:", error.message);
    return null;
  }
};