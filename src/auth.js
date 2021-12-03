const db = require('./db_conn');
const bcrypt = require('bcryptjs')

async function userAuth(password, cb){
    let hashPassword = await bcrypt.hash(password, 10);
    cb(hashPassword);
};

module.exports = userAuth;