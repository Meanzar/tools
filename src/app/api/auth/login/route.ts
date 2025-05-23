import clientPromise from "@/lib/mongodb";
import { RefreshTokenSchema, UserInputSchema } from "@/models/schema";
import { NextRequest } from "next/server";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "default_secret";
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const ip = request.headers.get("x-forwaded-for") || request.headers.get("IP") || "unknown"
        const userAgent = request.headers.get("user-agent") || "unknown"

        try {
            const parsedBody = UserInputSchema.parse(body)
            const client = await clientPromise
    
        const db = client.db('tools')
    
        const user = await db.collection('users').findOne({email: parsedBody.email})
    
        if (!user) {
            return Response.json({message:'No user with this email found'}, {status:401})
        }
        
        const isValidPassword = await bcrypt.compare(body.password, user.password)
    
        if (!isValidPassword) {
            return Response.json({message: "Invalid Credentials"}, {status:401})
        }
        const token = jwt.sign(
            {
                _id: user._id.toString(),
                email: user.email
            },
            JWT_SECRET!,
            {expiresIn : "15min"}
        );
    
        const refreshToken = jwt.sign(
            {
                _id: user._id.toString()
            },
            REFRESH_SECRET!,
            {expiresIn: "7d"}
        )
    
        const parsedRefresh_tokens = RefreshTokenSchema.parse({
            userId: user._id,
            token: refreshToken,
            ip: ip,
            userAgent: userAgent,
            expiresAt: new Date((Date.now() + 1000 * 60 * 60 * 24 * 7))

    
        });
        if (token) {
            (await cookies()).set({
            name: 'access_token',
            value: token,
            httpOnly: true,
            secure: true,
            path:'/',
            maxAge: 900,
            sameSite: "lax",
            }
        )
    }
        
        if (refreshToken) {
        (await cookies()).set({
            name: 'refresh_token',
            value: refreshToken,
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax"
        })
        }
    
        const refresh_tokens = await db.collection('refresh_tokens').insertOne(parsedRefresh_tokens)
    
        if (!refresh_tokens) {
            return Response.json({message: "Issues with the tokens"}, {status: 401})
        }
        } catch (error) {
            console.error(error)
            return Response.json({error:"Invalid type"}, {status: 400})
        }
        
        
    
        return Response.json({message: 'login succesfull'}, {status:200})
    
    } catch (error) {
        console.error(error)
        return Response.json({error: "Internal Server Error"}, {status:500})
    }
}