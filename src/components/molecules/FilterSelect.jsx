import React from 'react'
      import Select from '@/components/atoms/Select'

      const FilterSelect = ({ label, value, onChange, options }) => {
        return (
          <Select
            value={value}
            onChange={onChange}
            className="px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600"
          >
            <option value="all">{label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        )
      }

      export default FilterSelect