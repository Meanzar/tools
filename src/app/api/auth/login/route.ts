import clientPromise from "@/lib/mongodb";
import { UserInputSchema } from "@/models/schema";
import { NextRequest } from "next/server";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request: NextRequest) {
    // creer un token si la connexion réussis
    // 

    const body = await request.json()
    const parsedBody = UserInputSchema.parse(body)
    const client = await clientPromise

    const db = await client.db('tools')

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
        JWT_SECRET,
        {expiresIn : "7d"}
    );

    return Response.json({message: 'login succesfull', token}, {status:200})

}