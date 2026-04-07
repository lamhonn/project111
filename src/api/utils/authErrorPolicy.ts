const TABLET_STATUS_NON_RECOVERABLE_CODES = new Set(['UNAUTHENTICATED']);

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
  void operationName;
  void errorCode;
  return false;
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
    return /unauthenticated|unauthorized|token.*expired|jwt.*expired/i.test(error.message);
  }

  return false;
};

export const getGraphqlErrorCodeFromExtensions = (extensions?: Record<string, unknown>): string | null => {
  return getGraphqlErrorCode({ extensions });
};

export const isUnauthorizedGraphqlCode = (errorCode: string | null): boolean => {
  return errorCode === 'UNAUTHENTICATED';
};

type MutationResponseLike = {
  code?: string | null;
  success?: boolean;
  message?: string | null;
};

export const isUnauthorizedMutationResponse = (response: MutationResponseLike | null | undefined): boolean => {
  if (!response || response.success === true) {
    return false;
  }

  if (response.code === '401') {
    return true;
  }

  const message = typeof response.message === 'string' ? response.message : '';
  return /unauthenticated|unauthorized|token.*expired|jwt.*expired/i.test(message);
};
