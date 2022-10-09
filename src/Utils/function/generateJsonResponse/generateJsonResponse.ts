import { JsonCommunicationType } from '../../types/data/JsonCommunicationType';
import { HttpException } from '@nestjs/common';

export const generateSuccessResponse = (): JsonCommunicationType => {
  return {
    success: true,
    typeData: 'status',
    data: null,
  };
};

export const generateElementResponse = (
  type: 'string' | 'number' | 'boolean' | 'object',
  value: any,
): JsonCommunicationType => {
  return {
    success: true,
    typeData: 'element',
    data: {
      type,
      value,
    },
  };
};

export const generateArrayResponse = (
  elements: number,
  pages: number,
  value: any[],
): JsonCommunicationType => {
  return {
    success: true,
    typeData: 'array',
    data: {
      info: {
        elements,
        pages,
      },
      value,
    },
  };
};

export class RestStandardError extends HttpException {
  constructor(response: string | Record<string, any>, status: number) {
    super(
      {
        success: false,
        message: response,
        data: null,
      },
      status,
    );
  }
}

export const generateErrorResponse = (
  error: Error,
  response: string,
  status: number,
): JsonCommunicationType => {
  if (error instanceof RestStandardError) {
    throw new RestStandardError(response, status);
  }
  console.error(error);
  throw new RestStandardError('Nieznany błąd na serwerze. Przepraszamy', 500);
};
