import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"
import  jwt, { JwtPayload } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "default secret"

export async function POST() {
    try {
        const client = await clientPromise
        const db = client.db('tools')
        const token = (await cookies()).get('access_token')?.value || 'undefined'
        const refresh_token = (await cookies()).get('refresh_token')?.value || 'undefined'
    
    
        const decoded =  jwt.verify(token, JWT_SECRET) as JwtPayload
        const userId = decoded._id
        if (token) {
            (await cookies()).set({
            name: 'access_token',
            value: "deleted",
            httpOnly: true,
            secure: true,
            path:'/',
            maxAge: 0,
            sameSite: "lax",
            }
        )
    }
        if (refresh_token) {
            (await cookies()).set({
            name: 'refresh_token',
            value: "deleted",
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 0,
            sameSite: "lax"
        })
        }
        
        db.collection('refresh_tokens').updateMany({userId: userId}, {$set: { revoked: true}})
        
        if (!refresh_token) {
            return Response.json('No token found', {status:404})
        }
    
        return Response.json({message:'Logout Successful'}, {status:200})
    } catch (error) {
        console.error(error)
        return Response.json({error: 'Internal Server Error'}, {status:500})
    }
}