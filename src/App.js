import React, { Component } from "react";
// import * as BooksAPI from './BooksAPI'
import "./App.css";

import { get, getAll, update, search } from "./BooksAPI";
import Bookshelf from "./components/Bookshelf";
import Book from "./components/Book";

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
    // Source: https://stackoverflow.com/questions/28314368/how-to-maintain-state-after-a-page-refresh-in-react-js Referenced: 1/13/22
    this.state = {
      query: "",
      bookResults: null,
      books: JSON.parse(localStorage.getItem("books")) || [
        {
          id: 1,
          shelf: "currentlyReading",
          backgroundImage: `url("http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api")`,
          title: "To Kill a Mockingbird",
          authors: ["Harper Lee"],
        },
        {
          id: 2,
          shelf: "currentlyReading",
          backgroundImage: `url("http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api")`,
          title: "Ender's Game",
          authors: ["Orson Scott Card"],
        },
        {
          id: 3,
          shelf: "wantToRead",
          backgroundImage:
            'url("http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api")',
          title: "1776",
          authors: ["David McCullough"],
        },
        {
          id: 4,
          shelf: "wantToRead",
          backgroundImage:
            'url("http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api")',
          title: "Harry Potter and the Sorcerer's Stone",
          authors: ["J.K. Rowling"],
        },
        {
          id: 5,
          shelf: "read",
          backgroundImage:
            'url("http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api")',
          title: "The Hobbit",
          authors: ["J.R.R.Tolkien"],
        },
        {
          id: 6,
          shelf: "read",
          backgroundImage:
            'url("http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE712CA0cBYP8VKbEcIVEuFJRdX1k30rjLM29Y-dw_qU1urEZ2cQ42La3Jkw6KmzMmXIoLTr50SWTpw6VOGq1leINsnTdLc_S5a5sn9Hao2t5YT7Ax1RqtQDiPNHIyXP46Rrw3aL8&source=gbs_api")',
          title: "Oh, the Places You'll Go!",
          authors: ["Seuss"],
        },
        {
          id: 7,
          shelf: "read",
          backgroundImage:
            'url("http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api")',
          title: "The Adventures of Tom Sawyer",
          authors: ["Mark Twain"],
        },
      ],
    };
    this.moveBook = this.moveBook.bind(this);
  }
  moveBook(id, shelf) {
    // Source: https://stackoverflow.com/questions/28314368/how-to-maintain-state-after-a-page-refresh-in-react-js Referenced: 1/13/22
    this.setState(
      (prevState) => ({
        books: prevState.books
          .filter((book) => book.id !== id)
          .concat({
            ...prevState.books.filter((book) => book.id === id)[0],
            shelf: shelf,
          }),
      }),
      () => {
        localStorage.setItem("books", JSON.stringify(this.state.books));
      }
    );
  }
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
          var index = 0;
          this.setState({
            bookResults: books
              .filter((book) => book.imageLinks !== undefined)
              .map((book) => {
                const searchResult = {
                  index: index++,
                  shelf: "none",
                  backgroundImage:
                    `url(` + book.imageLinks.smallThumbnail + `)`,
                  title: book.title,
                  authors: book.authors === undefined ? [] : book.authors,
                };
                return (
                  <li key={index++}>
                    <Book book={searchResult} moveBook={this.moveBook} />
                  </li>
                );
              }),
          });
        } else {
          this.setState({
            bookResults: [],
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
              <ol className="books-grid">{this.state.bookResults}</ol>
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
                  moveBook={this.moveBook}
                />
                <Bookshelf
                  title={"Want to Read"}
                  books={this.state.books.filter(
                    (book) => book.shelf === "wantToRead"
                  )}
                  moveBook={this.moveBook}
                />
                <Bookshelf
                  title={"Read"}
                  books={this.state.books.filter(
                    (book) => book.shelf === "read"
                  )}
                  moveBook={this.moveBook}
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
