import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "./components/loadingSpinner";
import NoResults from "./components/noResults";

interface Book {
  title: string;
  author_name: string[];
  isbn: string[];
}

const SearchBook: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Book[]>([]);
  const [reading, setReading] = useState(
    JSON.parse(localStorage.getItem("reading") || "[]")
  );
  const [wantToRead, setWantToRead] = useState(
    JSON.parse(localStorage.getItem("wantToRead") || "[]")
  );
  const [read, setRead] = useState(
    JSON.parse(localStorage.getItem("read") || "[]")
  );
  const [didNotFinish, setDidNotFinish] = useState(
    JSON.parse(localStorage.getItem("didNotFinish") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("reading", JSON.stringify(reading));
    localStorage.setItem("wantToRead", JSON.stringify(wantToRead));
    localStorage.setItem("read", JSON.stringify(read));
    localStorage.setItem("didNotFinish", JSON.stringify(didNotFinish));
  }, [reading, wantToRead, read, didNotFinish]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await axios.get(
      `https://openlibrary.org/search.json?author=${searchTerm}`
    );
    setResults(response.data.docs);
    setLoading(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
  };

  const addBook = (
    book: Book,
    tab: "reading" | "wantToRead" | "read" | "didNotFinish"
  ) => {
    switch (tab) {
      case "reading":
        setReading([...reading, book]);
        localStorage.setItem("reading", JSON.stringify([...reading, book]));
        break;
      case "wantToRead":
        setWantToRead([...wantToRead, book]);
        localStorage.setItem("reading", JSON.stringify([...wantToRead, book]));
        break;
      case "read":
        setRead([...read, book]);
        localStorage.setItem("reading", JSON.stringify([...read, book]));
        break;
      case "didNotFinish":
        setDidNotFinish([...didNotFinish, book]);
        localStorage.setItem(
          "reading",
          JSON.stringify([...didNotFinish, book])
        );
        break;
    }
  };

  const removeBook = (
    book: Book,
    tab: "reading" | "wantToRead" | "read" | "didNotFinish"
  ) => {
    switch (tab) {
      case "reading":
        setReading(reading.filter((b: any) => b.isbn[0] !== book.isbn[0]));
        break;
      case "wantToRead":
        setWantToRead(
          wantToRead.filter((b: any) => b.isbn[0] !== book.isbn[0])
        );
        break;
      case "read":
        setRead(read.filter((b: any) => b.isbn[0] !== book.isbn[0]));
        break;
      case "didNotFinish":
        setDidNotFinish(
          didNotFinish.filter((b: any) => b.isbn[0] !== book.isbn[0])
        );
        break;
    }
  };

  const shouldDisplayNoResult =
    !loading && results.length === 0 && searchTerm !== "";

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={clearSearch}>
          Clear
        </button>
      </form>
      {loading && <LoadingSpinner />}
      {shouldDisplayNoResult && <NoResults />}
      {!loading && results.length > 0 && (
        <ul>
          {results.map((book: Book) => (
            <li key={book.isbn ? book.isbn[0] : book.title}>
              {book.title} by {book.author_name.join(", ")}
              <button onClick={() => addBook(book, "reading")}>
                Add to reading
              </button>
              <button onClick={() => addBook(book, "wantToRead")}>
                Add to want to read
              </button>
              <button onClick={() => addBook(book, "read")}>Add to read</button>
              <button onClick={() => addBook(book, "didNotFinish")}>
                Add to didn't finish
              </button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h2>Reading</h2>
        <ul>
          {reading.map((book: Book) => (
            <li key={book.isbn ? book.isbn[0] : book.title}>
              {book.title} by {book.author_name.join(", ")}
              <button onClick={() => removeBook(book, "reading")}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Want to read</h2>
        <ul>
          {wantToRead.map((book: Book) => (
            <li key={book.isbn ? book.isbn[0] : book.title}>
              {book.title} by {book.author_name.join(", ")}
              <button onClick={() => removeBook(book, "wantToRead")}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Read</h2>
        <ul>
          {read.map((book: Book) => (
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
          {didNotFinish.map((book: Book) => (
            <li key={book.isbn ? book.isbn[0] : book.title}>
              {book.title} by {book.author_name.join(", ")}
              <button onClick={() => removeBook(book, "didNotFinish")}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBook;
