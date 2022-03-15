import React, { useCallback } from 'react';
import ErrorBoundary, {
  RenderErrorComponent,
  HandleCatchErrorFn,
} from './ErrorBoundary';
// import { sendErrorReport } from '@shared/utils/error-report';
import { AlertErrorView } from './AlertErrorView';
import { reportError } from '@/utils/error';

interface WebErrorBoundaryProps {
  renderError?: RenderErrorComponent;
}
export const WebErrorBoundary: React.FC<WebErrorBoundaryProps> = React.memo(
  (props) => {
    const { renderError = AlertErrorView } = props;

    const handleCatchError: HandleCatchErrorFn = useCallback((error: any, info: any) => {
      console.warn('捕获错误, 等待发送错误报告\n', error, info);
      // sendErrorReport({
      //   message: String(error),
      //   stack: String(info.componentStack),
      //   version: config.version,
      // });
      reportError(error);
    }, []);

    return (
      <ErrorBoundary onCatchError={handleCatchError} renderError={renderError}>
        {props.children}
      </ErrorBoundary>
    );
  }
);
WebErrorBoundary.displayName = 'WebErrorBoundary';
