const express = require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const app=express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose=require('mongoose')
const config=require('./config')
const login=require('./schema/login')
const verifytoken=require('./auth/VerifyToken')
const verifytoken1=require('./VerifyToken1')
// var swig  = require('swig');

// app.engine('html', swig.renderFile);

// app.set('view engine', 'html');
// app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

//MongoDb Connections
mongoose.connect(config.url,{ useNewUrlParser: true });

mongoose.connection.once('open', function () {
  console.log("Database connection opened");
});

mongoose.connection.on('error', function (error) {
  console.log("Database connection error %s", error);
});

//
mongoose.connection.on('reconnected', function() {
  console.log("Database reconnected");
});
//
mongoose.connection.on('disconnected', function() {
  console.log("Database disconnected");
  mongoose.connect(config.url,{ useNewUrlParser: true });
});

//middlewares
app.use(cors())
app.use(bodyParser())
app.use(bodyParser.urlencoded({ extended:false }))





//post
app.post('/',(req,res)=>{
    console.log(req.body.passwordconf)
    
    login.find({email:req.body.email},(err,user)=>{
        if(user[0]!=null){
            console.log(user)
        res.send({status:409,
            msg:"This email id already exits"})
        }
        else if(err)
        {
            res.send({status:409,
                msg:"something went wrong"})
        }

   


    else if (req.body.password !== req.body.passwordconf) {
        res.send({status:400,
            msg:"passwords dont match"})
      }
    
     else if (req.body.email &&
        req.body.password &&
        req.body.passwordconf) {
    
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        
            login.create({
              email : req.body.email,
              password : hashedPassword,
            },
            function (err, user) {
              if (err) return res.status(500).send("There was a problem registering the user.")
              // create a token
              var token = jwt.sign({ id: user._id }, config.secret, {  //jwt sign encodes payload and secret
                expiresIn: 86400 // expires in 24 hours
              });
              res.status(200).send({status:200, auth: true, token: token });
            // res.status(200).send({status:200, auth: true, token: token }
            }); 
      }
    })
})

app.get('/',(req,res)=>{
    res.render('login')
})

app.get('/after',verifytoken,(req,res)=>{
     res.render('template')
    //  res.render('template')
})

app.get('*',(req,res)=>{
    res.end("hola")
})

app.listen(3007)