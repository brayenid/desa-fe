'use client'

// components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen flex items-center justify-center p-8 text-center">
          <h1 className="text-xl uppercase tracking-widest font-bold">
            <span className="text-red-500">500</span>: Something went wrong on the server.
          </h1>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
