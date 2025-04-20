import React from 'react'

const LoadingComponent = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
  </div>
  )
}

export default LoadingComponent