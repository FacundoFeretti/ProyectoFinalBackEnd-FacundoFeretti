import passport from 'passport';
import local from 'passport-local';
import userModel from '../daos/mongodb/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import { create } from 'express-handlebars';

const LocalStrategy = local.Strategy;
export const initializePassportLocal = () =>{
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField: 'email'}, async (req,username,password,done) => {
            const {first_name,last_name,email,age} = req.body;
            try{
                let user = await userModel.findOne({email:username});
                if(user){
                    console.log('User already exists');
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                let result = await userModel.create(newUser);
                return done(null,result);
            }catch (error) {
                return done('Error al registrar el usuario: ' + error);
            }
        }));

        passport.serializeUser((user, done) => {
            done(null, user._id);
        });

        passport.deserializeUser(async (id, done) => {
            let user = await userModel.findById(id);
            done(null, user);
        });

        passport.use('login', new LocalStrategy({usernameField:'email'}, async(username,password,done) => {
            try{
                const user = await userModel.findOne({email:username});
                if(!user){
                    console.log("User doesn't exists");
                    return done (null, false);
                }
                if(!isValidPassword(password, user)) return done(null,false);
                
                const userWithRole = {
                    ...user.toObject(),
                    role: user.role 
                };

                return done(null, userWithRole);
            }catch(error){
                return done(error)
            }
        }));
};