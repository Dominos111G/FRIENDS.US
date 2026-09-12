import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.resolve('public'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(express.static(path.resolve('public')));
app.get('/', (req, res) => { res.render('index'); });
app.get('/login', (req, res) => { res.render('login'); });
app.get('/account', (req, res) => { res.render('account'); });
app.get('/verify-account', (req, res) => { res.render('verify-account'); });
app.get('/room/chat', (req, res) => { res.render('room/chat'); });
app.get('/room/video', (req, res) => { res.render('room/video'); });

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'], credentials: true },
  transports: ['websocket', 'polling']
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serwer HTTP działa na http://localhost:${PORT}`);
});
