import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import { taskService } from '../services/api/taskService'
import { categoryService } from '../services/api/categoryService'

const Home = ({ darkMode, toggleDarkMode }) => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [showArchived, setShowArchived] = useState(false)

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckSquare" size={18} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-surface-900 dark:text-white">TaskFlow</h1>
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-white w-64"
                />
              </div>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
              >
                <ApperIcon name={darkMode ? "Sun" : "Moon"} size={18} className="text-surface-700 dark:text-surface-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Categories</h2>
              
              <div className="space-y-2 mb-6">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                  }`}
                >
                  <span>All Tasks</span>
                  <span className="text-sm">{tasks.filter(t => !t.archived).length}</span>
                </button>
                
                {categories?.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedCategory === category.name 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-sm">{tasks.filter(t => t.category === category.name && !t.archived).length}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setShowArchived(false)}
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                    !showArchived 
                      ? 'bg-secondary text-white' 
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                  }`}
                >
                  <ApperIcon name="List" size={16} />
                  <span>Active Tasks</span>
                </button>
                
                <button
                  onClick={() => setShowArchived(true)}
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                    showArchived 
                      ? 'bg-secondary text-white' 
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                  }`}
                >
                  <ApperIcon name="Archive" size={16} />
                  <span>Archived</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white"
              >
                <option value="all">All Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <MainFeature
              tasks={filteredTasks}
              categories={categories}
              onTaskCreate={handleTaskCreate}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              showArchived={showArchived}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home