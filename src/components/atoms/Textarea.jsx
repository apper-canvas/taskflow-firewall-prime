import React from 'react'

      const Textarea = ({ className = '', ...props }) => {
        return (
          <textarea
            className={`w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white resize-none ${className}`}
            {...props}
          />
        )
      }

      export default Textarea