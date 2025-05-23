import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"
import  jwt, { JwtPayload } from "jsonwebtoken"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "default secret"
const REFRESH_SECRET = process.env.REFRESH_SECRET || "default secret"

export async function GET() {
try {
        const client = await clientPromise
        const db = client.db('tools')
        const token = (await cookies()).get('access_token')?.value || 'undefined'
    
        try {
            const decodedAT =  jwt.verify(token, JWT_SECRET) as JwtPayload
            const data = {
                userId: decodedAT._id.toString(), 
                email: decodedAT.email,
                isConnected: true,
            }

            return Response.json(data, {status:200})

        } catch {
            const refresh_token =  (await cookies()).get('refresh_token')?.value || 'undefined'
            const decodedRT = jwt.verify(refresh_token, REFRESH_SECRET) as JwtPayload
            const userId = decodedRT._id
            console.log(userId)
            const results = await db.collection('refresh_tokens').findOne({userId: new  ObjectId(decodedRT._id),revoked: false})


            if (!results) {
                return Response.json({error: "Result is undefinedSession expired"}, {status:401})
            }

            if (results) {
                try {
                    const user = await db.collection('users').findOne({_id: results.userId})

                    if (user) {
                    const token = jwt.sign(
                        {
                            _id: user._id.toString(),
                            email: user.email,
                        },
                        JWT_SECRET!,
                        {expiresIn : "15min"}
                    );
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
                        const data = {
                            userId: user._id.toString(),
                            email: user.email,
                            isConnected: true
                        }

                        return Response.json(data, {status:200})
                    }
                } catch (error) {
                        console.error(error)
                        return Response.json({error: 'Session expired'}, {status:401})
                    }
            }
        } 
    } catch (error) {
        console.error(error)
        return Response.json({error: 'Internal Server Error'}, {status:500})
    }
 
}