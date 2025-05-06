import clientPromise from '@/lib/mongodb'
import { RushInputSchema } from '@/models/schema';
import { ObjectId } from 'mongodb'
import {NextRequest} from 'next/server'

export async function GET(request: NextRequest, props: { params: Promise<{id: string}> }) {
    const params = await props.params;
    const userId = params.id
    const client = await clientPromise
    const db = client.db("tools")

    const pomodores = await db
      .collection("rushs")
      .find({ userId: new ObjectId(userId) })
      .toArray()
  
    return Response.json(pomodores)
  }
export async function POST(request: NextRequest, props: {params: Promise<{id: string}>}) {
    const params = await props.params;
    const body = await request.json()
    const parsed = RushInputSchema.parse(body)
    const userId = params.id
    const client = await clientPromise
    const db = client.db('tools')
    const rushToInsert = {
        isRush: parsed.isRush,
        loops: parsed.loops,
        taskIds: parsed.taskIds,
        userId: new ObjectId(userId),
        createdAt: new Date()
    }
    const results = db
        .collection('rushs')
        .insertOne(rushToInsert)    
    return Response.json({insertedId: (await results).insertedId}, {status: 201})
}

export async function DELETE(request: NextRequest) {
    const body = await request.json()
    const id = new ObjectId(body.id)
    const client = await clientPromise
    const db = client.db('tools')
    const results = db.collection('rushs').deleteOne({_id:  id})

    return Response.json({results})
}