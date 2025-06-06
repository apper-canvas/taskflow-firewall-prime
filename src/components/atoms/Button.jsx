import React from 'react'

      const Button = ({ children, className = '', ...props }) => {
        return (
          <button
            className={`transition-colors duration-200 ${className}`}
            {...props}
          >
            {children}
          </button>
        )
      }

      export default Button