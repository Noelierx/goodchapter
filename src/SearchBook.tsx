import React, { useState } from "react";
import axios from "axios";

interface Book {
  title: string;
  author_name: string[];
  isbn: string[];
}

const SearchBook: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [reading, setReading] = useState<Book[]>([]);
  const [wantToRead, setWantToRead] = useState<Book[]>([]);
  const [read, setRead] = useState<Book[]>([]);
  const [didNotFinish, setDidNotFinish] = useState<Book[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.get(
      `http://openlibrary.org/search.json?author=${searchTerm}`
    );
    setResults(response.data.docs);
  };

  const addBook = (book: Book, tab: "reading" | "wantToRead" | "read" | "didNotFinish") => {
    switch (tab) {
      case "reading":
        setReading([...reading, book]);
        break;
      case "wantToRead":
        setWantToRead([...wantToRead, book]);
        break;
      case "read":
        setRead([...read, book]);
        break;
      case "didNotFinish":
        setDidNotFinish([...didNotFinish, book]);
        break;
    }
  };

  const removeBook = (book: Book, tab: "reading" | "wantToRead" | "read" | "didNotFinish") => {
    switch (tab) {
      case "reading":
        setReading(reading.filter((b) => b.isbn[0] !== book.isbn[0]));
        break;
      case "wantToRead":
        setWantToRead(wantToRead.filter((b) => b.isbn[0] !== book.isbn[0]));
        break;
      case "read":
        setRead(read.filter((b) => b.isbn[0] !== book.isbn[0]));
        break;
      case "didNotFinish":
        setDidNotFinish(didNotFinish.filter((b) => b.isbn[0] !== book.isbn[0]));
        break;
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map((book) => (
          <li key={book.isbn ? book.isbn[0] : book.title}>
            {book.title} by {book.author_name.join(", ")}
            <button onClick={() => addBook(book, "reading")}>Add to reading</button>
            <button onClick={() => addBook(book, "wantToRead")}>Add to want to read</button>
            <button onClick={() => addBook(book, "read")}>Add to read</button>
            <button onClick={() => addBook(book, "didNotFinish")}>Add to didn't finish</button>
          </li>
        ))}
      </ul>
      <div>
        <h2>Reading</h2>
        <ul>
          {reading.map((book) => (
            <li key={book.isbn ? book.isbn[0] : book.title}>
              {book.title} by {book.author_name.join(", ")}
              <button onClick={() => removeBook(book, "reading")}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Want to read</h2>
        <ul>
          {wantToRead.map((book) => (
            <li key={book.isbn ? book.isbn[0] : book.title}>
              {book.title} by {book.author_name.join(", ")}
              <button onClick={() => removeBook(book, "wantToRead")}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Read</h2>
        <ul>
          {read.map((book) => (
            <li key={book.isbn ? book.isbn[0] : book.title}>
              {book.title} by {book.author_name.join(", ")}
              <button onClick={() => removeBook(book, "read")}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Didn't finish</h2>
        <ul>
          {didNotFinish.map((book) => (
            <li key={book.isbn ? book.isbn[0] : book.title}>
              {book.title} by {book.author_name.join(", ")}
              <button onClick={() => removeBook(book, "didNotFinish")}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBook;
