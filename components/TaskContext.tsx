import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { z } from 'zod';
import { Task } from '@/lib/type';
import { TaskSchema } from '@/lib/schema';
import { CircleCheck, Circle, Pencil, Trash2} from 'lucide-react-native';
import "@/global.css";

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  
  const handleToggle = () => {
    try {
      TaskSchema.parse({
        ...task,
        completed: !task.completed,
      });
      onToggle(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        Alert.alert('Error de validación', error.errors[0].message);
      }
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => onDelete(task.id)
        }
      ]
    );
  };

  return (
    <View className="bg-white rounded-2xl p-5 mb-3 shadow-md border border-gray-100">
      <View className="flex-row items-start">
        <TouchableOpacity 
          className="mr-4 mt-1"
          onPress={handleToggle}
          activeOpacity={0.7}
        >
         <View className="items-center justify-center">
            {task.completed ? (
              <CircleCheck size={28} color="#22C55E"  />
            ) : (
              <Circle size={28} color="#D1D5DB"  />
            )}
          </View>
        </TouchableOpacity>
        
        <View className="flex-1">
          <Text 
            className={`text-lg font-bold mb-2 ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {task.title}
          </Text>
          {task.description ? (
            <Text 
              className={`text-sm leading-5 ${
                task.completed ? 'line-through text-gray-400' : 'text-gray-600'
              }`}
            >
              {task.description}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="flex-row gap-3 mt-4 pt-4 border-t border-gray-100 justify-end">
        <TouchableOpacity 
          onPress={() => onEdit(task)} 
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-gray-500 justify-center items-center">
          <Pencil size={18} color="#98d283" strokeWidth={2} />
        </TouchableOpacity>
  
        <TouchableOpacity 
          onPress={handleDelete} 
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-gray-500 justify-center items-center">
          <Trash2 size={18} color="#cc7771" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}