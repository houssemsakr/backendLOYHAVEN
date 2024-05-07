const express = require('express');
const mongoose=require('mongoose')
const Joi=require('joi')
require('dotenv').config();
const bcrypt =require('bcrypt')
const jwt=require('jsonwebtoken')

let schemaUser=mongoose.Schema({
    firstname: String,
    lastname:String,
    age:Number,
    phone:Number,
    email:String,
    password: String,
})
var User=mongoose.model('user', schemaUser)
let url= process.env.URL



exports.testConnect=()=>{
return new Promise((resolve, reject)=>{
mongoose.connect(url).then((err, stats) => {
    if (err) {
        reject(err);
    } else {
        resolve('Connected to MongoDB');
    }
});
});
};

exports.register=(firstname,lastname,age,phone, email, password)=>{
    return new Promise((resolve, reject)=>{
            mongoose.connect(url).then(()=>{
                return User.findOne({email:email})

            }).then((doc)=>{
               if(doc){
                 
                   reject('this email is exist')
               }else{
                   bcrypt.hash(password, 10).then((hashedPassword)=>{
                      let user=new User({
                        firstname:firstname,
                        lastname:lastname,
                        age:age,
                        phone:phone,
                        email:email,
                        password:hashedPassword
                       })
                       user.save().then((user)=>{
                            
                             resolve(user)
                        }).catch((err)=>{
                              
                              reject(err)
                        })
                   }).catch((err)=>{
                     
                         reject (err)
                   })
                   
               }
           })
    })
}
var privateKey=process.env.PRIVATE_KEY 
exports.login=(email, password)=>{
   return new Promise((resolve, reject)=>{
           mongoose.connect(url).then(()=>{
               return User.findOne({email:email})

           }).then((user)=>{
               if(!user){
              
               reject("we don't have this email in our database")
           }else{
               bcrypt.compare(password, user.password).then((same)=>{
                     if(same) {
                      let token= jwt.sign({id:user._id, firstname: user.firstname},privateKey, {
                          expiresIn: '1h',
                        })
                        
                     resolve(token)
                     
                    }else{
                      
                       reject('invalid password')
                    }
               }).catch((err)=>{
                   
                   reject(err)
               })
           }
       })
   })
}
    exports.getAllUser=()=>{
        return new Promise((resolve, reject)=>{
        mongoose.connect(url).then(()=>{
        return User.find()

        }).then((doc)=>{
       
        resolve(doc)
        }).catch((err)=>{
        
        reject(err)
        })
        })
    }
    exports.getOneUser=(id)=>{
        return new Promise((resolve, reject)=>{
        mongoose.connect(url).then(()=>{
        return User.findById(id)
        
        }).then((doc)=>{
       
        resolve(doc)
        }).catch((err)=>{
        
        reject(err)
        })
        })
    }
    exports.deleteOneUser=(id)=>{
        return new Promise((resolve, reject)=>{
        mongoose.connect(url).then(()=>{
        return User.deleteOne({_id:id})
        
        }).then((doc)=>{
       
        resolve(doc)
        }).catch((err)=>{
        
        reject(err)
        })
        })
    }
   