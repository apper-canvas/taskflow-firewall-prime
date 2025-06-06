import React from 'react'
      import { motion } from 'framer-motion'
      import ApperIcon from '@/components/ApperIcon'
      import SearchInput from '@/components/molecules/SearchInput'
      import DarkModeToggle from '@/components/molecules/DarkModeToggle'

      const Header = ({ searchTerm, setSearchTerm, darkMode, toggleDarkMode }) => {
        return (
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
                  <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search tasks..." />
                  <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </div>
              </div>
            </div>
          </header>
        )
      }

      export default Header