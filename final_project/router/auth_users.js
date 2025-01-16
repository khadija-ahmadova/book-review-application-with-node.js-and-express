const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Extract the ISBN from the request parameters
    const isbn = req.params.isbn;
    
    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Get the review text
    const review = req.body.review;
    if (!review) {
        return res.status(400).json({
            message: "Review text is required"
        });
    }

    // Get the username from the session
    // This is available because the user is authenticated
    const username = req.session.authorization.username;
    if (!username) {
        return res.status(401).json({
            message: "User not authenticated"
        });
    }

    // Initialize the reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or modify the review
    // Using username as the key ensures one review per user
    books[isbn].reviews[username] = review;

    // Return success response with the updated reviews
    return res.status(200).json({
        message: "Review successfully posted/updated",
        book: books[isbn].title,
        reviews: books[isbn].reviews
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract the ISBN from the request parameters
    const isbn = req.params.isbn;
    
    // erify that the book exists in our database
    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found",
            error: "The specified ISBN does not exist in our database"
        });
    }
    
    // Get the username from the authenticated session
    const username = req.session.authorization.username;
    
    // Check if the reviews object exists for this book
    if (!books[isbn].reviews) {
        return res.status(404).json({
            message: "No reviews found for this book",
            error: "This book has no reviews to delete"
        });
    }
    
    // Check if the user has a review for this book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({
            message: "Review not found",
            error: "You haven't submitted a review for this book"
        });
    }
    
    // Delete the user's review
    delete books[isbn].reviews[username];
    
    // Return success response with updated review state
    return res.status(200).json({
        message: "Review successfully deleted",
        book: books[isbn].title,
        remainingReviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
