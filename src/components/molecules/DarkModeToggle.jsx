import React from 'react'
      import Button from '@/components/atoms/Button'
      import ApperIcon from '@/components/ApperIcon'

      const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
        return (
          <Button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600"
          >
            <ApperIcon name={darkMode ? "Sun" : "Moon"} size={18} className="text-surface-700 dark:text-surface-300" />
          </Button>
        )
      }

      export default DarkModeToggle