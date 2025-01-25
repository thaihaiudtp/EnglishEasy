const Class = require('../model/class.model');
const User = require('../model/user.model');
const Test = require('../model/test.model');
const Question = require('../model/question.model');
const mongoose = require('mongoose'); 
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
    async showOneClass(req, res){
        const {slug} = req.params;
        try {
            const OneClass = await Class.findOne({slug}).populate({
                path: 'tests',
                match: {status_test: 1},
                select: 'name_test description_test duration',
            });
            if(!OneClass){
                return res.status(404).json({
                    success: false,
                    message: "No Class Found"
                })
            }
            return res.status(200).json({
                success: true,
                data: OneClass
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    async doTest(req, res){
        const {test_id} = req.params;
        const { email } = req.user;
        console.log(req.user, email)
        try {
            const user = await User.findOne({email}).populate('tests.test');
            if(!user){
                return res.status(403).json({ 
                    success: false,
                    message: 'You do not have permission to take this test' 
                });
            }
            const test = await Test.findById(test_id).populate('question_test.question');
            if (!test) {
                return res.status(404).json({ message: 'Test not found' });
            }
            const userTest = user.tests.find(t => t.test._id.toString() === test_id);
            if (!userTest) {
                return res.status(403).json({ 
                    success: false,
                    message: 'You do not have permission to take this test' });
            }
            const currentTime = new Date();
            if (currentTime > userTest.end_time) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Test time has expired. You can no longer take this test.' 
                });
            }
            const start_time = new Date();
            const end_time = new Date(start_time.getTime() + test.duration * 60000);
            userTest.start_time = start_time;
            userTest.end_time = end_time;
            await user.save();
            const questions = test.question_test.map(q => ({
                question_id: q.question._id,
                question_name: q.question.question_name,
                answer_a: q.question.answer_a,
                answer_b: q.question.answer_b,
                answer_c: q.question.answer_c,
                answer_d: q.question.answer_d,
            }));
            res.status(200).json({
                message: 'Test questions retrieved successfully',
                test: {
                    name_test: test.name_test,
                    description_test: test.description_test,
                    diffcult_test: test.diffcult_test,
                    duration: test.duration,
                    total_questions: test.total_questions,
                },
                questions,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving test', error: error.message });
        }
    }
    async submitQuestion(req, res){
        const {testId} = req.params;
        const {question_id} = req.body;
        const {user_answer} = req.body;
        const {email} = req.user;
        try {
            const question = await Question.findById(question_id);
            const user = await User.findOne({ email }).populate('tests.test').populate('tests.answered_questions.question');
            //console.log(user)
            //console.log(user.tests[0].test._id);
            const userTest = user.tests.find(t => t.test._id.toString() === testId);
            //console.log(userTest)
            let answeredQuestion = userTest.answered_questions.find(aq => aq.question._id.toString() === question_id);
            if(!answeredQuestion){
                answeredQuestion = {
                    question: question_id,
                    total: user_answer === question.correct_answer ? 1 : 0,
                };
                userTest.answered_questions.push(answeredQuestion);
            } else {
                answeredQuestion.total = user_answer === question.correct_answer ? 1 : 0;
            }
            userTest.total_correct_answers = userTest.answered_questions.filter(aq => aq.total === 1).length;
            userTest.score = (userTest.total_correct_answers / userTest.total_questions) * 10;
            await user.save();
            return res.status(200).json({
                success: true,
                message: 'Question submitted successfully',
            })
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Error retrieving test', error: error.message });
        }
    }
}
module.exports = new UserController