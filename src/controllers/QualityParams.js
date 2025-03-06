const QualityParams = require('../model/QualityParams');
const TransactionalLogs = require('../model/TransactionalLogs');

exports.createQualityParams = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            tag_name,
            counter_reading,
            calculated_quantity_quintal,
            last_approved_quantity,
            qa_approved_quantity,
            calculated_quality_last_reading_time,
            qa_approved_quality_last_approved_time,
        } = req.body;

        if (
            !tag_name ||
            counter_reading === undefined ||
            calculated_quantity_quintal === undefined ||
            last_approved_quantity === undefined ||
            qa_approved_quantity === undefined ||
            !calculated_quality_last_reading_time ||
            !qa_approved_quality_last_approved_time
        ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const qualityParam = await QualityParams.create({
            tag_name,
            counter_reading,
            calculated_quantity_quintal,
            last_approved_quantity,
            qa_approved_quantity,
            calculated_quality_last_reading_time,
            qa_approved_quality_last_approved_time,
            approved_by:userId,
            created_by: userId,
            updated_by: userId
        });

        await TransactionalLogs.create({
            action: 'CREATE',
            table_name: 'quality_params',
            record_id: qualityParam.id,
            previous_data: JSON.stringify({}),
            new_data: JSON.stringify(qualityParam.toJSON()),
            performed_by: userId
        });

        res.status(201).json({ message: 'Quality parameter created successfully', qualityParam });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

exports.getAllQualityParams = async (req, res) => {
    try {
        const qualityParams = await QualityParams.findAll();
        res.json(qualityParams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getQualityParamById = async (req, res) => {
    try {
        const qualityParam = await QualityParams.findByPk(req.params.id);
        if (!qualityParam) {
            return res.status(404).json({ error: 'Quality parameter not found' });
        }
        res.json(qualityParam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateQualityParam = async (req, res) => {
    try {
        const qualityParam = await QualityParams.findByPk(req.params.id);
        if (!qualityParam) {
            return res.status(404).json({ error: 'Quality parameter not found' });
        }

        const userId = req.user.id;
        const previous_data = qualityParam.toJSON();

        let updatedFields = { ...req.body, updated_by: userId };

        // Logic to add the previous value of calculated_quantity_quintal
        if (req.body.calculated_quantity_quintal !== undefined) {
            const newQuantity = qualityParam.calculated_quantity_quintal + req.body.calculated_quantity_quintal;

            // Ensure the sum does not exceed counter_reading
            updatedFields.calculated_quantity_quintal = Math.min(newQuantity, req.body.counter_reading || qualityParam.counter_reading);
        }

        await qualityParam.update(updatedFields);

        const new_data = qualityParam.toJSON();

        await TransactionalLogs.create({
            action: 'UPDATE',
            table_name: 'quality_params',
            record_id: qualityParam.id,
            previous_data: JSON.stringify(previous_data),
            new_data: JSON.stringify(new_data),
            performed_by: userId
        });

        res.json({ message: 'Quality parameter updated successfully', qualityParam });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

exports.deleteQualityParam = async (req, res) => {
    try {
        const qualityParam = await QualityParams.findByPk(req.params.id);
        if (!qualityParam) {
            return res.status(404).json({ error: 'Quality parameter not found' });
        }

        const userId = req.user.id;

        const previous_data = qualityParam.toJSON();

        await qualityParam.destroy();
        await TransactionalLogs.create({
            action: 'DELETE',
            table_name: 'quality_params',
            record_id: qualityParam.id,
            previous_data: JSON.stringify(previous_data),
            new_data: JSON.stringify({}), 
            performed_by: userId
        });

        res.json({ message: 'Quality parameter deleted successfully', deleted_by: userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.rollbackQualityParam = async (req, res) => {
    try {
        const { id } = req.params; 
        const userId = req.user.id;

        
        const lastTransaction = await TransactionalLogs.findOne({
            where: {
                record_id: id,
                action: 'UPDATE'
            },
            order: [['created_at', 'DESC']]
        });

        if (!lastTransaction) {
            return res.status(404).json({ error: 'No update history found for rollback' });
        }

        
        const previousData = JSON.parse(lastTransaction.previous_data);

        
        const qualityParam = await QualityParams.findByPk(id);
        if (!qualityParam) {
            return res.status(404).json({ error: 'Quality parameter not found' });
        }

       
        await qualityParam.update({
            ...previousData,
            updated_by: userId
        });

       
        await TransactionalLogs.create({
            action: 'ROLLBACK',
            table_name: 'quality_params',
            record_id: id,
            previous_data: JSON.stringify(qualityParam.toJSON()), 
            new_data: JSON.stringify(previousData), 
            performed_by: userId
        });

        res.json({ message: 'Rollback successful', rolledBackData: previousData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
