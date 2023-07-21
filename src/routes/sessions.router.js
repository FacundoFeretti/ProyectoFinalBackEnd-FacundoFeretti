import {Router} from "express";
import userModel from "../daos/mongodb/models/user.model.js";

const router = Router();

router.post('/register', async (req,res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const exist = await userModel.findOne({ email });

    if(exist) {
        return res.status(400).send({ status: 'error', message: 'usuario ya registrado' });
    };

    let result = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password
    });
    res.send({ status: 'success', message: 'usuario registrado'});
});

router.post('/login', async (req,res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({ email: email, password: password})

    if(!user){
        return res.send({status: 'error', message: 'credenciales incorrectas'});
    };
    
    req.session.user = {
        name: user.first_name + user.last_name,
        email: user.email,
        age: user.age
    }
    res.send({ status: "success", message: req.session.user });
});

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
  })

export default router