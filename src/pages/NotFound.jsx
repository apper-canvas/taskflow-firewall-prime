import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="text-center">
        <ApperIcon name="FileQuestion" size={64} className="mx-auto text-surface-400 mb-4" />
        <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-2">404</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound