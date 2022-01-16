import React, { Component } from "react";
// import * as BooksAPI from './BooksAPI'
import "./App.css";
import { Route, Link } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";

import { getAll, update, search } from "./BooksAPI";

import SearchedBook from "./components/SearchedBook";
import Bookshelf from "./components/Bookshelf";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      searchedBooks: [],
      searchResults: [],
      shelvedBooks: [],
    };
    this.moveSearchedBook = this.moveSearchedBook.bind(this);
    this.moveShelvedBook = this.moveShelvedBook.bind(this);
  }
  componentDidMount() {
    this.updateBooks();
  }
  updateBooks = () => {
    getAll().then((books) => {
      this.setState({
        shelvedBooks: books,
      });
    });
  };
  moveSearchedBook = (id, shelf) => {
    const bookToMove = this.state.searchResults.filter(
      (book) => book.id === id
    )[0];
    update(bookToMove, shelf).then((result) => {
      console.log(result);
      this.updateBooks();
    });
  };
  moveShelvedBook = (id, shelf) => {
    const bookToMove = this.state.shelvedBooks.filter(
      (book) => book.id === id
    )[0];
    update(bookToMove, shelf).then((result) => {
      console.log(result);
      this.updateBooks();
    });
  };
  handleQuery = async (e) => {
    this.setState(
      {
        query: e.target.value,
      },
      await this.displayBooks(e.target.value)
    );
  };
  displayBooks = async (query) => {
    search(query)
      .then((books) => {
        {
          if (books !== undefined && books.length > 0) {
            const searchResults = books
              .filter((book) => book.imageLinks !== undefined)
              .map((searchedBook) => {
                const match =
                  this.state.shelvedBooks.find(
                    (shelvedBook) => searchedBook.id === shelvedBook.id
                  ) || {};
                if (Object.keys(match).length > 0) {
                  return match;
                } else {
                  return {
                    id: searchedBook.id,
                    shelf: "none",
                    imageLinks: {
                      smallThumbnail: searchedBook.imageLinks.smallThumbnail,
                    },
                    title: searchedBook.title,
                    authors:
                      searchedBook.authors === undefined
                        ? []
                        : searchedBook.authors,
                  };
                }
              });
            this.setState({
              searchResults: searchResults,
              searchedBooks: searchResults.map((book) => {
                return (
                  <li key={book.id}>
                    <SearchedBook
                      book={book}
                      moveBook={this.moveSearchedBook}
                    />
                  </li>
                );
              }),
            });
          } else {
            this.setState({
              searchResults: [],
              searchedBooks: [],
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    return (
      <div className="app">
        <Route
          path="/search"
          render={() => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/">
                  <button className="close-search" />
                </Link>
                <div className="search-books-input-wrapper">
                  {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    value={this.state.query}
                    onChange={async (e) => await this.handleQuery(e)}
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">{this.state.searchedBooks}</ol>
              </div>
            </div>
          )}
        />
        <Route
          exact
          path="/"
          render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <Bookshelf
                    title={"Currently Reading"}
                    books={this.state.shelvedBooks.filter(
                      (book) => book.shelf === "currentlyReading"
                    )}
                    moveBook={this.moveShelvedBook}
                  />
                  <Bookshelf
                    title={"Want to Read"}
                    books={this.state.shelvedBooks.filter(
                      (book) => book.shelf === "wantToRead"
                    )}
                    moveBook={this.moveShelvedBook}
                  />
                  <Bookshelf
                    title={"Read"}
                    books={this.state.shelvedBooks.filter(
                      (book) => book.shelf === "read"
                    )}
                    moveBook={this.moveShelvedBook}
                  />
                </div>
              </div>
              <div className="open-search">
                <Link to="/search">
                  <div className="open-search">
                    <button>Add a book</button>
                  </div>
                </Link>
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

export default App;
