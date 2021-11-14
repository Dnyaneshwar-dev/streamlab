const redis = require('redis');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = redis.createClient({
    host: 'localhost',
    port: 6379
});


const auth = (token) =>{
    try{
        const decoded = jwt.verify(token,'secretissecretyoucannotcheckitwithoutme');
        return true;
    } catch(err){
        return false;
    }
}

const setToken = (roomid,password) =>{
    client.get(roomid,(err,reply)=>{
        if(err){
            console.log(err);
            return false;
        }
        if(reply){
            if(password == reply){
                return true;
            }
            else{
                
                return false;
            }
        }
        else{
            return false;
        }
    })
    return false;

}


module.exports = {
    auth,
    setToken
}