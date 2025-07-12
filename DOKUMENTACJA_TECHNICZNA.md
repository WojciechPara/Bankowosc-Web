# DOKUMENTACJA TECHNICZNA
## Projekt: Bankowość Elektroniczna - Wersja Webowa

---

## 1. CZEGO DOTYCZY PROJEKT

### 1.1 Opis ogólny
Projekt "Bankowość Elektroniczna" to kompleksowa aplikacja webowa symulująca system bankowy online. Aplikacja umożliwia użytkownikom zarządzanie kontem bankowym poprzez intuicyjny interfejs webowy.

### 1.2 Główne funkcjonalności
- **Rejestracja i logowanie użytkowników** - bezpieczny system uwierzytelniania
- **Zarządzanie profilem** - edycja danych osobowych i kontaktowych
- **Operacje bankowe**:
  - Wykonywanie przelewów między kontami
  - Doładowania telefonów komórkowych
  - Przeglądanie historii transakcji
- **Zarządzanie kartami** - przeglądanie kart debetowych i kredytowych
- **Komunikacja z bankiem** - system wiadomości kontaktowych
- **Dashboard** - podsumowanie stanu konta i najważniejszych informacji

### 1.3 Architektura systemu
Aplikacja wykorzystuje architekturę **client-server** z podziałem na:
- **Frontend** - interfejs użytkownika w React.js
- **Backend** - API REST w Node.js z Express
- **Baza danych** - SQLite do przechowywania danych

---

## 2. WYKORZYSTANE TECHNOLOGIE

### 2.1 Frontend
- **React.js 18.2.0** - biblioteka do budowania interfejsów użytkownika
- **React Router DOM 6.8.0** - routing w aplikacji
- **React Bootstrap 2.7.2** - komponenty UI
- **Bootstrap 5.2.3** - framework CSS
- **Axios 1.3.0** - klient HTTP do komunikacji z API

### 2.2 Backend
- **Node.js** - środowisko uruchomieniowe JavaScript
- **Express.js 4.18.2** - framework webowy
- **SQLite3 5.1.7** - baza danych
- **Bcryptjs 2.4.3** - hashowanie haseł
- **CORS 2.8.5** - obsługa Cross-Origin Resource Sharing
- **UUID 9.0.1** - generowanie unikalnych identyfikatorów

### 2.3 Dokumentacja API
- **Swagger UI Express** - interaktywna dokumentacja API
- **Swagger JSDoc** - parsowanie komentarzy do OpenAPI

### 2.4 Narzędzia deweloperskie
- **Nodemon 3.0.1** - automatyczne restartowanie serwera
- **React Scripts 5.0.1** - narzędzia do budowania aplikacji React

---

## 3. ZRZUTY EKRANU ZE SWAGGERA

### 3.1 Główny interfejs Swagger
[zrzut ekranu - główny interfejs Swagger, pokazujący stronę główną dokumentacji API z listą wszystkich endpointów pogrupowanych według tagów (Authentication, Users, Transactions, Cards, Contact)]

### 3.2 Sekcja Authentication - Rejestracja
[zrzut ekranu - endpoint /api/register, pokazujący dokumentację rejestracji użytkownika z przykładowym request body zawierającym wszystkie wymagane pola (imie, nazwisko, ulica, kodPocztowyMiasto, email, numerTelefonu, login, haslo)]

### 3.3 Sekcja Authentication - Logowanie
[zrzut ekranu - endpoint /api/login, pokazujący dokumentację logowania z przykładowym request body zawierającym login i hasło]

### 3.4 Sekcja Users - Pobieranie danych użytkownika
[zrzut ekranu - endpoint GET /api/user/{id}, pokazujący dokumentację pobierania danych użytkownika z parametrem path id]

### 3.5 Sekcja Users - Aktualizacja danych użytkownika
[zrzut ekranu - endpoint PUT /api/user/{id}, pokazujący dokumentację aktualizacji danych użytkownika z przykładowym request body]

### 3.6 Sekcja Transactions - Wykonanie przelewu
[zrzut ekranu - endpoint POST /api/transfer, pokazujący dokumentację wykonywania przelewu z przykładowym request body zawierającym userId, kwota, odbiorca, numerRachunkuOdbiorcy]

### 3.7 Sekcja Transactions - Doładowanie telefonu
[zrzut ekranu - endpoint POST /api/phone-recharge, pokazujący dokumentację doładowania telefonu z przykładowym request body]

### 3.8 Sekcja Transactions - Historia transakcji
[zrzut ekranu - endpoint GET /api/transactions/{userId}, pokazujący dokumentację pobierania historii transakcji użytkownika]

### 3.9 Sekcja Cards - Karty użytkownika
[zrzut ekranu - endpoint GET /api/cards/{userId}, pokazujący dokumentację pobierania kart użytkownika]

### 3.10 Sekcja Contact - Wiadomość kontaktowa
[zrzut ekranu - endpoint POST /api/contact, pokazujący dokumentację wysyłania wiadomości kontaktowej z przykładowym request body]

### 3.11 Schematy danych
[zrzut ekranu - sekcja Schemas, pokazująca definicje modeli User, Transaction i Card z opisem wszystkich pól]

### 3.12 Testowanie endpointu
[zrzut ekranu - przykład testowania endpointu /api/login w interfejsie Swagger, pokazujący wypełniony formularz z danymi testowymi i przycisk "Try it out"]

---

## 4. DIAGRAM BAZY DANYCH

### 4.1 Struktura tabel

```
erDiagram
    USERS {
        int id PK
        string imie
        string nazwisko
        string ulica
        string kodPocztowyMiasto
        string email UK
        string numerTelefonu
        string login UK
        string haslo
        string numerRachunku UK
        real stanKonta
    }
    
    TRANSAKCJE {
        int id PK
        int userId FK
        string dataTransakcji
        real kwota
        string odbiorca
        string numer
        string typ
    }
    
    KARTY {
        int id PK
        int userId FK
        string numerKarty
        string typ
        string dataWaznosci
    }
    
    USERS ||--o{ TRANSAKCJE : "wykonuje"
    USERS ||--o{ KARTY : "posiada"
```

### 4.2 Opis tabel

#### Tabela `users`
- **id** - klucz główny, auto-increment
- **imie, nazwisko** - dane osobowe użytkownika
- **ulica, kodPocztowyMiasto** - adres zamieszkania
- **email** - adres email (unikalny)
- **numerTelefonu** - numer telefonu kontaktowego
- **login** - nazwa użytkownika (unikalna)
- **haslo** - zahashowane hasło użytkownika
- **numerRachunku** - numer rachunku bankowego (unikalny)
- **stanKonta** - aktualny stan konta w złotych

#### Tabela `transakcje`
- **id** - klucz główny, auto-increment
- **userId** - klucz obcy do tabeli users
- **dataTransakcji** - data wykonania transakcji
- **kwota** - kwota transakcji
- **odbiorca** - nazwa odbiorcy
- **numer** - numer rachunku/telefonu odbiorcy
- **typ** - typ transakcji (przelew/doładowanie)

#### Tabela `karty`
- **id** - klucz główny, auto-increment
- **userId** - klucz obcy do tabeli users
- **numerKarty** - numer karty bankowej
- **typ** - typ karty (Debetowa/Kredytowa)
- **dataWaznosci** - data ważności karty

### 4.3 Relacje
- **users → transakcje** (1:N) - jeden użytkownik może mieć wiele transakcji
- **users → karty** (1:N) - jeden użytkownik może mieć wiele kart

### 4.4 Ograniczenia
- **UNIQUE** na email, login, numerRachunku w tabeli users
- **FOREIGN KEY** na userId w tabelach transakcje i karty
- **NOT NULL** na wszystkie wymagane pola

---

## 5. INSTALACJA I URUCHOMIENIE

### 5.1 Wymagania systemowe
- Node.js (wersja 14 lub nowsza)
- npm (Node Package Manager)

### 5.2 Instalacja zależności
```bash
# Instalacja zależności backendu
cd "Bankowość-Web"
npm install

# Instalacja zależności frontendu
cd client
npm install
```

### 5.3 Uruchomienie aplikacji
```bash
# Uruchomienie backendu (port 5000)
cd "Bankowość-Web"
npm run dev

# Uruchomienie frontendu (port 3000)
cd client
npm start
```

### 5.4 Dostęp do aplikacji
- **Aplikacja webowa:** http://localhost:3000
- **Dokumentacja API:** http://localhost:5000/api-docs

---

## 6. BEZPIECZEŃSTWO

### 6.1 Hashowanie haseł
- Wykorzystanie biblioteki bcryptjs
- Salt rounds: 10
- Bezpieczne przechowywanie haseł w bazie danych

### 6.2 Walidacja danych
- Sprawdzanie unikalności loginu i emaila
- Walidacja formatu danych wejściowych
- Zabezpieczenie przed SQL injection

### 6.3 CORS
- Konfiguracja Cross-Origin Resource Sharing
- Bezpieczna komunikacja między frontendem a backendem

---

## 7. ROZWIJANIE PROJEKTU

### 7.1 Możliwe rozszerzenia
- Implementacja JWT dla lepszego zarządzania sesjami
- Dodanie systemu powiadomień
- Integracja z systemami płatności
- Dodanie funkcji kredytów i lokat
- Implementacja systemu roli użytkowników

### 7.2 Optymalizacje
- Dodanie cache'owania
- Optymalizacja zapytań do bazy danych
- Implementacja rate limiting
- Dodanie logowania i monitoringu

---

## 8. ENDPOINTY API

### 8.1 Authentication
- **POST /api/register** - rejestracja nowego użytkownika
- **POST /api/login** - logowanie użytkownika

### 8.2 Users
- **GET /api/user/:id** - pobieranie danych użytkownika
- **PUT /api/user/:id** - aktualizacja danych użytkownika

### 8.3 Transactions
- **POST /api/transfer** - wykonanie przelewu
- **POST /api/phone-recharge** - doładowanie telefonu
- **GET /api/transactions/:userId** - historia transakcji

### 8.4 Cards
- **GET /api/cards/:userId** - karty użytkownika

### 8.5 Contact
- **POST /api/contact** - wysłanie wiadomości kontaktowej

---

## 9. DOKUMENTACJA FRONTENDU - ZRZUTY EKRANU

### 9.1 Ekran logowania
[zrzut ekranu - ekran logowania aplikacji, pokazujący formularz logowania z polami "Login" i "Hasło", przycisk "SHOW/HIDE" w polu hasła, przycisk "Zaloguj się" oraz link "Zarejestruj się" na dole formularza]

**Funkcjonalności:**
- Formularz logowania z walidacją
- Przełącznik widoczności hasła (SHOW/HIDE)
- Przekierowanie do rejestracji
- Obsługa błędów logowania
- Responsywny design

### 9.2 Ekran rejestracji
[zrzut ekranu - ekran rejestracji nowego użytkownika, pokazujący formularz z polami: imię, nazwisko, ulica, kod pocztowy i miasto, email, numer telefonu, login, hasło (z przyciskiem SHOW/HIDE), przycisk "Zarejestruj się"]

**Funkcjonalności:**
- Kompletny formularz rejestracji
- Walidacja wszystkich pól
- Sprawdzanie unikalności loginu i emaila
- Automatyczne generowanie numeru rachunku
- Tworzenie karty debetowej przy rejestracji

### 9.3 Dashboard - Panel główny
[zrzut ekranu - dashboard po zalogowaniu, pokazujący nagłówek z nawigacją, karty z informacjami o stanie konta, numerze rachunku, ostatnich transakcjach oraz szybkie akcje]

**Funkcjonalności:**
- Wyświetlanie stanu konta
- Numer rachunku bankowego
- Ostatnie transakcje (top 5)
- Szybkie akcje (przelew, doładowanie)
- Nawigacja do innych sekcji

### 9.4 Nawigacja - Menu główne
[zrzut ekranu - górny pasek nawigacji z logo banku, menu rozwijane z opcjami: Dashboard, Profil, Przelewy, Historia, Karty, Kredyty, Lokaty, Kontakt, Powiadomienia oraz przycisk wylogowania]

**Funkcjonalności:**
- Responsywne menu nawigacyjne
- Dropdown z opcjami użytkownika
- Wskaźnik aktywnej sekcji
- Przycisk wylogowania
- Logo i branding banku

### 9.5 Profil użytkownika
[zrzut ekranu - sekcja profilu, pokazująca formularz edycji danych osobowych z polami: imię (tylko do odczytu), nazwisko, ulica, kod pocztowy i miasto, email, numer telefonu oraz przycisk "Zapisz zmiany"]

**Funkcjonalności:**
- Edycja danych osobowych
- Walidacja pól formularza
- Ochrona przed zmianą imienia
- Aktualizacja danych w czasie rzeczywistym
- Komunikaty o sukcesie/błędach

### 9.6 Przelewy - Wykonywanie przelewu
[zrzut ekranu - formularz przelewu z polami: kwota, odbiorca, numer rachunku odbiorcy, tytuł przelewu oraz przycisk "Wykonaj przelew", pokazujący również aktualny stan konta]

**Funkcjonalności:**
- Formularz przelewu z walidacją
- Sprawdzanie dostępnych środków
- Walidacja numeru rachunku
- Potwierdzenie transakcji
- Aktualizacja stanu konta po przelewie

### 9.7 Przelewy - Doładowanie telefonu
[zrzut ekranu - formularz doładowania telefonu z polami: kwota doładowania, operator (dropdown), numer telefonu oraz przycisk "Doładuj telefon"]

**Funkcjonalności:**
- Lista operatorów telefonii komórkowej
- Walidacja numeru telefonu
- Sprawdzanie dostępnych środków
- Potwierdzenie doładowania
- Historia doładowań

### 9.8 Historia transakcji
[zrzut ekranu - tabela z historią transakcji, pokazująca kolumny: data, kwota, odbiorca, numer, typ transakcji (przelew/doładowanie), z możliwością filtrowania i sortowania]

**Funkcjonalności:**
- Lista wszystkich transakcji użytkownika
- Sortowanie według daty
- Filtrowanie według typu transakcji
- Paginacja wyników
- Eksport do CSV (opcjonalnie)

### 9.9 Karty bankowe
[zrzut ekranu - sekcja kart, pokazująca karty użytkownika z numerem karty (częściowo ukrytym), typem karty (Debetowa/Kredytowa), datą ważności oraz statusem karty]

**Funkcjonalności:**
- Wyświetlanie wszystkich kart użytkownika
- Ukrywanie pełnego numeru karty
- Informacje o typie i ważności
- Status aktywacji karty
- Możliwość blokowania karty

### 9.10 Kredyty
[zrzut ekranu - sekcja kredytów, pokazująca informacje o dostępnych kredytach, kalkulator kredytowy z polami: kwota, okres, oprocentowanie oraz przycisk "Złóż wniosek"]

**Funkcjonalności:**
- Kalkulator kredytowy
- Różne typy kredytów
- Symulacja rat
- Formularz wniosku kredytowego
- Historia kredytów

### 9.11 Lokaty
[zrzut ekranu - sekcja lokat, pokazująca dostępne lokaty z oprocentowaniem, kalkulator lokat z polami: kwota, okres, oprocentowanie oraz przycisk "Załóż lokatę"]

**Funkcjonalności:**
- Kalkulator lokat
- Różne okresy lokowania
- Symulacja zysków
- Formularz założenia lokaty
- Historia lokat użytkownika

### 9.12 Kontakt
[zrzut ekranu - formularz kontaktowy z polami: temat, wiadomość oraz przycisk "Wyślij wiadomość", pokazujący również dane kontaktowe banku]

**Funkcjonalności:**
- Formularz wiadomości kontaktowej
- Walidacja treści wiadomości
- Automatyczne powiadomienie email
- Dane kontaktowe banku
- Status wysłania wiadomości

### 9.13 Powiadomienia
[zrzut ekranu - panel powiadomień, pokazujący listę powiadomień użytkownika z datą, typem (transakcja, system, promocja) oraz treścią powiadomienia]

**Funkcjonalności:**
- Lista powiadomień użytkownika
- Filtrowanie według typu
- Oznaczanie jako przeczytane
- Usuwanie powiadomień
- Licznik nieprzeczytanych

### 9.14 Responsywność - Widok mobilny
[zrzut ekranu - aplikacja na urządzeniu mobilnym, pokazująca responsywny design z menu hamburger, dostosowane karty i formularze do małego ekranu]

**Funkcjonalności:**
- Responsywny design
- Menu hamburger na mobile
- Dostosowane karty i formularze
- Touch-friendly interfejs
- Optymalizacja dla różnych rozmiarów ekranu

### 9.15 Obsługa błędów
[zrzut ekranu - komunikat błędu, pokazujący czerwony alert z informacją o błędzie (np. "Nieprawidłowe dane logowania" lub "Nie posiadasz wystarczających środków")]

**Funkcjonalności:**
- Komunikaty błędów walidacji
- Alerty o błędach systemowych
- Informacje o sukcesie operacji
- Timeout komunikatów
- Możliwość zamknięcia alertów

### 9.16 Loading states
[zrzut ekranu - stan ładowania, pokazujący spinner podczas wykonywania operacji (np. logowanie, przelew) z tekstem "Ładowanie..."]

**Funkcjonalności:**
- Spinner podczas operacji
- Disabled przyciski podczas ładowania
- Tekst informujący o statusie
- Skeleton loading dla list
- Progress bar dla długich operacji

---

## 10. ARCHITEKTURA FRONTENDU

### 10.1 Struktura komponentów
```
src/
├── components/
│   ├── Login.js          # Komponent logowania
│   ├── Register.js       # Komponent rejestracji
│   ├── Dashboard.js      # Panel główny
│   ├── Navigation.js     # Nawigacja
│   ├── Profile.js        # Profil użytkownika
│   ├── Transfers.js      # Przelewy i doładowania
│   ├── History.js        # Historia transakcji
│   ├── Cards.js          # Karty bankowe
│   ├── Credits.js        # Kredyty
│   ├── Deposits.js       # Lokaty
│   ├── Contact.js        # Kontakt
│   └── Notifications.js  # Powiadomienia
├── App.js                # Główny komponent aplikacji
└── index.js              # Punkt wejścia
```

### 10.2 Routing
- **/** - przekierowanie do logowania lub dashboard
- **/login** - ekran logowania
- **/register** - ekran rejestracji
- **/dashboard** - panel główny
- **/profile** - profil użytkownika
- **/transfers** - przelewy i doładowania
- **/history** - historia transakcji
- **/cards** - karty bankowe
- **/credits** - kredyty
- **/deposits** - lokaty
- **/contact** - kontakt
- **/notifications** - powiadomienia

### 10.3 Zarządzanie stanem
- **useState** - lokalny stan komponentów
- **localStorage** - przechowywanie danych użytkownika
- **Context API** - globalny stan aplikacji (opcjonalnie)

### 10.4 Komunikacja z API
- **Axios** - klient HTTP
- **Proxy** - konfiguracja na localhost:5000
- **Interceptors** - obsługa błędów i tokenów

---

*Dokumentacja została przygotowana dla projektu "Bankowość Elektroniczna" - wersja webowa*
*Data utworzenia: 2025-07-12* 