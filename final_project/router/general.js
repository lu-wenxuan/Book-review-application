const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    const username_exist = users.some(user => user.username === username)
    if (!username_exist) {
      users.push({ "username": username, "password": password })
      console.log(users)
      return res.status(200).json({ message: "register successfully now can login" })
    } else {
      return res.status(409).json({ message: "user already exist" })
    }
  } else {
    return res.status(400).json({ message: "enter valid username and password" })
  }

});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    res.send(JSON.stringify(books, null, 4))
  }
  catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn
    if (books[isbn]) {
      res.send(JSON.stringify(books[isbn]))
    }
    else {
      return res.send("no such book");
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by isbn" });
  }

});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    const authorname = req.params.author
    console.log(authorname)
    if (authorname) {
      const Array_books = Object.values(books)
      const filtered_books = Array_books.filter((book) => book.author === authorname)
      res.send(filtered_books)
    } else {
      return res.send("enter a author");
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const titlename = req.params.title
    if (titlename) {
      const Array_books = Object.values(books)
      const filtered_books = Array_books.filter((book) => book.title === titlename)
      return res.send(filtered_books)
    } else {
      return res.send("enter a title");
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const book_isbn = req.params.isbn
  const book = books[book_isbn]
  if (book) {
    return res.send(book.reviews)
  } else {
    return res.send("no such book");
  }

});

module.exports.general = public_users;
