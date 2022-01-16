import React, { Component } from "react";
// import * as BooksAPI from './BooksAPI'
import "./App.css";

import { v4 as uuidv4 } from "uuid";

import { get, getAll, update, search } from "./BooksAPI";

import SearchedBook from "./components/SearchedBook";
import Bookshelf from "./components/Bookshelf";

class BooksApp extends Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      searchedBooks: null,
      searchResults: [],
      books: [],
    };
    this.moveSearchedBook = this.moveSearchedBook.bind(this);
    this.moveShelvedBook = this.moveShelvedBook.bind(this);
  }
  componentDidMount() {
    this.updateBooks();
  }
  updateBooks = () => {
    getAll().then((books) => {
      console.log(books);
      this.setState({
        books: books,
      });
    });
  };
  moveSearchedBook = (id, shelf) => {
    update(
      delete this.state.searchResults.filter((book) => book.id === id)[0].shelf,
      shelf
    ).then((result) => {
      console.log(result);
      this.updateBooks();
    });
  };
  moveShelvedBook = (id, shelf) => {
    getAll().then((books) => {
      update(books.filter((book) => book.id === id)[0], shelf).then(() =>
        this.updateBooks()
      );
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
    search(query).then((books) => {
      {
        if (books !== undefined && books.length > 0) {
          const searchResults = books
            .filter((book) => book.imageLinks !== undefined)
            .map((book) => {
              return {
                id: uuidv4(),
                shelf: "none",
                imageLinks: {
                  smallThumbnail: book.imageLinks.smallThumbnail,
                },
                title: book.title,
                authors: book.authors === undefined ? [] : book.authors,
              };
            });
          this.setState({
            searchResults: searchResults,
            searchedBooks: searchResults.map((book) => {
              return (
                <li key={book.id}>
                  <SearchedBook book={book} moveBook={this.moveSearchedBook} />
                </li>
              );
            }),
          });
        } else {
          this.setState({
            searchResults: [],
            searchResults: [],
          });
        }
      }
    });
  };
  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <button
                className="close-search"
                onClick={() => this.setState({ showSearchPage: false })}
              >
                Close
              </button>
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
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <Bookshelf
                  title={"Currently Reading"}
                  books={this.state.books.filter(
                    (book) => book.shelf === "currentlyReading"
                  )}
                  moveBook={this.moveShelvedBook}
                />
                <Bookshelf
                  title={"Want to Read"}
                  books={this.state.books.filter(
                    (book) => book.shelf === "wantToRead"
                  )}
                  moveBook={this.moveShelvedBook}
                />
                <Bookshelf
                  title={"Read"}
                  books={this.state.books.filter(
                    (book) => book.shelf === "read"
                  )}
                  moveBook={this.moveShelvedBook}
                />
              </div>
            </div>
            <div className="open-search">
              <button onClick={() => this.setState({ showSearchPage: true })}>
                Add a book
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BooksApp;
