const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

//This tells your express app to use the session middleware.
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
//secret - a random unique string key used to authenticate a session.
//resave - takes a Boolean value. It enables the session to be stored back to the session store, even if the session was never modified during the request.
//saveUninitialized - this allows any uninitialized session to be sent to the store. When a session is created but not modified, it is referred to as uninitialized.


app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if(req.session.authorization && req.session.authorization.accessToken){
    next();
}else{
    return res.status(401).json({message:"unauthorized"})
}

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
