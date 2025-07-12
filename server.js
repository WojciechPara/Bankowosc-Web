const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 5000;

// Konfiguracja Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Bankowość Elektroniczna',
      version: '1.0.0',
      description: 'API dla aplikacji bankowej - wersja webowa',
      contact: {
        name: 'Student',
        email: 'student@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serwer deweloperski'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            imie: { type: 'string' },
            nazwisko: { type: 'string' },
            ulica: { type: 'string' },
            kodPocztowyMiasto: { type: 'string' },
            email: { type: 'string' },
            numerTelefonu: { type: 'string' },
            login: { type: 'string' },
            numerRachunku: { type: 'string' },
            stanKonta: { type: 'number' }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            dataTransakcji: { type: 'string' },
            kwota: { type: 'number' },
            odbiorca: { type: 'string' },
            numer: { type: 'string' },
            typ: { type: 'string' }
          }
        },
        Card: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            numerKarty: { type: 'string' },
            typ: { type: 'string' },
            dataWaznosci: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Inicjalizacja bazy danych
const db = new sqlite3.Database('./bank.db', (err) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err.message);
    } else {
        console.log('Połączono z bazą danych SQLite.');
        initDatabase();
    }
});

// Inicjalizacja tabel
function initDatabase() {
    // Tabela użytkowników
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        imie TEXT NOT NULL,
        nazwisko TEXT NOT NULL,
        ulica TEXT NOT NULL,
        kodPocztowyMiasto TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        numerTelefonu TEXT NOT NULL,
        login TEXT UNIQUE NOT NULL,
        haslo TEXT NOT NULL,
        numerRachunku TEXT UNIQUE NOT NULL,
        stanKonta REAL DEFAULT 0
    )`);

    // Tabela transakcji
    db.run(`CREATE TABLE IF NOT EXISTS transakcje (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        dataTransakcji TEXT NOT NULL,
        kwota REAL NOT NULL,
        odbiorca TEXT NOT NULL,
        numer TEXT NOT NULL,
        typ TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id)
    )`);

    // Tabela kart
    db.run(`CREATE TABLE IF NOT EXISTS karty (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        numerKarty TEXT NOT NULL,
        typ TEXT NOT NULL,
        dataWaznosci TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id)
    )`);
}

// Generowanie numeru rachunku
function generateAccountNumber() {
    const random = Math.floor(Math.random() * 90000000) + 10000000;
    return `24999999999999999${random}`;
}

// API Endpoints

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Rejestracja nowego użytkownika
 *     description: Tworzy nowe konto użytkownika w systemie bankowym
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imie
 *               - nazwisko
 *               - ulica
 *               - kodPocztowyMiasto
 *               - email
 *               - numerTelefonu
 *               - login
 *               - haslo
 *             properties:
 *               imie:
 *                 type: string
 *                 description: Imię użytkownika
 *               nazwisko:
 *                 type: string
 *                 description: Nazwisko użytkownika
 *               ulica:
 *                 type: string
 *                 description: Adres ulicy
 *               kodPocztowyMiasto:
 *                 type: string
 *                 description: Kod pocztowy i miasto
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adres email użytkownika
 *               numerTelefonu:
 *                 type: string
 *                 description: Numer telefonu
 *               login:
 *                 type: string
 *                 description: Login użytkownika
 *               haslo:
 *                 type: string
 *                 description: Hasło użytkownika
 *               stanKonta:
 *                 type: number
 *                 default: 0
 *                 description: Początkowy stan konta
 *     responses:
 *       200:
 *         description: Konto zostało pomyślnie utworzone
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: integer
 *                 numerRachunku:
 *                   type: string
 *       400:
 *         description: Błąd walidacji - login lub email już istnieje
 *       500:
 *         description: Błąd serwera
 */
// Rejestracja nowego użytkownika
app.post('/api/register', async (req, res) => {
    const { imie, nazwisko, ulica, kodPocztowyMiasto, email, numerTelefonu, login, haslo, stanKonta } = req.body;
    
    try {
        // Sprawdź czy login już istnieje
        db.get("SELECT id FROM users WHERE login = ?", [login], (err, row) => {
            if (row) {
                return res.status(400).json({ error: 'Login już istnieje' });
            }
            
            // Sprawdź czy email już istnieje
            db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
                if (row) {
                    return res.status(400).json({ error: 'Email już istnieje' });
                }
                
                const hashedPassword = bcrypt.hashSync(haslo, 10);
                const numerRachunku = generateAccountNumber();
                
                db.run(`INSERT INTO users (imie, nazwisko, ulica, kodPocztowyMiasto, email, numerTelefonu, login, haslo, numerRachunku, stanKonta) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [imie, nazwisko, ulica, kodPocztowyMiasto, email, numerTelefonu, login, hashedPassword, numerRachunku, stanKonta],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Błąd podczas tworzenia konta' });
                        }
                        // Dodaj automatycznie kartę debetową
                        const userId = this.lastID;
                        const numerKarty = Array(4).fill(0).map(() => Math.floor(1000 + Math.random() * 9000)).join(' ');
                        const dataWaznosci = (() => {
                          const d = new Date();
                          d.setFullYear(d.getFullYear() + 4);
                          return d.toISOString().split('T')[0];
                        })();
                        db.run(`INSERT INTO karty (userId, numerKarty, typ, dataWaznosci) VALUES (?, ?, ?, ?)`,
                          [userId, numerKarty, 'Debetowa', dataWaznosci], function(err) {
                            if (err) {
                              return res.status(500).json({ error: 'Błąd podczas tworzenia karty' });
                            }
                            res.json({ 
                                message: 'Konto zostało pomyślnie utworzone',
                                userId: userId,
                                numerRachunku: numerRachunku
                            });
                        });
                    });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Logowanie użytkownika
 *     description: Uwierzytelnia użytkownika na podstawie loginu i hasła
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - haslo
 *             properties:
 *               login:
 *                 type: string
 *                 description: Login użytkownika
 *               haslo:
 *                 type: string
 *                 description: Hasło użytkownika
 *     responses:
 *       200:
 *         description: Logowanie udane
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Nieprawidłowe dane logowania
 *       500:
 *         description: Błąd serwera
 */
// Logowanie
app.post('/api/login', (req, res) => {
    const { login, haslo } = req.body;
    
    db.get("SELECT * FROM users WHERE login = ?", [login], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
        }
        
        const isValidPassword = bcrypt.compareSync(haslo, user.haslo);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
        }
        
        // Usuń hasło z odpowiedzi
        const { haslo: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    });
});

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Pobierz dane użytkownika
 *     description: Zwraca dane użytkownika na podstawie ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Dane użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Użytkownik nie znaleziony
 *       500:
 *         description: Błąd serwera
 */
// Pobierz dane użytkownika
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    
    db.get("SELECT id, imie, nazwisko, ulica, kodPocztowyMiasto, email, numerTelefonu, login, numerRachunku, stanKonta FROM users WHERE id = ?", 
        [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        
        if (!user) {
            return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }
        
        res.json({ user });
    });
});

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Aktualizuj dane użytkownika
 *     description: Aktualizuje dane użytkownika na podstawie ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nazwisko:
 *                 type: string
 *                 description: Nowe nazwisko
 *               ulica:
 *                 type: string
 *                 description: Nowy adres ulicy
 *               kodPocztowyMiasto:
 *                 type: string
 *                 description: Nowy kod pocztowy i miasto
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nowy adres email
 *               numerTelefonu:
 *                 type: string
 *                 description: Nowy numer telefonu
 *     responses:
 *       200:
 *         description: Dane zostały zaktualizowane
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Błąd podczas aktualizacji danych
 */
// Aktualizuj dane użytkownika
app.put('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    const { nazwisko, ulica, kodPocztowyMiasto, email, numerTelefonu } = req.body;
    
    db.run(`UPDATE users SET nazwisko = ?, ulica = ?, kodPocztowyMiasto = ?, email = ?, numerTelefonu = ? WHERE id = ?`,
        [nazwisko, ulica, kodPocztowyMiasto, email, numerTelefonu, userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Błąd podczas aktualizacji danych' });
            }
            
            res.json({ message: 'Dane zostały zaktualizowane' });
        });
});

/**
 * @swagger
 * /api/transfer:
 *   post:
 *     summary: Wykonaj przelew
 *     description: Wykonuje przelew z konta użytkownika
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - kwota
 *               - odbiorca
 *               - numerRachunkuOdbiorcy
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID użytkownika wykonującego przelew
 *               kwota:
 *                 type: number
 *                 description: Kwota przelewu
 *               odbiorca:
 *                 type: string
 *                 description: Nazwa odbiorcy
 *               numerRachunkuOdbiorcy:
 *                 type: string
 *                 description: Numer rachunku odbiorcy
 *     responses:
 *       200:
 *         description: Przelew został wykonany pomyślnie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 nowyStanKonta:
 *                   type: number
 *       400:
 *         description: Nie posiadasz wystarczających środków na koncie
 *       404:
 *         description: Użytkownik nie znaleziony
 *       500:
 *         description: Błąd podczas wykonywania przelewu
 */
// Wykonaj przelew
app.post('/api/transfer', (req, res) => {
    const { userId, kwota, odbiorca, numerRachunkuOdbiorcy } = req.body;
    
    // Sprawdź czy użytkownik ma wystarczające środki
    db.get("SELECT stanKonta FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        
        if (!user) {
            return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }
        
        if (user.stanKonta < kwota) {
            return res.status(400).json({ error: 'Nie posiadasz wystarczających środków na koncie' });
        }
        
        const dataTransakcji = new Date().toISOString().split('T')[0];
        
        // Dodaj transakcję
        db.run(`INSERT INTO transakcje (userId, dataTransakcji, kwota, odbiorca, numer, typ) VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, dataTransakcji, kwota, odbiorca, numerRachunkuOdbiorcy, 'przelew'],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Błąd podczas wykonywania przelewu' });
                }
                
                // Zaktualizuj stan konta
                db.run("UPDATE users SET stanKonta = stanKonta - ? WHERE id = ?", [kwota, userId],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Błąd podczas aktualizacji stanu konta' });
                        }
                        
                        res.json({ 
                            message: 'Przelew został wykonany pomyślnie',
                            nowyStanKonta: user.stanKonta - kwota
                        });
                    });
            });
    });
});

/**
 * @swagger
 * /api/phone-recharge:
 *   post:
 *     summary: Doładowanie telefonu
 *     description: Wykonuje doładowanie telefonu z konta użytkownika
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - kwota
 *               - odbiorca
 *               - numerTelefonu
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID użytkownika
 *               kwota:
 *                 type: number
 *                 description: Kwota doładowania
 *               odbiorca:
 *                 type: string
 *                 description: Operator telefonii komórkowej
 *               numerTelefonu:
 *                 type: string
 *                 description: Numer telefonu do doładowania
 *     responses:
 *       200:
 *         description: Telefon został doładowany pomyślnie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 nowyStanKonta:
 *                   type: number
 *       400:
 *         description: Nie posiadasz wystarczających środków na koncie
 *       404:
 *         description: Użytkownik nie znaleziony
 *       500:
 *         description: Błąd podczas doładowania telefonu
 */
// Doładowanie telefonu
app.post('/api/phone-recharge', (req, res) => {
    const { userId, kwota, odbiorca, numerTelefonu } = req.body;
    
    // Sprawdź czy użytkownik ma wystarczające środki
    db.get("SELECT stanKonta FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        
        if (!user) {
            return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }
        
        if (user.stanKonta < kwota) {
            return res.status(400).json({ error: 'Nie posiadasz wystarczających środków na koncie' });
        }
        
        const dataTransakcji = new Date().toISOString().split('T')[0];
        
        // Dodaj transakcję
        db.run(`INSERT INTO transakcje (userId, dataTransakcji, kwota, odbiorca, numer, typ) VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, dataTransakcji, kwota, odbiorca, numerTelefonu, 'doładowanie'],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Błąd podczas doładowania telefonu' });
                }
                
                // Zaktualizuj stan konta
                db.run("UPDATE users SET stanKonta = stanKonta - ? WHERE id = ?", [kwota, userId],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Błąd podczas aktualizacji stanu konta' });
                        }
                        
                        res.json({ 
                            message: 'Telefon został doładowany pomyślnie',
                            nowyStanKonta: user.stanKonta - kwota
                        });
                    });
            });
    });
});

/**
 * @swagger
 * /api/transactions/{userId}:
 *   get:
 *     summary: Pobierz historię transakcji
 *     description: Zwraca historię wszystkich transakcji użytkownika
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Lista transakcji użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Błąd serwera
 */
// Pobierz historię transakcji
app.get('/api/transactions/:userId', (req, res) => {
    const userId = req.params.userId;
    
    db.all("SELECT * FROM transakcje WHERE userId = ? ORDER BY dataTransakcji DESC", [userId], (err, transactions) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        
        res.json({ transactions });
    });
});

/**
 * @swagger
 * /api/cards/{userId}:
 *   get:
 *     summary: Pobierz karty użytkownika
 *     description: Zwraca listę wszystkich kart użytkownika
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Lista kart użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Card'
 *       500:
 *         description: Błąd serwera
 */
// Pobierz karty użytkownika
app.get('/api/cards/:userId', (req, res) => {
    const userId = req.params.userId;
    
    db.all("SELECT * FROM karty WHERE userId = ?", [userId], (err, cards) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        
        res.json({ cards });
    });
});

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Wyślij wiadomość kontaktową
 *     description: Wysyła wiadomość kontaktową do banku
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - wiadomosc
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID użytkownika wysyłającego wiadomość
 *               wiadomosc:
 *                 type: string
 *                 description: Treść wiadomości
 *     responses:
 *       200:
 *         description: Wiadomość została wysłana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 */
// Wysyłanie wiadomości kontaktowej
app.post('/api/contact', (req, res) => {
    const { userId, wiadomosc } = req.body;
    
    // W rzeczywistej aplikacji tutaj byłaby logika wysyłania emaila
    res.json({ 
        message: 'Wiadomość została wysłana. Kopia została przesłana na adres email.',
        success: true
    });
});

// Serwuj React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
}); 