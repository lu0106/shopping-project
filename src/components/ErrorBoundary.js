import React, { Component } from "react";
import ErrorPage from "./ErrorPage";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log((error, errorInfo));
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) return <ErrorPage />;
    return this.props.children;
  }
}

export default ErrorBoundary;
