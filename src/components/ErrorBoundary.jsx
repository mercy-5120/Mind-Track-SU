import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] A render error occurred:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "2rem auto", fontFamily: "sans-serif" }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page and try again.</p>
          <pre style={{ whiteSpace: "pre-wrap", color: "#b42318", fontSize: "0.875rem" }}>
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
