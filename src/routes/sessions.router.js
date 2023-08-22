import {Router} from "express";
import userModel from "../daos/mongodb/models/user.model.js";
import passport from "passport";
import jwt from 'jsonwebtoken';
import { authorization, passportCall } from "../utils.js";

const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister', session: false}), async (req, res) => {
   res.send({status:'success', message:'User registered'})
});

router.get('/failregister', async(req,res)=>{
  console.log('Failed Strategy');
  res.send({error:'Failed'})
});

router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin', session: false}),async (req,res) => {
  let userForRole = await userModel.findOne({email: req.body.email})
  let token = jwt.sign({email: req.body.email, role: userForRole.role}, 'secret', {expiresIn: '24h'});
  res.cookie('coderCookie', token, {httpOnly: true}).send({status: "success"})
});

router.get('/faillogin', (req,res) => {
  res.send({error:'Failed Login'})
})

router.get("/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          res.status(400).send("Unable to log out");
        } else {
          res.redirect("/");
        }
      });
    } else {
      res.redirect("/");
    }
});

router.get('/current',
  passportCall('jwt'),
  authorization('user'),
  async (req, res)=> {
    res.send(req.user)
  }
);

router.get('/github', passport.authenticate('github', {scope: "user:email"}), async(req,res)=>{})

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}), async(req,res)=> {
  req.session.user = req.user;
  res.redirect('/products')
})

export default router