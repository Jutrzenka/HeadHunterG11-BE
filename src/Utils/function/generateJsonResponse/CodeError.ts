export type CodeError =
  | CriticalError
  | TemporaryError
  | ValidationError
  | AuthenticationError;

type CriticalError = 'A000';
type TemporaryError = 'B000';
type ValidationError = 'C000' | 'C001' | 'C002' | 'C003' | 'C004';
type AuthenticationError = 'D000';

export const _allCodeError = [
  // A -> Krytyczne
  { code: 'A000', message: 'Nieznany błąd na serwerze. Przepraszamy' },

  // B -> Tymczasowe błędy
  { code: 'B000', message: 'Tymczasowo nieobsługiwana ścieżka' },

  // C -> Błędy przy walidacji
  { code: 'C000', message: 'Błędny link do pierwszej rejestracji' },
  { code: 'C001', message: 'Unikalne dane nie mogą się duplikować' },
  { code: 'C002', message: 'Błędne dane w body' },
  { code: 'C003', message: 'Użytkownik z takim loginem już istnieje' },
  { code: 'C004', message: 'Błędne dane w params' },

  // D -> Błędy przy autentykacji i autoryzacji
  { code: 'D000', message: 'Nie znaleziono takiego użytkownika' },
];
