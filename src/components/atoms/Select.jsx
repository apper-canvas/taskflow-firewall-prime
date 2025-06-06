import React from 'react'

      const Select = ({ className = '', ...props }) => {
        return (
          <select
            className={`px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white ${className}`}
            {...props}
          />
        )
      }

      export default Select