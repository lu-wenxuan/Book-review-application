const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const auth_user = users.filter(user => {
    user.username === username && user.password === password
  })
  if (auth_user) {
    return true
  } else {
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  console.log(username)
  console.log(password)

  if (!username || !password) {
    return res.status(404).json({ message: "error ro login" })
  }
  //检查用户认证
  if (authenticatedUser(username, password)) {
    //生成 access token
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 })
    //设置会话信息（Session Management）是指在服务器与客户端之间维护状态信息的过程
    //req.session.authorization(accessToken)
    req.session.authorization = {
      accessToken: accessToken,
      username: username
    }
    //这意味着后续的请求可以通过检查会话中的accessToken来验证用户的身份和访问权限。

    return res.status(200).json({ message: "login successfully" })

  } else {
    return res.status(208).json({ message: "unable to login" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const book = books[req.params.isbn]
  const new_review = req.body.review
  const username = req.session.authorization.username

  if (req.session.authorization && req.session.authorization.accessToken) {

    const username_exist = users.some(user => user.username === username)
    if (username_exist) {
      book["reviews"].review = new_review
      console.log(book)
    }
    else {
      book.reviews[username] = new_review
      console.log(book)
    }
    return res.status(200).json(book)
  } else {
    return res.status(401).json({ message: "unauthorized" })
  }
});

regd_users.delete("/auth/review/:isbn", (req,res)=>{
  const book = books[req.params.isbn]
  const username = req.session.authorization.username
  const exist_view = book.reviews[username]
  if(exist_view){
    delete book.reviews[username]
    return res.status(200).json({message:`delete your review: ${exist_view} successfully`})
  }else{
    return res.status(401).json({message:"you can only delete review from you"})
  }

}); 

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
