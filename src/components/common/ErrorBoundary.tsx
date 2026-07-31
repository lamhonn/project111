import React, { Component, ReactNode } from 'react';
import ErrorDialog from '../common/ErrorDialog';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleCloseError = (): void => {
    this.setState({
      hasError: false,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <>
          {this.props.children}
          <ErrorDialog
            isOpen={this.state.hasError}
            onClose={this.handleCloseError}
          />
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
