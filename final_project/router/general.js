const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if(!username) {
    return res.status(400).json({message: "Missing username"});  
  }
  if(!password) {
    return res.status(400).json({message: "Missing password"});  
  }

  if(isValid(username)) {
    users.push({username, password});
    return res.status(200).json({message: "Successfully registered"});  
  }
  else {
    return res.status(400).json({message: "Username already in use"});  
  }
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  // Wrap the operation in a promise
  return new Promise((resolve, reject) => {
    try {
      // Simulate an asynchronous operation
      resolve(books); // Resolve the promise with the books data
    } catch (error) {
      reject(error); // Reject the promise if there's an error
    }
  })
  .then(data => {
    // Send the successful response
    res.status(200).json(data);
  })
  .catch(error => {
    // Handle errors
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  });
});


public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  // Create a new promise
  return new Promise((resolve, reject) => {
    try {
      let resultingBook;

      // Find the book synchronously
      Object.keys(books).forEach((key) => {
        if (books[key].isbn === isbn) {
          resultingBook = books[key];
          return;
        }
      });

      if (resultingBook) {
        // Resolve the promise with the book data
        resolve(resultingBook);
      } else {
        // Reject the promise if the book is not found
        reject(new Error('Book not found'));
      }
    } catch (error) {
      // Reject the promise if there's an error
      reject(error);
    }
  })
  .then(data => {
    // Send the successful response
    res.status(200).json(data);
  })
  .catch(error => {
    // Handle errors
    res.status(404).json({ message: error.message });
  });
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;

  // Create a new promise
  return new Promise((resolve, reject) => {
    try {
      let resultingBook = null;

      // Find the book synchronously
      Object.keys(books).forEach((key) => {
        if (books[key].author === author) {
          resultingBook = books[key];
          return;
        }
      });

      if (resultingBook) {
        // Resolve the promise with the book data
        resolve(resultingBook);
      } else {
        // Reject the promise if no book is found for the given author
        reject(new Error('No books found for this author'));
      }
    } catch (error) {
      // Reject the promise if there is an error
      reject(error);
    }
  })
  .then(data => {
    // Send the successful response
    res.status(200).json(data);
  })
  .catch(error => {
    // Handle errors
    res.status(404).json({ message: error.message });
  });
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  // Create a new promise
  return new Promise((resolve, reject) => {
    try {
      let resultingBook = null;

      // Find the book synchronously
      Object.keys(books).forEach((key) => {
        if (books[key].title === title) {
          resultingBook = books[key];
          return;
        }
      });

      if (resultingBook) {
        // Resolve the promise with the book data
        resolve(resultingBook);
      } else {
        // Reject the promise if no book is found with the given title
        reject(new Error('No books found with this title'));
      }
    } catch (error) {
      // Reject the promise if there is an error
      reject(error);
    }
  })
  .then(data => {
    // Send the successful response
    res.status(200).json(data);
  })
  .catch(error => {
    // Handle errors
    res.status(404).json({ message: error.message });
  });
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // ISBN is a string in the books object
  // Find the book with the matching ISBN
  const resultingBook = Object.values(books).find((book) => book.isbn === isbn);

  if (resultingBook) {
    // Return the reviews of the found book
    return res.status(200).json(resultingBook.reviews);
  } else {
    // Handle the case where the book is not found
    return res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;
