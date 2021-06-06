const express = require('express');
const { createUrl, getMyUrls, redirect, deleteUrl} = require('../controllers/url.controllers');
const router = express.Router()
const { isAuthenticated } = require("../helpers/auth");



router.post('/', createUrl)

router.get('/myurls', isAuthenticated, getMyUrls)

router.delete('/delete/:id', isAuthenticated, deleteUrl)

router.get('/:id', redirect);

module.exports= router
