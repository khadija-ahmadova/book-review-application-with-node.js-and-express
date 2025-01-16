const express = require('express');
const axios = require('axios');
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

/* // Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
}); */

// Get the book list using Promise callbacks
public_users.get('/', (req, res) => {
    const fetchBooks = () => {
      return new Promise((resolve, reject) => {
        try {
          resolve(books);
        } catch (error) {
          reject(error);
        }
      });
    };
  
    fetchBooks()
      .then(bookList => {
        res.json(bookList);
      })
      .catch(error => {
        res.status(500).json({ message: "Error fetching books", error: error.message });
      });
  });

/* // Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]){
    let book = books[isbn];
    res.send(JSON.stringify(book, null, 4));
  }
  res.send("No book with mathcing ISBN found."); 
 }); */

 // Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("No book with matching ISBN found.");
      }
    });
  
    getBookByISBN
      .then((book) => res.send(JSON.stringify(book, null, 4)))
      .catch((error) => res.status(404).send(error));
  });
  
  
/* // Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  for (const key in books) {
    if (books[key].author === author) {
        let book = books[key];
        res.send(JSON.stringify(book, null, 4));
    }
  }
}); */

// Get book details based on author using Promise
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found by this author.");
      }
    });
  
    getBooksByAuthor
      .then((books) => res.send(JSON.stringify(books, null, 4)))
      .catch((error) => res.status(404).send(error));
  });

/* // Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    for (const key in books) {
      if (books[key].title === title) {
          let book = books[key];
          res.send(JSON.stringify(book, null, 4));
      }
    }
}); */

// Get book details based on title using Promise
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
      const booksByTitle = Object.values(books).filter(book => book.title === title);
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found with this title.");
      }
    });
  
    getBooksByTitle
      .then((books) => res.send(JSON.stringify(books, null, 4)))
      .catch((error) => res.status(404).send(error));
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
