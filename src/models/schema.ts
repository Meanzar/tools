import { ObjectId } from "mongodb"
import { z } from "zod"

export const TaskInputSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()),
  status: z.enum(["todo", "doing", "done"]).optional(),
})

export const TaskSchema = TaskInputSchema.extend({
  _id: z.instanceof(ObjectId),
  userId: z.instanceof(ObjectId).optional(),
  createdAt: z.date(),
})

export type Task = z.infer<typeof TaskSchema>
export type TaskInput = z.infer<typeof TaskInputSchema>



export const PomodoreInputSchema = z.object({
  isRush: z.boolean(),
  loops: z.number(),
})

export const PomodoroSessionSchema = PomodoreInputSchema.extend({
  userId: z.instanceof(ObjectId),
  createdAt: z.date()
})

export type PomodoreSession = z.infer<typeof PomodoroSessionSchema>

export const RushInputSchema = z.object({
  isRush: z.boolean(),
  loops: z.number(),
  taskIds: z.array(
    z.string()
      .refine((val) => ObjectId.isValid(val), {message: "Invalid ObjectId"}))
      .transform((val) => val.map((id) => new ObjectId(id))),
})

export const RushSchema = RushInputSchema.extend({
  userId: z.instanceof(ObjectId),
  createdAt: z.date(),
  completedTask: z.instanceof(ObjectId).array().optional(),
  startedAt: z.date().optional(),
  endedAt: z.date().optional(),
  
})

export type Rush = z.infer<typeof RushSchema>

export const UserInputSchema = z.object({
  email: z.string().email({message: "invalid email adress"}),
  name: z.string().optional(),
  password: z.string()
})

export const UserSchema = UserInputSchema.extend({
  createdAt: z.date().optional()
})
export type User = z.infer<typeof UserSchema>

export const  TokenSchema = z.object({
  token: z.string()
})
