import clientPromise from '@/lib/mongodb'
import { TaskInputSchema } from '@/models/schema';
import { ObjectId } from 'mongodb'
import {NextRequest} from 'next/server'

export async function GET(request: NextRequest, props: { params: Promise<{id: string}> }) {
    const params = await props.params;
    const userId = params.id
    const client = await clientPromise
    const db = client.db("tools")

    const tasks = await db
      .collection("tasks")
      .find({ userId: new ObjectId(userId) })
      .toArray()
  
    return Response.json(tasks)
  }
export async function POST(request: NextRequest, props: {params: Promise<{id: string}>}) {
    const params = await props.params;
    const body = await request.json()
    const parsed = TaskInputSchema.parse(body)
    const userId = params.id
    const client = await clientPromise
    const db = client.db('tools')

    const taskToInsert = {
        ...parsed,
        status: "todo",
        userId: new ObjectId(userId),
        createdAt: new Date()
    }
    const results = db
        .collection('tasks')
        .insertOne(taskToInsert)    
    return Response.json({insertedId: (await results).insertedId}, {status: 201})
}

export async function DELETE(request: NextRequest) {
    const body = await request.json()
    if (!ObjectId.isValid(body.id)) {
        return new Response(JSON.stringify({ error: 'Invalid ObjectId' }), { status: 400 });
      }
    const id = new ObjectId(body.id);
    const client = await clientPromise
    const db = client.db('tools')
    const results = db.collection('tasks').deleteOne({_id:  id})

    return Response.json({results})
}