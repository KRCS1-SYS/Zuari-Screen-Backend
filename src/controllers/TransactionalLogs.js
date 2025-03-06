const TransactionalLogs = require('../model/TransactionalLogs');
const User = require('../model/UserAuth'); 
const QualityParams = require('../model/QualityParams'); 

exports.getAllTransactionalLogs = async (req, res) => {
    try {
        
        const logs = await TransactionalLogs.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['fullName'] 
                }
            ],
            order: [['created_at', 'DESC']]
        });

       
        const transformedLogs = await Promise.all(logs.map(async (log) => {
            let recordDetails = {};

           
            if (log.table_name === 'quality_params') {
                const record = await QualityParams.findByPk(log.record_id, {
                    attributes: ['tag_name'] 
                });
                recordDetails = record ? { tag_name: record.tag_name } : {};
            }

            return {
                id: log.id,
                action: log.action,
                table_name: log.table_name,
                record_details: recordDetails,
                previous_data: log.previous_data,
                new_data: log.new_data,
                performed_by: log.user ? log.user.name : 'Unknown',
                created_at: log.created_at
            };
        }));

        res.json(transformedLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
