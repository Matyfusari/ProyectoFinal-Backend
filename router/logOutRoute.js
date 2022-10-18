// const logOutRoute = require('express').Router()
import express from 'express';
const logOutRoute = express.Router();


logOutRoute.get('/',async (req,res) => {
    req.session.destroy((err) => {
        console.log(err);
        console.log('Hasta luego');
    })
    res.render('logOut')
})

export default logOutRoute;