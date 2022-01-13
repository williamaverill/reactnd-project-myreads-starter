import React, { Component } from "react";
import PropTypes from "prop-types";

class Book extends Component {
  constructor(props) {
    super(props);
    this.state = { shelfValue: this.props.book.shelf };
    this.shelfChange = this.shelfChange.bind(this);
  }
  shelfChange(event) {
    this.setState({ shelfValue: event.target.value }, () =>
      this.props.moveBook(this.props.book.id, this.state.shelfValue)
    );
  }
  render() {
    return (
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 188,
              backgroundImage: this.props.book.backgroundImage,
            }}
          />
          <div className="book-shelf-changer">
            <select value={this.state.shelfValue} onChange={this.shelfChange}>
              <option value="move" disabled>
                Move to...
              </option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{this.props.book.title}</div>
        <div className="book-authors">{this.props.book.author}</div>
      </div>
    );
  }
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
  moveBook: PropTypes.func.isRequired,
};

export default Book;
