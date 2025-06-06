import React from 'react'
      import { AnimatePresence } from 'framer-motion'
      import ApperIcon from '@/components/ApperIcon'
      import TaskCard from '@/components/molecules/TaskCard'

      const TaskList = ({ tasks, categories, onTaskUpdate, onTaskDelete, onEditTask, showArchived }) => {
        return (
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
                  <TaskCard
                    key={task.id}
                    task={task}
                    categories={categories}
                    onToggleComplete={onTaskUpdate}
                    onEdit={onEditTask}
                    onArchive={onTaskUpdate}
                    onDelete={onTaskDelete}
                    showArchived={showArchived}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        )
      }

      export default TaskList