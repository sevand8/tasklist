import React, { useState, useEffect } from 'react';
import {View,FlatList,TouchableOpacity,Text,ActivityIndicator,StatusBar} from 'react-native';
import "@/global.css";
import { Task } from '@/lib/type';
import {fetchTasks,createTask as apiCreateTask,updateTask as apiUpdateTask,toggleTaskCompleted,deleteTask as apiDeleteTask} from '@/lib/api';
import EmptyState from '@/components/TaskAdd';
import TaskCard from '@/components/TaskContext';
import TaskModal from '@/components/TaskForm';
import { NotebookPen } from 'lucide-react-native';

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const data = await fetchTasks();
    setTasks(data);
    setLoading(false);
  };

  const handleCreateTask = async () => {
    const success = await apiCreateTask(title, description);
    if (success) {
      setTitle('');
      setDescription('');
      setModalVisible(false);
      loadTasks();
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    
    const success = await apiUpdateTask(editingTask, title, description);
    if (success) {
      setTitle('');
      setDescription('');
      setEditingTask(null);
      setModalVisible(false);
      loadTasks();
    }
  };

  const handleToggleCompleted = async (task: Task) => {
    await toggleTaskCompleted(task);
    loadTasks();
  };

  const handleDeleteTask = (id: string) => {
    apiDeleteTask(id, loadTasks);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTitle('');
    setDescription('');
    setEditingTask(null);
  };

  

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#EFF6FF" />
      

      {/* Lista */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Cargando tareas...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={handleToggleCompleted}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
            />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListEmptyComponent={<EmptyState />}
        />
      )}

      {/* Botón flotante */}
      <TouchableOpacity 
      onPress={openCreateModal}
      activeOpacity={0.8}
     className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-gray-500 
     active:bg-blue-600 justify-center items-center shadow-2xl z-50 elevation-8">
    <Text className="text-white text-4xl font-light">
      <NotebookPen color="white" size={25} />
    </Text>
</TouchableOpacity>

      {/* Modal */}
      <TaskModal
        visible={modalVisible}
        isEditing={!!editingTask}
        title={title}
        description={description}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onCancel={closeModal}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
      />
    </View>
  );
}