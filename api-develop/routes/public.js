import express from 'express';
import {login as loginController, register as registerController} from '../controllers/auth.js';
import { locationsAll as locationsAllController, locationsInfo as locationsInfoController } from '../services/locations.js';
//Middlewares
import {register} from '../middlewares/register.js'
import {login} from '../middlewares/login.js'

export const router = express.Router();

//Rota para registro
router.post('/auth/register', register, registerController);
//Rota para login
router.post('/auth/login', login, loginController);

//Rota para ver todos os locais
router.get('/locations', locationsAllController);
//Rota para ver todos os locais
router.get('/locations/:id', locationsInfoController);