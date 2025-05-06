import { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";



export async function GET(
  request: NextRequest,
   {params} : { params: Promise<{ id: string; rushId: string }>} 
) {
  const client = await clientPromise;
  const db = client.db("tools");

  const userId = (await params).id
  const rushId = (await params).rushId

  if (!ObjectId.isValid(rushId) || !ObjectId.isValid(userId)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  // 1. Get the rush document
  const rush = await db.collection("rushs").findOne({
    _id: new ObjectId(rushId),
    userId: new ObjectId(userId),
  });

  if (!rush) {
    return new Response(JSON.stringify({ error: "Rush not found" }), { status: 404 });
  }

  // 2. Convert taskIds to ObjectId[]
  const taskObjectIds = (rush.taskIds || []).map((id: string) => new ObjectId(id));

  // 3. Get the corresponding tasks
  const tasks = await db
    .collection("tasks")
    .find({ _id: { $in: taskObjectIds } })
    .toArray();

  return new Response(JSON.stringify(tasks), { status: 200 });
}
