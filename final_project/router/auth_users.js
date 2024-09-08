const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let b = true;
  for(let i = 0; i < users.length; i++) {
    if(users[i].username === username) {
      b = false;
    }
  }
  return b;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  for(let i = 0; i < users.length; i++) {
    let obj = users[i];
    if(obj.username === username && obj.password === password) {
      return true;
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", async (req,res) => {
  //Write your code here
  const privateKey = 'fingerprint_customer';
  const { username, password } = req.body;
  if(authenticatedUser(username, password)) {
    let token = await jwt.sign({ username, password }, privateKey);
    for(let i = 0; i < users.length; i++) {
      if(users[i].username === username) {
        users[i].jwt = token;
      }
      req.session.token = token;
    }
    return res.status(200).json({token});
  }
  else {
    return res.status(400).json({message: "Invalid credentials"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body;
  const { isbn } = req.params;
  const result = jwt.verify(req.body.token, 'fingerprint_customer');
  const username = result.username;
  
  //Write your code here
  let k;
  Object.keys(books).forEach((key) => {
    if(books[key].isbn === Number(isbn)) {
      books[key].reviews[username] = review;
      k = key;
    }
  });
  return res.status(200).json({message: "Review added", book: books[k].reviews});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const result = jwt.verify(req.body.token, 'fingerprint_customer');
  const username = result.username;
  
  let k;
  Object.keys(books).forEach((key) => {
    if(books[key].isbn === Number(isbn)) {
      delete books[key].reviews[username];
      k = key;
    }
  });
  return res.status(200).json({message: "Review deleted", book: books[k].reviews});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;