const auth = require('./auth');
function router(app){
    app.use('/api/v1/auth', auth);
}
module.exports = router;