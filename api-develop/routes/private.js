// private.js
import express from 'express';
import { locations as locationsController } from '../controllers/auth.js';

import { locationsCreate as locationsCreateController, locationsEdit as locationsEditController, locationsDelete as locationsDeleteController } from '../controllers/locations.js';

import { gatesCreate as gatesCreateController, gates as gatesController , gatesEdit as gatesEditController, gatesDelete as gatesDeleteController, gatesMovement as gatesMovementController, gatesInfo as gatesInfoController } from '../controllers/gates.js';

import { historyLocal as historyLocationController, historyGate as historyGateController } from "../controllers/history.js";

import { auth } from '../middlewares/auth.js';

export const router = express.Router();

//Rota para ver locais do usuário logado
router.get('/auth/locations', auth, locationsController);

//Rota para criar local novo
router.post('/locations', auth, locationsCreateController);

//Rota editar locais
router.put('/locations/:id', auth, locationsEditController);

//Rota para deletar locais
router.delete('/locations/:id', auth, locationsDeleteController);

// ---------------------------------------------------------------

//Rotas para criar catraca
router.post('/gates', auth, gatesCreateController);

//Rota para recuperar catraca
router.get('/locations/:id/gates', auth, gatesController);

//Rota para info de catraca específica
router.get('/gates/:id', auth, gatesInfoController);

//Rota para editar catraca
router.put('/gates/:id', auth, gatesEditController);

//Rota para apagar catraca
router.delete('/gates/:id', auth, gatesDeleteController);

//Rota para inserir registro na catraca
router.post('/gates/:id/movement', auth, gatesMovementController);


//-------------------------

//Rota de histórico por local
router.get('/locations/:id/history', auth, historyLocationController);

//Rota de histórico por catraca
router.get('/gates/:id/history', auth, historyGateController);