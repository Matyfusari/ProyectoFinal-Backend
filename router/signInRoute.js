// const signInRoute = require('express').Router()
import express from 'express';
const signInRoute = express.Router();
import passport from '../passport.js';
// const passport = require('../passport.js');


signInRoute.get('/',async (req,res) => {
    res.render('signIn')
})

signInRoute.post('/',passport.authenticate('registracion',{ failureRedirect: '/',failureMessage: true }),async (req,res) => {
    res.redirect('/formulario/' + req.body.username)
})

export default signInRoute;