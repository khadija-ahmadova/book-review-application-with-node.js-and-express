const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
        users.push({"username" : username, "password" : password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists"});
    }
  }

  return res.status(404). json({message: "Username or password not provided."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]){
    let book = books[isbn];
    res.send(JSON.stringify(book, null, 4));
  }
  res.send("No book with mathcing ISBN found."); 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  for (const key in books) {
    if (books[key].author === author) {
        let book = books[key];
        res.send(JSON.stringify(book, null, 4));
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    for (const key in books) {
      if (books[key].title === title) {
          let book = books[key];
          res.send(JSON.stringify(book, null, 4));
      }
    }
});

//  Get book review based on ISBN
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if (isbn) {
        let reviews = books[isbn].reviews;
        res.send(reviews);
    } 
});

module.exports.general = public_users;
