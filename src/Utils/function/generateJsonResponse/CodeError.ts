export type CodeError =
  | CriticalError
  | TemporaryError
  | ValidationError
  | AuthenticationError
  | FilesError;

type CriticalError = 'A000';
type TemporaryError = 'B000';
type ValidationError =
  | 'C000'
  | 'C001'
  | 'C002'
  | 'C003'
  | 'C004'
  | 'C005'
  | 'C006'
  | 'C007'
  | 'C008';
type AuthenticationError = 'D000';
type FilesError = 'E000' | 'E001' | 'E002' | 'E003';

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
  { code: 'C005', message: 'Taka rozmowa nie istnieje' },
  {
    code: 'C006',
    message: 'Osiągnięto maksymalną ilość zarezerwowanych rozmów',
  },
  { code: 'C007', message: 'Nie znaleziono takiego kursanta' },
  {
    code: 'C008',
    message: 'Rozmowa z tym kursantem została już zarezerwowana',
  },

  // D -> Błędy przy autentykacji i autoryzacji
  { code: 'D000', message: 'Nie znaleziono takiego użytkownika' },

  // E -> Błędy przy obsłudze plików
  { code: 'E000', message: 'Nie wysłano pliku, lub był w złym formacie' },
  {
    code: 'E001',
    message: 'Nieznany błąd, ale udało się usunąć otrzymany plik',
  },
  {
    code: 'E002',
    message:
      'Nieznany błąd i nie udało się usunąć pliku, albo określonego pliku już brak',
  },
  { code: 'E003', message: 'Nie udało się usunąć pliku na końcu zapytania' },
];
