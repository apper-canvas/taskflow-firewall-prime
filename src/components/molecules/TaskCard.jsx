import React from 'react'
      import { motion } from 'framer-motion'
      import { format, isToday, isTomorrow, isPast } from 'date-fns'
      import ApperIcon from '@/components/ApperIcon'
      import Checkbox from '@/components/atoms/Checkbox'
      import Button from '@/components/atoms/Button'

      const TaskCard = ({ task, categories, onToggleComplete, onEdit, onArchive, onDelete, showArchived }) => {

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
          <motion.div
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
              <Checkbox checked={task.completed} onChange={() => onToggleComplete(task)} />

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
                      <Button
                        onClick={() => onEdit(task)}
                        className="p-2 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <ApperIcon name="Edit" size={14} />
                      </Button>
                    )}
                    <Button
                      onClick={() => onArchive(task)}
                      className="p-2 text-surface-400 hover:text-secondary hover:bg-secondary/10 rounded-lg"
                    >
                      <ApperIcon name={showArchived ? "RotateCcw" : "Archive"} size={14} />
                    </Button>
                    <Button
                      onClick={() => onDelete(task.id)}
                      className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
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
        )
      }

      export default TaskCard