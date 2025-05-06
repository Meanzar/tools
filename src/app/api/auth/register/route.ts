import clientPromise from "@/lib/mongodb"
import { UserInputSchema, UserSchema } from "@/models/schema"
import { NextRequest } from "next/server"
import bcrypt from 'bcrypt'
export async function POST(request: NextRequest) {
    const client = await clientPromise
    const body = await request.json()
    const db =  client.db("tools")

    const existingUser = await db.collection('users').findOne({ email: body.email });

    if (existingUser) {
    return Response.json({ message: "Email already registered" }, { status: 409 });
    }

    const passwordEncrypt = await bcrypt.hash(body.password, 10)
    const parsedBody = UserInputSchema.parse({email : body.email, password: passwordEncrypt, createdAt: new Date()})

    const userToInsert = UserSchema.parse({
        ...parsedBody,
        createdAt: new Date()
    })
    const result = await db.collection('users').insertOne(userToInsert)

    return Response.json({insertedId: (await result).insertedId}, {status: 201})
}