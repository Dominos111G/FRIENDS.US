import 'dotenv/config';
import http from 'http';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { Server } from 'socket.io';

import { 
  getUsersCollection, getMessagesCollection, 
  getLoginDetailsCollection, getTokensCollection,
  getReportsCollection
} from './controllers/firebaseController.js';
import { loginUser, registerUser, verifyUser, verifyUserToken } from './controllers/userController.js';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.resolve('public'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,            // Nie zapisuj sesji ponownie, jeśli nic się w niej nie zmieniło
  saveUninitialized: false, // Nie twórz sesji dla niezalogowanych użytkowników (oszczędność miejsca)
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,       // Chroni przed kradzieżą cookie przez skrypty JS w przeglądarce (XSS)
    maxAge: 1000 * 60 * 60 * 24 * 7 // Czas życia sesji (np. 7 dni)
  }
}));

app.use(express.static(path.resolve('public')));
app.get('/', (req, res) => { res.render('index'); });
app.get('/login', (req, res) => { res.render('login'); });
app.get('/account', (req, res) => { res.render('account'); });
app.get('/verify-account', (req, res) => { res.render('verify-account'); });
app.get('/room/chat', (req, res) => { res.render('room/chat'); });
app.get('/room/video', (req, res) => { res.render('room/video'); });
app.get('/tou', (req, res) => { res.render('help/terms-of-use'); });
app.get('/privacy-policy', (req, res) => { res.render('help/privacy-policy'); });
app.get('/cookie-policy', (req, res) => { res.render('help/cookie-policy'); });
app.get('/safety-and-health', (req, res) => { res.render('help/safety-and-health'); });
app.post('/api/user/verifyToken', verifyUserToken);
app.post('/api/user/login', loginUser);
app.post('/api/user/register', registerUser);
app.post('/api/user/verify', verifyUser);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'], credentials: true },
  transports: ['websocket', 'polling']
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serwer HTTP działa na http://localhost:${PORT}`);
});
