const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

let db;

const createUrlConnection = async ()=>{
    const adapter = new FileAsync('urls.json')
    db = await low(adapter)
    db.defaults({urls: []}).write()
}

const getUrlConnection = () => db

module.exports = { 
    createUrlConnection,
    getUrlConnection
}