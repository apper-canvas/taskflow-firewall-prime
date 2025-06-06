import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { projectService } from '@/services/api/projectService'
import Header from '@/components/organisms/Header'
import Sidebar from '@/components/organisms/Sidebar'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Spinner from '@/components/atoms/Spinner'
import ApperIcon from '@/components/ApperIcon'
import { motion, AnimatePresence } from 'framer-motion'

const ProjectPage = ({ darkMode, toggleDarkMode }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    projectName: '',
    status: 'Active',
    startDate: '',
    endDate: '',
    progress: 0
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const result = await projectService.getAll()
      setProjects(result || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreate = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData)
      setProjects(prev => [newProject, ...prev])
      toast.success('Project created successfully!')
    } catch (err) {
      toast.error('Failed to create project')
    }
  }

  const handleProjectUpdate = async (id, data) => {
    try {
      const updatedProject = await projectService.update(id, data)
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      toast.success('Project updated successfully!')
    } catch (err) {
      toast.error('Failed to update project')
    }
  }

  const handleProjectDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return
    }
    
    try {
      await projectService.delete(id)
      setProjects(prev => prev.filter(project => project.id !== id))
      toast.success('Project deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete project')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      projectName: '',
      status: 'Active',
      startDate: '',
      endDate: '',
      progress: 0
    })
    setEditingProject(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.projectName.trim()) return

    const projectData = {
      name: formData.name,
      projectName: formData.projectName,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate,
      progress: parseInt(formData.progress) || 0
    }

    if (editingProject) {
      await handleProjectUpdate(editingProject.id, projectData)
    } else {
      await handleProjectCreate(projectData)
    }

    resetForm()
  }

  const handleEditProject = (project) => {
    setFormData({
      name: project.name,
      projectName: project.projectName,
      status: project.status,
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      progress: project.progress
    })
    setEditingProject(project)
    setShowForm(true)
  }

  const filteredProjects = projects.filter(project => {
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !project.projectName.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (filterStatus !== 'all' && project.status !== filterStatus) return false
    return true
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Inactive': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Complete': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

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
            tasks={[]} // Empty tasks for project page
            categories={[]} // Empty categories for project page
            selectedCategory="all"
            setSelectedCategory={() => {}}
            showArchived={false}
            setShowArchived={() => {}}
          />

          <div className="lg:col-span-3">
            {/* Header and Filters */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Projects</h1>
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  <ApperIcon name={showForm ? "X" : "Plus"} size={16} />
                  <span>{showForm ? 'Cancel' : 'Create Project'}</span>
                </Button>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-4 mb-4">
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-auto"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Complete">Complete</option>
                </Select>
              </div>

              {/* Create/Edit Form */}
              <AnimatePresence>
                {showForm && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4 mb-6 overflow-hidden border-t pt-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        placeholder="Project name..."
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Project display name..."
                        value={formData.projectName}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Complete">Complete</option>
                      </Select>
                      
                      <Input
                        type="date"
                        placeholder="Start date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                      
                      <Input
                        type="date"
                        placeholder="End date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>

                    <Input
                      type="number"
                      placeholder="Progress (0-100)"
                      value={formData.progress}
                      onChange={(e) => setFormData(prev => ({ ...prev, progress: e.target.value }))}
                      min="0"
                      max="100"
                    />

                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark font-medium"
                      >
                        {editingProject ? 'Update Project' : 'Create Project'}
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
            </div>

            {/* Projects Table */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft overflow-hidden">
              {filteredProjects?.length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="GitBranch" size={48} className="mx-auto text-surface-300 dark:text-surface-600 mb-4" />
                  <h3 className="text-lg font-medium text-surface-500 dark:text-surface-400 mb-2">
                    No projects yet
                  </h3>
                  <p className="text-surface-400 dark:text-surface-500">
                    Create your first project to get started
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-50 dark:bg-surface-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                          End Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-200 dark:divide-surface-600">
                      {filteredProjects?.map(project => (
                        <tr key={project.id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-surface-900 dark:text-white">
                                {project.projectName}
                              </div>
                              <div className="text-sm text-surface-500 dark:text-surface-400">
                                {project.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-surface-300">
                            {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-surface-300">
                            {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-surface-200 dark:bg-surface-600 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${project.progress || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-surface-700 dark:text-surface-300">
                                {project.progress || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleEditProject(project)}
                                className="text-primary hover:text-primary-dark"
                              >
                                <ApperIcon name="Edit" size={16} />
                              </Button>
                              <Button
                                onClick={() => handleProjectDelete(project.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <ApperIcon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectPage