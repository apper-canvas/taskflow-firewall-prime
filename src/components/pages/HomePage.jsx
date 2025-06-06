import React, { useState, useEffect } from 'react'
      import { toast } from 'react-toastify'
      import { taskService } from '@/services/api/taskService'
      import { categoryService } from '@/services/api/categoryService'
      import Header from '@/components/organisms/Header'
      import Sidebar from '@/components/organisms/Sidebar'
      import TaskForm from '@/components/organisms/TaskForm'
      import TaskList from '@/components/organisms/TaskList'
      import FilterSelect from '@/components/molecules/FilterSelect'
      import Spinner from '@/components/atoms/Spinner'

      const HomePage = ({ darkMode, toggleDarkMode }) => {
        const [tasks, setTasks] = useState([])
        const [categories, setCategories] = useState([])
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState(null)
        const [searchTerm, setSearchTerm] = useState('')
        const [selectedCategory, setSelectedCategory] = useState('all')
        const [filterStatus, setFilterStatus] = useState('all')
        const [filterPriority, setFilterPriority] = useState('all')
        const [showArchived, setShowArchived] = useState(false)
        const [showForm, setShowForm] = useState(false)
        const [editingTask, setEditingTask] = useState(null)
        const [formData, setFormData] = useState({
          title: '',
          description: '',
          category: '',
          priority: 'medium',
          dueDate: ''
        })

        useEffect(() => {
          loadData()
        }, [])

        const loadData = async () => {
          setLoading(true)
          try {
            const [tasksResult, categoriesResult] = await Promise.all([
              taskService.getAll(),
              categoryService.getAll()
            ])
            setTasks(tasksResult || [])
            setCategories(categoriesResult || [])
          } catch (err) {
            setError(err.message)
            toast.error('Failed to load data')
          } finally {
            setLoading(false)
          }
        }

        const handleTaskCreate = async (taskData) => {
          try {
            const newTask = await taskService.create(taskData)
            setTasks(prev => [newTask, ...prev])
            toast.success('Task created successfully!')
          } catch (err) {
            toast.error('Failed to create task')
          }
        }

        const handleTaskUpdate = async (id, data) => {
          try {
            const updatedTask = await taskService.update(id, data)
            setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))
            toast.success('Task updated successfully!')
          } catch (err) {
            toast.error('Failed to update task')
          }
        }

        const handleTaskDelete = async (id) => {
          try {
            await taskService.delete(id)
            setTasks(prev => prev.filter(task => task.id !== id))
            toast.success('Task deleted successfully!')
          } catch (err) {
            toast.error('Failed to delete task')
          }
        }

        const resetForm = () => {
          setFormData({
            title: '',
            description: '',
            category: '',
            priority: 'medium',
            dueDate: ''
          })
          setEditingTask(null)
          setShowForm(false)
        }

        const handleSubmit = async (e) => {
          e.preventDefault()
          if (!formData.title.trim()) return

          const taskData = {
            ...formData,
            completed: editingTask ? editingTask.completed : false, // Preserve completed status on update
            archived: editingTask ? editingTask.archived : false, // Preserve archived status on update
            createdAt: editingTask ? editingTask.createdAt : new Date().toISOString()
          }

          if (editingTask) {
            await handleTaskUpdate(editingTask.id, taskData)
          } else {
            await handleTaskCreate(taskData)
          }

          resetForm()
        }

        const handleEditTask = (task) => {
          setFormData({
            title: task.title,
            description: task.description || '',
            category: task.category,
            priority: task.priority,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
          })
          setEditingTask(task)
          setShowForm(true)
        }

        const filteredTasks = tasks.filter(task => {
          if (showArchived !== task.archived) return false
          if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
              !task.description.toLowerCase().includes(searchTerm.toLowerCase())) return false
          if (selectedCategory !== 'all' && task.category !== selectedCategory) return false
          if (filterStatus === 'completed' && !task.completed) return false
          if (filterStatus === 'pending' && task.completed) return false
          if (filterPriority !== 'all' && task.priority !== filterPriority) return false
          return true
        })

        if (loading) {
          return (
            <div className="min-h-screen flex items-center justify-center">
              <Spinner />
            </div>
          )
        }

        return (
          <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
            <Header 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode} 
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Sidebar
                  tasks={tasks} // Pass all tasks for category counts
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  showArchived={showArchived}
                  setShowArchived={setShowArchived}
                />

                <div className="lg:col-span-3">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <FilterSelect
                      label="All Status"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'completed', label: 'Completed' }
                      ]}
                    />

                    <FilterSelect
                      label="All Priority"
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      options={[
                        { value: 'high', label: 'High Priority' },
                        { value: 'medium', label: 'Medium Priority' },
                        { value: 'low', label: 'Low Priority' }
                      ]}
                    />
                  </div>

                  <TaskForm
                    showForm={showForm}
                    setShowForm={setShowForm}
                    formData={formData}
                    setFormData={setFormData}
                    categories={categories}
                    editingTask={editingTask}
                    handleSubmit={handleSubmit}
                    resetForm={resetForm}
                    showArchived={showArchived}
                  />
                  
                  <TaskList
                    tasks={filteredTasks}
                    categories={categories}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskDelete={handleTaskDelete}
                    onEditTask={handleEditTask}
                    showArchived={showArchived}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      }

      export default HomePage