import { JsonCommunicationType } from '../../types/data/JsonCommunicationType';
import { CodeError, _allCodeError } from './CodeError';

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

export const generateErrorResponse = (
  code: CodeError,
): JsonCommunicationType => {
  const text = _allCodeError.filter((value) => value.code === code)[0];
  return {
    success: false,
    typeData: 'status',
    data: { code, message: text.message ?? 'Nieznany błąd' },
  };
};
