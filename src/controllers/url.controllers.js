const {getUrlConnection}  = require('../db/urlsDb')
const {v4} = require('uuid')

const generate = (req)=>{
    let maxLett = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let minLett = 'abcdefghijklmnopqrstuvwxyz'
    
    let length = Math.floor(Math.random() * (8-4) + 4)
    
    let urlShort = req.headers.host + '/' 
    
    for (let i = 0; i <= length; i++) {
        let array = Math.floor(Math.random() * (3-1) + 1)
        let letterToUSe = Math.floor(Math.random() * (25- 0) + 0)

        if (array==1){
            urlShort +=  maxLett[letterToUSe]
        } else {
            urlShort +=  minLett[letterToUSe]
        }
    }
    const exist = getUrlConnection().get('urls').find({urlShort}).value()
    if (exist) {
        generate()
    }
    return urlShort
}

const validateUrl = (url) => {
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/
    if(urlRegex.test(url)) return true
    return false
}

const createUrl = async (req,res)=>{
    const {oldurl} = req.body
    console.log(req.headers.host)
    var userId;
    req.user ? userId = req.user.id : userId = null
    
    if(validateUrl(oldurl)) {
        var newurl = generate(req)
        const date = new Date()
        const today = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}/${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`
        const urlToDb = {
            id: v4(),
            oldurl,
            newurl,
            userId,
            date: today,
            clicks: 0            
        }
        getUrlConnection().get('urls').push(urlToDb).write()
        res.render('index', {
            newurl
        })
    } else {
        res.render('index',{
            error: 'Please Write a valid URL',
        })
    }
}

const getMyUrls = async (req,res)=>{
    const allUrls = getUrlConnection().get('urls').value()
    let urls=[]
    for (const url of allUrls) {
        if (url.userId===req.user.id) {
            urls.push(url)
        }
    }
    res.render('myurls', { urls })
}

const deleteUrl = async (req,res)=>{
    await getUrlConnection().get('urls').remove({id: req.params.id}).write()
    res.redirect('/myurls')
}

const redirect = async (req,res)=>{
    const { id } = req.params;
    const newurl = `${req.headers.host}/${id}` 
    // try {
        const redirect = await getUrlConnection().get('urls').find({newurl}).value()
        if (redirect) {
            const newData={
                oldurl: redirect.oldurl,            
                newurl: redirect.newurl,            
                userId: redirect.userId,            
                date: redirect.date,            
                clicks: redirect.clicks + 1               
            }
            await getUrlConnection().get('urls').find({newurl}).assign(newData).write()
            return res.redirect(redirect.oldurl);
        } 
        res.render('notfound')
        // res.send('Something is not ok')
    // } catch (error) {
        // return res.status(404).send(error);
        // return res.status(404).sendFile(notFoundPath);
    // }
}

module.exports = {
    createUrl,
    getMyUrls,
    deleteUrl,
    redirect
}