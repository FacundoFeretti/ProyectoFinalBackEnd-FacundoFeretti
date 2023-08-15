import {Router} from "express";
import userModel from "../daos/mongodb/models/user.model.js";
import passport from "passport";

const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), async (req, res) => {
   res.send({status:'success', message:'User registered'})
});

router.get('/failregister', async(req,res)=>{
  console.log('Failed Strategy');
  res.send({error:'Failed'})
});

router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin'}),async (req,res) => {
    if(!req.user) return res.status(400).send({status:"error",error:"Invalid Credentials"})
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email
    }
    res.send({status:'success',payload:req.user})
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

router.get('/github', passport.authenticate('github', {scope: "user:email"}), async(req,res)=>{})

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}), async(req,res)=> {
  req.session.user = req.user;
  res.redirect('/products')
})

export default router