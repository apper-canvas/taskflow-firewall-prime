import React from 'react'
      import CategoryFilter from '@/components/molecules/CategoryFilter'

      const Sidebar = ({ tasks, categories, selectedCategory, setSelectedCategory, showArchived, setShowArchived }) => {
        return (
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft p-6 sticky top-24">
              <CategoryFilter 
                categories={categories} 
                tasks={tasks} 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory}
                showArchived={showArchived}
                setShowArchived={setShowArchived}
              />
            </div>
          </div>
        )
}

      export default Sidebar