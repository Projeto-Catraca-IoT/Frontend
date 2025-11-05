import express from 'express';
import {router as public_routes} from './routes/public.js';
import {router as private_routes} from './routes/private.js'; // <- Confirme o caminho
import dotenv from "dotenv";

dotenv.config()

const app = express();
app.use(express.json());

// Use test route
app.use('/', public_routes);
app.use('/', private_routes);

const SERVER_PORT = process.env.SERVER_PORT || 3000;

app.listen(SERVER_PORT, () => {
  console.log(`The server is running on ${SERVER_PORT}`);
});