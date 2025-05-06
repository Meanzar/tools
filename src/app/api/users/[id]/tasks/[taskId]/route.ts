import clientPromise from "@/lib/mongodb";
import { TaskInputSchema } from "@/models/schema";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest,  props: {params: {taskId: string}}) {
    const taskId =  (props.params.taskId)
    if (!ObjectId.isValid(taskId)) {
        return new Response(JSON.stringify({ error: "Invalid task ID" }), {
          status: 400,
        });
      }
    
    const client = await clientPromise
    const db = client.db("tools")    
    const task = await db
        .collection("tasks")
        .findOne({_id : new ObjectId(taskId)})

    return Response.json(task)
}

export async function PUT(request: NextRequest, props: { params: { taskId: string } }) {
  const taskId = props.params.taskId;

  let body;
  try {
    body = await request.json();
    console.log(body)
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  if (!ObjectId.isValid(taskId)) {
    return new Response(JSON.stringify({ error: "Invalid task ID" }), { status: 400 });
  }

  const TaskPartialSchema = TaskInputSchema.partial();

  const parsed = TaskPartialSchema.parse(body);

  const taskModify = {
    ...parsed,
  };

  const client = await clientPromise;
  const db = client.db("tools");
  const result = await db.collection('tasks').updateOne(
    { _id: new ObjectId(taskId) },
    { $set: taskModify, $currentDate: { lastModified: true } }
  );

  console.log("Mongo result:", result);

  if (result.matchedCount === 0) {
    return new Response(JSON.stringify({ error: "Task not found" }), { status: 404 });
  }

  return Response.json(result);
}