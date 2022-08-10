export type CodeError =
  | CriticalError
  | TemporaryError
  | ValidationError
  | JwtError;

type CriticalError = 'A000';
type TemporaryError = 'B000';
type ValidationError = 'C000' | 'C001' | 'C002';
type JwtError = 'D000';

export const _allCodeError = [
  // A -> Krytyczne
  { code: 'A000', message: 'Nieznany błąd na serwerze' },

  // B -> Tymczasowe błędy
  { code: 'B000', message: 'Tymczasowo nieobsługiwana ścieżka' },

  // C -> Błędy przy walidacji
  { code: 'C000', message: 'Błędny link do pierwszej rejestracji' },
  { code: 'C001', message: 'Unikalne dane nie mogą się duplikować' },
  { code: 'C002', message: 'Błędne dane w body' },

  // D -> Błędy związane z JWT
  { code: 'D000', message: 'Token nie istnieje' },
];
