import { Task } from '@/lib/type';
import { TaskSchema, TaskArraySchema, CreateTaskSchema } from '@/lib/schema';
import { z } from 'zod';
import { Alert } from 'react-native';
import axios from 'axios';

// URL de tu API en Firebase Cloud Workstations
const API_URL = 'https://3000-firebase-tasklist-1763407189113.cluster-hlmk2l2htragyudeyf6f3tzsi6.cloudworkstations.dev/tasks';

// Configurar instancia de axios
const api = axios.create({
  baseURL: 'https://3000-firebase-tasklist-1763407189113.cluster-hlmk2l2htragyudeyf6f3tzsi6.cloudworkstations.dev',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Obtener todas las tareas
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get('/tasks');
    const validatedData = TaskArraySchema.parse(response.data);
    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Error de validación:', error.errors);
      Alert.alert('Error', 'Datos inválidos del servidor');
    } else if (axios.isAxiosError(error)) {
      console.error('Error de Axios:', error.message);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
    return [];
  }
};

// Crear nueva tarea
export const createTask = async (title: string, description: string): Promise<boolean> => {
  try {
    // Validar antes de enviar
    const taskData = CreateTaskSchema.parse({
      title,
      description,
      completed: false,
      userId: 1,
    });

    const response = await api.post('/tasks', taskData);
    TaskSchema.parse(response.data);
    Alert.alert('Éxito', 'Tarea creada correctamente');
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      Alert.alert('Error de validación', error.errors[0].message);
    } else if (axios.isAxiosError(error)) {
      Alert.alert('Error', 'No se pudo crear la tarea');
    }
    return false;
  }
};

// Actualizar tarea
export const updateTask = async (task: Task, title: string, description: string): Promise<boolean> => {
  try {
    const updatedData = {
      ...task,
      title,
      description,
    };

    // Validar antes de enviar
    TaskSchema.parse(updatedData);

    const response = await api.put(`/tasks/${task.id}`, updatedData);
    TaskSchema.parse(response.data);
    Alert.alert('Éxito', 'Tarea actualizada correctamente');
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      Alert.alert('Error de validación', error.errors[0].message);
    } else if (axios.isAxiosError(error)) {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
    return false;
  }
};

// Alternar completado
export const toggleTaskCompleted = async (task: Task): Promise<boolean> => {
  try {
    const updatedTask = { ...task, completed: !task.completed };
    await api.put(`/tasks/${task.id}`, updatedTask);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
    return false;
  }
};

// Eliminar tarea
export const deleteTask = async (id: string, callback: () => void): Promise<void> => {
  try {
    await api.delete(`/tasks/${id}`);
    Alert.alert('Éxito', 'Tarea eliminada correctamente');
    callback();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      Alert.alert('Error', 'No se pudo eliminar la tarea');
    }
  }
};
