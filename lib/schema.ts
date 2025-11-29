import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'El título es obligatorio').max(100, 'Máximo 100 caracteres'),
  description: z.string().min(1, 'La descripción es obligatoria').max(500, 'Máximo 500 caracteres'),
  completed: z.boolean(),
  userId: z.number().int().positive(),
});

export const CreateTaskSchema = TaskSchema.omit({ id: true });
export const UpdateTaskSchema = TaskSchema.partial().required({ id: true });
export const TaskArraySchema = z.array(TaskSchema);

export type TaskType = z.infer<typeof TaskSchema>;
export type CreateTaskType = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskType = z.infer<typeof UpdateTaskSchema>;
