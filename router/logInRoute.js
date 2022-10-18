import express from 'express';
const logInRoute = express.Router();
import passport from '../passport.js';

logInRoute.get('/',async (req,res) => {
    res.render('logIn')
});

logInRoute.post('/',passport.authenticate('login',{ failureRedirect: '/signIn',failureMessage: true }),passport.authenticate('autenticado',{ failureRedirect: '/',failureMessage: true }),async (req,res) => {
    res.redirect('/formulario/' + req.body.username)
})

export default logInRoute;