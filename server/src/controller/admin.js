const User = require('../model/user.model');
const Class = require('../model/class.model');
const Test = require('../model/test.model');
const Question = require('../model/question.model');
class AdminController {
    async CreateClass(req, res){
        console.log("Request received at CreateClass");
        const admin = req.user;
        const {class_name} = req.body;
        if(!class_name){
            return res.status(400).json({
                success: false,
                message: "Class name is required"
            });
        }
        try {
            const isCheck = await Class.findOne({class_name: class_name});
            if(isCheck) {
                return res.status(401).json({
                    success: false,
                    message: "Class Name Already Exist"
                });
            }
            await Class.create(req.body);
            return res.status(200).json({
                success: true,
                message: "Class Created Successfully",
                createBy: admin.email,
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    async CreateTest(req, res){
        const {name_test, description_test, diffcult_test, duration} = req.body;
        const admin = req.user;
        if(!name_test || !description_test || !diffcult_test || !duration){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }
        try {
            await Test.create({
                name_test: name_test,
                description_test: description_test,
                diffcult_test: diffcult_test,
                duration: duration,
                createBy: admin.email
            });
            return res.status(200).json({
                success: true,
                message: "Test Created Successfully",
                createBy: admin.email
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            }) 
        }
    }
    async CreateQuestion(req, res){
        const {testId} = req.params;
        const {question_name, answer_a, answer_b ,answer_c, answer_d, correct_answer} = req.body;
        const admin = req.user;
        if(!question_name || !answer_a || !answer_b || !answer_c || !answer_d || !correct_answer){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }
        try {
            const test = await Test.findOne({_id: testId});
            if(!test){
                return res.status(404).json({
                    success: false,
                    message: "Test not found"
                })
            }
            const newQuestion = await Question.create({
                question_name: question_name,
                answer_a: answer_a,
                answer_b: answer_b,
                answer_c: answer_c,
                answer_d: answer_d,
                correct_answer: correct_answer,
                createBy: admin.email
            });
            test.question_test.push({question: newQuestion._id});
            test.total_questions+=1;
            await test.save();
            return res.status(200).json({
                success: true,
                message: "Question Created Successfully",
                createBy: admin.email
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            }) 
        }
    }
    async UpdateTesr(req, res){
        const {testId} = req.params;
        const {status_test} = req.body;
        try {
            await Test.findOneAndUpdate({_id: testId},{$set: {status_test: status_test}}, {new: true});
            return res.status(200).json({
                success: true,
                message: "Test Updated Successfully",
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    async AddTestToClass(req, res){
        const {testId} = req.params;
        const {class_id} = req.body;
        const classData = await Class.findOne({_id: class_id});
        if(classData.tests.includes(testId)){
            return res.status(400).json({
                success: false,
                message: "Test already added to class"
            })
        }
        try {
            classData.tests.push(testId);
            await classData.save();
            return res.status(200).json({
                success: true,
                message: "Test added to class successfully",
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    async addTestToUser(req, res){
        const {email} = req.body;
        const {test_id} = req.body;
        const user = await User.findOne({email: email});
        const test = await Test.findById(test_id);
        const testExists = user.tests.some((t) => t.test.toString() === test_id);
        try {
            if (testExists) {
                return res.status(400).json({
                    success: false,
                    message: "Test already added to user",
                });
            }

            user.tests.push({ test: test_id, total_questions: test.total_questions});
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Test added to class successfully",
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    async showAllUser(req, res){
        try {
            const allUser = await User.find({role: {$in:[0,3]}}).select('-password');
            if(!allUser){
                return res.status(404).json({
                    success: false,
                    message: "No user found"
                })
            }
            return res.status(200).json({
                success: true,
                data: allUser
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    async showAllTest(req, res){
        try {
            const tests = await Test.find();
            if(!tests){
                return res.status(404).json({
                    success: false,
                    message: "No test found"
                })
            }
            return res.status(200).json({
                success: true,
                data: tests
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    async showOneTest(req, res){
        const {testId} = req.params;
        try {
            const data = await Test.findOne({_id: testId}).populate({
                path: 'question_test.question',
                model: 'Question',
            })
            if(!data){
                return res.status(404).json({
                    success: false,
                    message: "No test found"
                })
            }
            return res.status(200).json({
                success: true,
                message: 'ok',
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    async ShowClass(req, res){
        try {
            const {testId} = req.params;
            const AllClass = await Class.find();
            const Classes = AllClass.filter(classItem => !classItem.tests.includes(testId));
            if(!Classes){
                return res.status(404).json({
                    message: "No Class Found"
                });
            }
            return res.status(200).json({
                success: true,
                data: Classes,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = new AdminController