import * as React from 'react'

class ErrorBoundary extends React.Component {
  state = {
    error: null,
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      console.log(this.state.error)
      return (
        <>
          <h1>Something went wrong!</h1>
          <p>
            <pre>{this.state.error.stack ?? this.state.error.message}</pre>
          </p>
        </>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
