import React, { Component } from "react";
// import * as BooksAPI from './BooksAPI'
import "./App.css";

// import { v4 as uuidv4 } from "uuid";

import { search } from "./BooksAPI";

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
    // Reference: https://stackoverflow.com/questions/28314368/how-to-maintain-state-after-a-page-refresh-in-react-js Accessed: 1/16/22
    this.state = {
      query: "",
      searchedBooks: [],
      searchResults: [],
      shelvedBooks: JSON.parse(localStorage.getItem("MyReads")) || [],
    };
    this.moveSearchedBook = this.moveSearchedBook.bind(this);
    this.moveShelvedBook = this.moveShelvedBook.bind(this);
  }
  componentDidMount() {
    this.updateBooks();
  }
  updateBooks = () => {
    this.forceUpdate();
  };
  moveSearchedBook = (id, shelf) => {
    const bookToMove = this.state.searchResults.filter(
      (book) => book.id === id
    )[0];
    bookToMove.shelf = shelf;
    console.log(bookToMove);
    this.setState(
      (prevState) => ({
        // Reference: https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects Accessed: 1/16/22
        shelvedBooks: prevState.shelvedBooks
          .concat(bookToMove)
          .filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.id === value.id)
          ),
      }),
      () => {
        // Reference: https://stackoverflow.com/questions/28314368/how-to-maintain-state-after-a-page-refresh-in-react-js Accessed: 1/16/22
        localStorage.setItem(
          "MyReads",
          JSON.stringify(this.state.shelvedBooks)
        );
      }
    );
    this.updateBooks();
  };
  moveShelvedBook = (id, shelf) => {
    this.state.shelvedBooks.filter((book) => book.id === id)[0].shelf = shelf;
    // Reference: https://stackoverflow.com/questions/28314368/how-to-maintain-state-after-a-page-refresh-in-react-js Accessed: 1/16/22
    localStorage.setItem("MyReads", JSON.stringify(this.state.shelvedBooks));
    this.updateBooks();
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
                  <SearchedBook book={book} moveBook={this.moveSearchedBook} />
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
