export const TABLET_STATUS_OPERATION_NAME = 'GetTabletStatus';

const TABLET_STATUS_NON_FATAL_AUTH_CODES = new Set(['FORBIDDEN']);
const TABLET_STATUS_NON_RECOVERABLE_CODES = new Set(['FORBIDDEN', 'UNAUTHENTICATED']);

const extractGraphqlErrors = (error: unknown): Array<{ extensions?: Record<string, unknown> }> => {
  if (!error || typeof error !== 'object') {
    return [];
  }

  const errorRecord = error as Record<string, unknown>;
  if (Array.isArray(errorRecord.errors)) {
    return errorRecord.errors as Array<{ extensions?: Record<string, unknown> }>;
  }

  if (Array.isArray(errorRecord.graphQLErrors)) {
    return errorRecord.graphQLErrors as Array<{ extensions?: Record<string, unknown> }>;
  }

  return [];
};

const getGraphqlErrorCode = (error: { extensions?: Record<string, unknown> }): string | null => {
  const code = error.extensions?.code;
  return typeof code === 'string' ? code : null;
};

export const isTabletStatusNonFatalAuthError = (
  operationName: string | undefined,
  errorCode: string | null,
): boolean => {
  return operationName === TABLET_STATUS_OPERATION_NAME && !!errorCode && TABLET_STATUS_NON_FATAL_AUTH_CODES.has(errorCode);
};

export const isNonRecoverableTabletStatusError = (error: unknown): boolean => {
  const errors = extractGraphqlErrors(error);
  const hasNonRecoverableCode = errors.some((graphQLError) => {
    const code = getGraphqlErrorCode(graphQLError);
    return !!code && TABLET_STATUS_NON_RECOVERABLE_CODES.has(code);
  });

  if (hasNonRecoverableCode) {
    return true;
  }

  if (error instanceof Error) {
    return /forbidden|unauthenticated/i.test(error.message);
  }

  return false;
};

export const getGraphqlErrorCodeFromExtensions = (extensions?: Record<string, unknown>): string | null => {
  return getGraphqlErrorCode({ extensions });
};
