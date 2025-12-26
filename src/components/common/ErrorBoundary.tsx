import React, { Component, ReactNode } from 'react';
import ErrorDialog from '../common/ErrorDialog';
import { openConfirmDialogAtom } from '../../context/confirmDialogStore';
import { store } from '../../context/store';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleCallService = (): void => {
    // Use the Jotai store to open the confirm dialog
    // TODO: proper service call hook in the future
  };

  handleCloseError = (): void => {
    this.setState({
      hasError: false,
      errorMessage: '',
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <>
          {this.props.children}
          <ErrorDialog
            isOpen={this.state.hasError}
            errorMessage={this.state.errorMessage}
            onCallService={this.handleCallService}
            onClose={this.handleCloseError}
          />
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
