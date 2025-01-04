const auth = require('./auth');
const admin = require('./admin');
const student = require('./user');
function router(app){
    app.use('/api/v1/student', student);
    app.use('/api/v1/admin', admin);
    app.use('/api/v1/auth', auth);
}
module.exports = router;