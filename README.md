## **Server-side application that stores, retrieves and manages book ratings and reviews.**

Application is implemented as a RESTful web service.

Session and JWT authentication is implemented to allow only logged in users to perform certain operations.

The app provides following features:
- Retrieve a list of all books available in the bookshop
- Search for specific books and retrieve their details based on the book’s ISBN code, author names and titles
- Retrieve reviews/comments for specified books
- Register as a new user of the application
- Login to the application
- Add a new review for a book (logged in users only)
- Modify a book review (logged in users can modify only their own reviews)
- Delete a book review (logged in users can delete only their own reviews)