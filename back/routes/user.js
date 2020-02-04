const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models');

const router = express.Router();

//POST /api/user 회원가입
router.post('/', async (req, res, next) => {
    try {
         
    } catch(e) {
        console.error(e);
        return next(e);
    }
});