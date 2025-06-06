import React from 'react'
      import ApperIcon from '@/components/ApperIcon'

      const Checkbox = ({ checked, onChange, className = '', ...props }) => {
        return (
          <button
            type="button"
            onClick={onChange}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              checked 
                ? 'bg-secondary border-secondary text-white' 
                : 'border-surface-300 dark:border-surface-500 hover:border-secondary'
            } ${className}`}
            {...props}
          >
            {checked && <ApperIcon name="Check" size={12} />}
          </button>
        )
      }

      export default Checkbox