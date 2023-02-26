import React, { useState, useEffect } from "react";
import axios from "axios";

import LoadingSpinner from "./components/loadingSpinner";
import NoResults from "./components/noResults";
import Book from "./components/book";

import {
  Box,
  Container,
  Grid,
  Snackbar,
  Stack,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";

interface BookInfo {
  title: string;
  author_name: string[];
  isbn: string[];
}

const SearchBook: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BookInfo[]>([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
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
    book: BookInfo,
    tab: "reading" | "wantToRead" | "read" | "didNotFinish"
  ) => {
    switch (tab) {
      case "reading":
        setReading([...reading, book]);
        localStorage.setItem("reading", JSON.stringify([...reading, book]));
        setSnackbarMessage(`Added '${book.title}' to Reading List`);
        break;
      case "wantToRead":
        setWantToRead([...wantToRead, book]);
        localStorage.setItem(
          "wantToRead",
          JSON.stringify([...wantToRead, book])
        );
        setSnackbarMessage(`Added '${book.title}' to Want to Read List`);
        break;
      case "read":
        setRead([...read, book]);
        localStorage.setItem("read", JSON.stringify([...read, book]));
        setSnackbarMessage(`Added '${book.title}' to Read List`);
        break;
      case "didNotFinish":
        setDidNotFinish([...didNotFinish, book]);
        localStorage.setItem(
          "didNotFinish",
          JSON.stringify([...didNotFinish, book])
        );
        setSnackbarMessage(`Added '${book.title}' to Did Not Finish List`);
        break;
    }
    setSnackbarSeverity("success");
    setShowSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
    setSnackbarMessage("");
    setSnackbarSeverity("success");
  };

  const removeBook = (
    book: BookInfo,
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
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          margin: "0 auto",
          mt: 2,
        }}
      >
        <form onSubmit={handleSearch}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Search for an author"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="contained"
              type="submit"
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              type="button"
              onClick={clearSearch}
              startIcon={<DeleteIcon />}
            >
              Clear
            </Button>
          </Stack>
        </form>
      </Box>
      {loading && <LoadingSpinner />}
      {shouldDisplayNoResult && <NoResults />}
      {!loading && results.length > 0 && (
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {results.map((book: BookInfo) => {
              const coverSrc = `https://covers.openlibrary.org/b/isbn/${book.isbn?.[0]}-M.jpg?default=false`;
              return (
                <Grid
                  item
                  key={book.isbn ? book.isbn[0] : book.title}
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <Book
                    title={book.title}
                    author={book.author_name.join(", ")}
                    cover={coverSrc}
                    isbn={book.isbn?.[0]}
                    children={
                      <>
                        <Stack
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                          spacing={2}
                        >
                          <Button
                            variant="outlined"
                            onClick={() => addBook(book, "reading")}
                          >
                            Add to reading
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => addBook(book, "wantToRead")}
                          >
                            Add to want to read
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => addBook(book, "read")}
                          >
                            Add to read
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => addBook(book, "didNotFinish")}
                          >
                            Add to didn't finish
                          </Button>
                        </Stack>
                      </>
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
      )}
      <div>
        <h2>Reading</h2>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {reading.map((book: BookInfo) => {
              const coverSrc = `https://covers.openlibrary.org/b/isbn/${book.isbn?.[0]}-M.jpg?default=false`;
              return (
                <Grid
                  item
                  key={book.isbn ? book.isbn[0] : book.title}
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <Book
                    title={book.title}
                    author={book.author_name.join(", ")}
                    cover={coverSrc}
                    isbn={book.isbn?.[0]}
                    children={
                      <>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeBook(book, "reading")}
                        >
                          Remove
                        </Button>
                      </>
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </div>
      <div>
        <h2>Want to read</h2>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {wantToRead.map((book: BookInfo) => {
              const coverSrc = `https://covers.openlibrary.org/b/isbn/${book.isbn?.[0]}-M.jpg?default=false`;
              return (
                <Grid
                  item
                  key={book.isbn ? book.isbn[0] : book.title}
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <Book
                    title={book.title}
                    author={book.author_name.join(", ")}
                    cover={coverSrc}
                    isbn={book.isbn?.[0]}
                    children={
                      <>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeBook(book, "wantToRead")}
                        >
                          Remove
                        </Button>
                      </>
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </div>
      <div>
        <h2>Read</h2>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {read.map((book: BookInfo) => {
              const coverSrc = `https://covers.openlibrary.org/b/isbn/${book.isbn?.[0]}-M.jpg?default=false`;
              return (
                <Grid
                  item
                  key={book.isbn ? book.isbn[0] : book.title}
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <Book
                    title={book.title}
                    author={book.author_name.join(", ")}
                    cover={coverSrc}
                    isbn={book.isbn?.[0]}
                    children={
                      <>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeBook(book, "read")}
                        >
                          Remove
                        </Button>
                      </>
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </div>
      <div>
        <h2>Didn't finish</h2>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {didNotFinish.map((book: BookInfo) => {
              const coverSrc = `https://covers.openlibrary.org/b/isbn/${book.isbn?.[0]}-M.jpg?default=false`;
              return (
                <Grid
                  item
                  key={book.isbn ? book.isbn[0] : book.title}
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <Book
                    title={book.title}
                    author={book.author_name.join(", ")}
                    cover={coverSrc}
                    isbn={book.isbn?.[0]}
                    children={
                      <>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeBook(book, "didNotFinish")}
                        >
                          Remove
                        </Button>
                      </>
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default SearchBook;
