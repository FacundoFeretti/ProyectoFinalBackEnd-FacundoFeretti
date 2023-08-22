import passport from "passport";
import GitHubStrategy from 'passport-github2'
import userModel from "../daos/mongodb/models/user.model.js";

export const initializePassportGitHub = () => {
    passport.use('github', new GitHubStrategy({
        clientID:"Iv1.5d64bccd090139fa",
        clientSecret:"336dde6369d6e138bdc9c4125be8147fe2323a61",
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done)=> {
        try{
            console.log(profile);
            let user = await userModel.findOne({first_name: profile.username});
            if(!user){
                let newUser = {
                    first_name: profile.username,
                    last_name:'',
                    age:26,
                    email:profile.profileUrl,
                    password:''
                }
                let result = await userModel.create(newUser);
                done(null,result)
            }else{
                done(null,user);
            }
        }catch(error){
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null,user);
    });
}

export default initializePassportGitHub;