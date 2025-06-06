import React from 'react'

      const SidebarSection = ({ title, children }) => (
        <div className="space-y-2 mb-6">
          {title && <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">{title}</h2>}
          {children}
        </div>
      )

      export default SidebarSection