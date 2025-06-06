import React from 'react'
      import Input from '@/components/atoms/Input'
      import ApperIcon from '@/components/ApperIcon'

      const SearchInput = ({ searchTerm, setSearchTerm, placeholder = "Search..." }) => {
        return (
          <div className="relative">
            <ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <Input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64"
            />
          </div>
        )
      }

      export default SearchInput