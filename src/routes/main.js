const express = require('express');
const router = express.Router()
const passport = require('passport');
const { isAuthenticated, isNotAuthenticated } = require("../helpers/auth");

const {getUsersConnection, encryptPassword}  = require('../db/usersDb')

const generateUserId = ()=>{
    let maxLett = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let minLett = 'abcdefghijklmnopqrstuvwxyz'
    
    let length = Math.floor(Math.random() * (8-4) + 4)
    
    let userId = '' 
    
    for (let i = 0; i <= length; i++) {
        let array = Math.floor(Math.random() * (3-1) + 1)
        let letterToUSe = Math.floor(Math.random() * (25- 0) + 0)

        if (array==1){
            userId +=  maxLett[letterToUSe]
        } else {
            userId +=  minLett[letterToUSe]
        }
    }
    const exist = getUsersConnection().get('users').find({userId}).value()
    if (exist) {
        generateUserId()
    }
    return userId
}

router.get('/', (req, res)=>{
    res.render('index')
})

router.get('/about', (req, res)=>{
    res.render('about')
})

router.get('/login', isNotAuthenticated,(req, res)=>{
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/myurls',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/register', isNotAuthenticated ,(req, res)=>{
    res.render('register')
})

router.post('/register', async (req, res)=>{
    const {name, email, password, confirm_password} = req.body
    const errors=[]
    if (name.length == 0) {
        errors.push({text: "Please Insert Your Name"})
    }
    if (email.length == 0) {
        errors.push({text: "Please Insert Your Email"})
    }
    if (password.length == 0) {
        errors.push({text: "Please Insert Your Password"})
    }
    
    if (confirm_password.length == 0) {
        errors.push({text: "Please Confirm Your Password"})
    }
    if (password != confirm_password) {
        errors.push({text: "Password don't match"})
    } 
    if(password == confirm_password) {
        const passwordRegex = /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/
        if(passwordRegex.test(password)) {}
        else errors.push({text: 'Password should have 1 lowercase letter, 1 uppercase letter, 1 number, and be at least 8 characters long'})
    }

    if (errors.length > 0) {
        res.render('register', {errors, name, email, password, confirm_password})
    } else {
        const emailUser = await getUsersConnection().get('users').find({email}).value()
        
        if (emailUser) {
            req.flash('success_msg', 'This email already in use')
            return res.redirect('/register')
        }
            
            const date = new Date()
            encryptPassword(password).then(password=>{
                let encryptedPassword = password
                const today = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}/${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`        
                
                const id = generateUserId()
                const newUser = {
                    id,
                    name, 
                    email, 
                    password: encryptedPassword, 
                    registerDate: today
                }
                getUsersConnection().get('users').push(newUser).write()
                req.flash('success_msg', 'You are registered')
                res.redirect('/login')
            })
    }
})

router.get('/logout', isAuthenticated,(req, res)=>{
    req.logout()
    res.redirect('/')
})

module.exports= router