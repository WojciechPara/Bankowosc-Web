# 🏦 Bankowość Elektroniczna - Aplikacja Webowa

Odwzorowanie aplikacji konsolowej C# w technologiach webowych (Node.js + React + SQLite).

## 📋 Funkcjonalności

- **Rejestracja i logowanie** użytkowników
- **Dashboard** z podsumowaniem konta
- **Mój profil** - wyświetlanie i edycja danych osobowych
- **Transakcje** - przelewy i doładowania telefonu
- **Historia transakcji** - lista wszystkich operacji
- **Karty** - informacje o kartach płatniczych
- **Kredyty** - informacje o kredytach (demo)
- **Lokaty** - oferty lokat terminowych (demo)
- **Kontakt** - formularz wiadomości do banku

## 🛠️ Technologie

### Backend
- **Node.js** - środowisko uruchomieniowe
- **Express.js** - framework webowy
- **SQLite** - baza danych
- **bcryptjs** - hashowanie haseł
- **CORS** - obsługa cross-origin requests

### Frontend
- **React** - biblioteka UI
- **React Router** - routing
- **Bootstrap** - framework CSS
- **Axios** - komunikacja z API

## 🚀 Instalacja i uruchomienie

### Wymagania
- Node.js (wersja 14 lub nowsza)
- npm lub yarn

### Krok 1: Instalacja zależności backendu
```bash
cd "Bankowość-Web"
npm install
```

### Krok 2: Instalacja zależności frontendu
```bash
cd client
npm install
```

### Krok 3: Uruchomienie aplikacji

#### Opcja A: Uruchomienie w trybie deweloperskim
```bash
# Terminal 1 - Backend
cd "Bankowość-Web"
npm run dev

# Terminal 2 - Frontend
cd "Bankowość-Web/client"
npm start
```

#### Opcja B: Uruchomienie produkcyjne
```bash
# Budowanie frontendu
cd "Bankowość-Web/client"
npm run build

# Uruchomienie serwera
cd "Bankowość-Web"
npm start
```

## 🌐 Dostęp do aplikacji

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👤 Dane testowe

Aplikacja zawiera przykładowe konto:
- **Login**: jan
- **Hasło**: test123

## 📁 Struktura projektu

```
Bankowość-Web/
├── server.js              # Serwer Express + API
├── package.json           # Zależności backendu
├── bank.db               # Baza danych SQLite (tworzona automatycznie)
├── client/               # Aplikacja React
│   ├── src/
│   │   ├── components/   # Komponenty React
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Profile.js
│   │   │   ├── Transfers.js
│   │   │   ├── History.js
│   │   │   ├── Cards.js
│   │   │   ├── Credits.js
│   │   │   ├── Deposits.js
│   │   │   ├── Contact.js
│   │   │   └── Navigation.js
│   │   ├── App.js        # Główny komponent
│   │   └── App.css       # Style
│   └── package.json      # Zależności frontendu
└── README.md
```

## 🔧 API Endpoints

### Użytkownicy
- `POST /api/register` - Rejestracja nowego użytkownika
- `POST /api/login` - Logowanie
- `GET /api/user/:id` - Pobieranie danych użytkownika
- `PUT /api/user/:id` - Aktualizacja danych użytkownika

### Transakcje
- `POST /api/transfer` - Wykonanie przelewu
- `POST /api/phone-recharge` - Doładowanie telefonu
- `GET /api/transactions/:userId` - Historia transakcji

### Karty
- `GET /api/cards/:userId` - Pobieranie kart użytkownika

### Kontakt
- `POST /api/contact` - Wysyłanie wiadomości

## 🗄️ Baza danych

Aplikacja automatycznie tworzy bazę SQLite z tabelami:
- `users` - dane użytkowników
- `transakcje` - historia transakcji
- `karty` - karty płatnicze

## 🔒 Bezpieczeństwo

- Hasła są hashowane za pomocą bcryptjs
- Walidacja danych po stronie serwera
- CORS skonfigurowany dla bezpieczeństwa

## 📱 Responsywność

Aplikacja jest w pełni responsywna i działa na urządzeniach mobilnych.

## 🐛 Rozwiązywanie problemów

### Problem z portami
Jeśli porty 3000 lub 5000 są zajęte, zmień je w:
- Backend: `server.js` (linia 12)
- Frontend: `client/package.json` (proxy)

### Problem z bazą danych
Jeśli wystąpi błąd z bazą danych, usuń plik `bank.db` - zostanie utworzony ponownie.

## 📄 Licencja

MIT License 