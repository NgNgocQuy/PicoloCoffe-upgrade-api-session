const Account = require("./models/account")
const md5 = require("md5")

const test = async (req,res,next)=>{
    console.log("test account function");
        next()
    }
const logUrl = async (req,res,next)=>{
        console.log("Request Url: "+ req.originalUrl+" :: "+ new Date());
        next()
    }

const authenticate = async(req, res, next)=>{
    try {
        let snapshot = await Account.findOne({user:req.session.username}).exec()
        if(req.session.sessionKey== snapshot.sessionKey){
            req.permission = snapshot.permission
            next()
        }
        else {
            req.session.destroy(function (err) {
                if (err) return next(err)
                else return res.redirect('/loginPage');
            });
        }
    } catch (error) {
        res.redirect('/loginPage')
    }
        
}

const updateSessionKey = async(username,password,sessionKey)=>{
    console.log("acc: "+ username +" "+ password)
    Account.findOneAndUpdate({"user":username,"password": password},{"sessionKey":sessionKey}, {upsert: false}, function(err, doc) {
        if (err){
            console.log("task:<< login >> updateSessionKey <"+username+"> Account.findOneAndUpdate SessionKey error: not found! ; /"+ addressFile)
            return false;
        }
        return true;
    });
}

module.exports = {
    test,
    logUrl,
    authenticate,
    updateSessionKey,
}