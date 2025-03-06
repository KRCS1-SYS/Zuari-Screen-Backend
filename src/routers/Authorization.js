const express = require("express");
const routerV1 = new express.Router();
const userAuth = require("../controllers/Authorization");
const machineController = require('../controllers/MachineConfig');
const qualityParams = require('../controllers/QualityParams');
const transactionalLogs = require('../controllers/TransactionalLogs');

//user auth
routerV1.get("/user",userAuth.userDetails);
routerV1.patch("/user",userAuth.updateUser);
routerV1.delete("/user",userAuth.deleteUser);

//machine
routerV1.get('/machine', machineController.getAllMachines);
routerV1.post('/machine', machineController.addMachine);
routerV1.patch('/machine/:id', machineController.updateMachine);
routerV1.delete('/machine/:id', machineController.deleteMachine);

//Create Quality Params
routerV1.get('/query', qualityParams.getAllQualityParams);
routerV1.post('/query', qualityParams.createQualityParams);
routerV1.patch('/query/:id', qualityParams.updateQualityParam);
routerV1.delete('/query/:id', qualityParams.deleteQualityParam);
routerV1.patch('/query/rollback/:id', qualityParams.rollbackQualityParam);

//logs
routerV1.get('/logs', transactionalLogs.getAllTransactionalLogs);

module.exports = routerV1;