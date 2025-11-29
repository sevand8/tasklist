import React from 'react';
import { View, Text } from 'react-native';
import { NotepadText, Info, NotebookPen } from 'lucide-react-native';
import "@/global.css";

export default function EmptyState() {
  return (
    <View className="items-center justify-center pt-32">
      <View className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full items-center justify-center mb-6">
        <Text className="text-5xl"><NotepadText size={80} color="black" /></Text>
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-2">
      <Info size={17} color="black" /> Sin tareas aún
      </Text>
      <Text className="text-base text-gray-500 text-center px-8">
      <Info size={11} color="gray"/> Comienza tu día creando tu primera tarea
      </Text>
      <Text className="text-sm text-gray-400 mt-4">
        Toca el botón <NotebookPen color="gray" size={10} /> para agregar
      </Text>
    </View>
  );
}