
const Machine = require('../model/MachineConfig');

exports.getAllMachines = async (req, res) => {
    try {
        const machines = await Machine.findAll();
        res.json(machines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMachineById = async (req, res) => {
    try {
        const machine = await Machine.findByPk(req.params.id);
        if (machine) {
            res.json(machine);
        } else {
            res.status(404).json({ error: 'Machine not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addMachine = async (req, res) => {
    try {
        const userId = req.user.id; 

        const machine = await Machine.create({
            ...req.body,
            createdBy: userId 
        });

        res.status(201).json(machine);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};


exports.updateMachine = async (req, res) => {
    try {
        const machine = await Machine.findByPk(req.params.id);
        if (machine) {
            const userId = req.user.id; 

            await machine.update({
                ...req.body,
                updatedBy: userId 
            });

            res.json(machine);
        } else {
            res.status(404).json({ error: 'Machine not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};


exports.deleteMachine = async (req, res) => {
    try {
        const machine = await Machine.findByPk(req.params.id);
        if (machine) {
            const userId = req.user.id; 
            await machine.update({ deletedBy: userId });

            await machine.destroy(); 

            res.json({ message: 'Machine deleted successfully', deletedBy: userId });
        } else {
            res.status(404).json({ error: 'Machine not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
