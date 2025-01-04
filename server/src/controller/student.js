const Class = require('../model/class.model');
class UserController {
    async ShowClass(req, res){
        try {
            const AllClass = await Class.find();
            if(!AllClass){
                return res.status(404).json({
                    message: "No Class Found"
                });
            }
            return res.status(200).json({
                success: true,
                data: AllClass,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}
module.exports = new UserController