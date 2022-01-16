import React, { Component } from "react";
import PropTypes from "prop-types";

import ShelvedBook from "./ShelvedBook";

class Bookshelf extends Component {
  constructor(props) {
    super(props);
    this.moveBook = this.moveBook.bind(this);
  }
  moveBook(id, shelf) {
    this.props.moveBook(id, shelf);
  }
  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.books.map((book) => {
              return (
                <li key={book.id}>
                  <ShelvedBook book={book} moveBook={this.moveBook} />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    );
  }
}

Bookshelf.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  moveBook: PropTypes.func.isRequired,
};

export default Bookshelf;
