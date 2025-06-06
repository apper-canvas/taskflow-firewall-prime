import React from 'react'
      import { motion, AnimatePresence } from 'framer-motion'
      import Button from '@/components/atoms/Button'
      import Input from '@/components/atoms/Input'
      import Textarea from '@/components/atoms/Textarea'
      import Select from '@/components/atoms/Select'
      import ApperIcon from '@/components/ApperIcon'

      const TaskForm = ({ 
        showForm, 
        setShowForm, 
        formData, 
        setFormData, 
        categories, 
        editingTask, 
        handleSubmit, 
        resetForm,
        showArchived
      }) => {
        return (
          <motion.div
            layout
            className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                {showArchived ? 'Archived Tasks' : 'Tasks'}
              </h2>
              {!showArchived && (
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  <ApperIcon name={showForm ? "X" : "Plus"} size={16} />
                  <span>{showForm ? 'Cancel' : 'Add Task'}</span>
                </Button>
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
                      <Input
                        type="text"
                        placeholder="Task title..."
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Textarea
                    placeholder="Task description (optional)..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                    >
                      <option value="">Select category</option>
                      {categories?.map(category => (
                        <option key={category.id} value={category.name}>{category.name}>{category.name}</option>
                      ))}
                    </Select>

                    <Select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </Select>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark font-medium"
                    >
                      {editingTask ? 'Update Task' : 'Create Task'}
                    </Button>
                    <Button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-300 dark:hover:bg-surface-500"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )
      }

      export default TaskForm