import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ tasks, categories, onTaskCreate, onTaskUpdate, onTaskDelete, showArchived }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: ''
  })

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
      completed: false,
      archived: false,
      createdAt: new Date().toISOString()
    }

    if (editingTask) {
      await onTaskUpdate(editingTask.id, taskData)
    } else {
      await onTaskCreate(taskData)
    }

    resetForm()
  }

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
    })
    setEditingTask(task)
    setShowForm(true)
  }

  const handleToggleComplete = async (task) => {
    await onTaskUpdate(task.id, { ...task, completed: !task.completed })
  }

  const handleArchive = async (task) => {
    await onTaskUpdate(task.id, { ...task, archived: !task.archived })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-950'
      case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-950'
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-950'
      default: return 'text-surface-500 bg-surface-50 dark:bg-surface-800'
    }
  }

  const getCategoryColor = (categoryName) => {
    const category = categories?.find(c => c.name === categoryName)
    return category?.color || '#6366f1'
  }

  const formatDueDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM dd')
  }

  const isDueSoon = (dateString) => {
    if (!dateString) return false
    const date = new Date(dateString)
    return isPast(date) || isToday(date)
  }

  return (
    <div className="space-y-6">
      {/* Task Creation Form */}
      <motion.div
        layout
        className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
            {showArchived ? 'Archived Tasks' : 'Tasks'}
          </h2>
          {!showArchived && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ApperIcon name={showForm ? "X" : "Plus"} size={16} />
              <span>{showForm ? 'Cancel' : 'Add Task'}</span>
            </button>
          )}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4 mb-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Task title..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white"
                  />
                </div>
              </div>

              <textarea
                placeholder="Task description (optional)..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white resize-none"
                rows="3"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white"
                  required
                >
                  <option value="">Select category</option>
                  {categories?.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>

                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-300 dark:hover:bg-surface-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Task List */}
        <div className="space-y-3">
          {tasks?.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="CheckSquare" size={48} className="mx-auto text-surface-300 dark:text-surface-600 mb-4" />
              <h3 className="text-lg font-medium text-surface-500 dark:text-surface-400 mb-2">
                {showArchived ? 'No archived tasks' : 'No tasks yet'}
              </h3>
              <p className="text-surface-400 dark:text-surface-500">
                {showArchived ? 'Complete some tasks to see them here' : 'Create your first task to get started'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {tasks?.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`group bg-surface-50 dark:bg-surface-700 rounded-xl p-4 hover:shadow-card transition-all duration-200 border border-surface-100 dark:border-surface-600 ${
                    task.priority === 'high' ? 'hover:priority-glow-high' : 
                    task.priority === 'medium' ? 'hover:priority-glow-medium' : 
                    'hover:priority-glow-low'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'bg-secondary border-secondary text-white' 
                          : 'border-surface-300 dark:border-surface-500 hover:border-secondary'
                      }`}
                    >
                      {task.completed && <ApperIcon name="Check" size={12} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            task.completed 
                              ? 'line-through text-surface-400 dark:text-surface-500' 
                              : 'text-surface-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!showArchived && (
                            <button
                              onClick={() => handleEdit(task)}
                              className="p-2 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              <ApperIcon name="Edit" size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleArchive(task)}
                            className="p-2 text-surface-400 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                          >
                            <ApperIcon name={showArchived ? "RotateCcw" : "Archive"} size={14} />
                          </button>
                          <button
                            onClick={() => onTaskDelete(task.id)}
                            className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mt-3">
                        {task.category && (
                          <span
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: getCategoryColor(task.category) }}
                          >
                            {task.category}
                          </span>
                        )}

                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>

                        {task.dueDate && (
                          <span className={`text-xs ${
                            isDueSoon(task.dueDate) && !task.completed
                              ? 'text-red-500 font-medium'
                              : 'text-surface-500 dark:text-surface-400'
                          }`}>
                            {formatDueDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default MainFeature