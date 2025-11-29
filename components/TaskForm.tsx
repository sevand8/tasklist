import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,Modal,KeyboardAvoidingView,Platform,ScrollView} from 'react-native';
import { z } from 'zod';
import { CreateTaskSchema } from '@/lib/schema';
import { CircleX, Ban, Check, Scroll, RefreshCcw  } from 'lucide-react-native';
import "@/global.css";

interface TaskModalProps {
  visible: boolean;
  isEditing: boolean;
  title: string;
  description: string;
  onTitleChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function TaskModal({
  visible,
  isEditing,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onCancel,
  onSave
}: TaskModalProps) {
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const handleSave = () => {
    try {
      CreateTaskSchema.parse({
        title,
        description,
        completed: false,
        userId: 1,
      });
      
      setErrors({});
      onSave();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { title?: string; description?: string } = {};
        error.errors.forEach(err => {
          const field = err.path[0] as 'title' | 'description';
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-black/60 justify-end"
      >
        <View className="bg-white rounded-t-3xl p-6 pb-10 shadow-2xl">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-800">
              {isEditing ? <><RefreshCcw width={25} /> Actualizar Tarea</> :  <><Scroll width={25} /> Nueva Tarea</>}
            </Text>
            <TouchableOpacity onPress={onCancel} activeOpacity={0.7}>
              <Text className="text-3xl text-gray-400"><CircleX color="red" /></Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">- Título </Text>
              <TextInput
                className={`border-2 rounded-xl p-4 text-base bg-gray-50 ${
                  errors.title ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="Título de tu tarea..."
                value={title}
                onChangeText={onTitleChange}
                placeholderTextColor="#999"
              />
              {errors.title && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.title}</Text>
              )}
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">- Descripción </Text>
              <TextInput
                className={`border-2 rounded-xl p-4 text-base bg-gray-50 h-32 ${
                  errors.description ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="Describe los detalles de tu tarea..."
                value={description}
                onChangeText={onDescriptionChange}
                multiline
                numberOfLines={5}
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
              {errors.description && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.description}</Text>
              )}
            </View>

            <View className="flex-row gap-3">
              {/* BOTÓN CANCELAR - ROJO */}
              <TouchableOpacity
                className="flex-1 p-4 rounded-xl items-center bg-gray-500 active:bg-red-600"
                onPress={onCancel}
                activeOpacity={0.8}
              >
                <Text className="text-white text-base font-bold">
                <Ban /> 
                </Text>
              </TouchableOpacity>

              {/* BOTÓN CREAR/ACTUALIZAR - AZUL */}
              <TouchableOpacity
                className="flex-1 p-4 rounded-xl items-center bg-gray-500 active:bg-green-600 shadow-lg"
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text className="text-white text-base font-bold">
                  {isEditing ? <Check /> : <Check />}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

