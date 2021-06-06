const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const bcrypt = require("bcryptjs")

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

const matchPassword = async function (userPassword, DBpassword) {
    return await bcrypt.compare(userPassword, DBpassword)
}


let db;

const createUsersConnection = async ()=>{
    const adapter = new FileAsync('users.json')
    db = await low(adapter)
    db.defaults({users: []}).write()
}

const getUsersConnection = () => db

module.exports = { 
    createUsersConnection,
    getUsersConnection,
    encryptPassword,
    matchPassword
}