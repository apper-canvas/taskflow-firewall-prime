import React from 'react'
      import Button from '@/components/atoms/Button'
      import ApperIcon from '@/components/ApperIcon'

      const CategoryFilter = ({ categories, tasks, selectedCategory, setSelectedCategory, showArchived, setShowArchived }) => {
        return (
          <div className="space-y-2">
            <SidebarSection title="Categories">
              <Button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between p-3 rounded-lg ${
                  selectedCategory === 'all' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                }`}
              >
                <span>All Tasks</span>
                <span className="text-sm">{tasks.filter(t => !t.archived).length}</span>
              </Button>
              
              {categories?.map(category => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${
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
                </Button>
              ))}
            </SidebarSection>

            <SidebarSection>
              <Button
                onClick={() => setShowArchived(false)}
                className={`w-full flex items-center space-x-2 p-3 rounded-lg ${
                  !showArchived 
                    ? 'bg-secondary text-white' 
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                }`}
              >
                <ApperIcon name="List" size={16} />
                <span>Active Tasks</span>
              </Button>
              
              <Button
                onClick={() => setShowArchived(true)}
                className={`w-full flex items-center space-x-2 p-3 rounded-lg ${
                  showArchived 
                    ? 'bg-secondary text-white' 
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                }`}
              >
                <ApperIcon name="Archive" size={16} />
                <span>Archived</span>
              </Button>
            </SidebarSection>
          </div>
        )
      }

      const SidebarSection = ({ title, children }) => (
        <div className="space-y-2 mb-6">
          {title && <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">{title}</h2>}
          {children}
        </div>
      )

      export default CategoryFilter