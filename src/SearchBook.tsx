import React, { useState, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import useSearch from "./hooks/useSearch";
import LoadingSpinner from "./components/loadingSpinner";
import NoResults from "./components/noResults";
import Book from "./components/book";
import { BookInfo } from "./types";

import {
  Box,
  Container,
  Grid,
  Snackbar,
  Stack,
  TextField,
  Button,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";

const SearchBook: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"author" | "title" | "isbn">(
    "author"
  );
  const [tab, setTab] = useState(0); // 0 = Search, 1 = Reading, 2 = WantToRead, 3 = Read, 4 = DidNotFinish

  const [reading, setReading] = useLocalStorage<BookInfo[]>("reading", []);
  const [wantToRead, setWantToRead] = useLocalStorage<BookInfo[]>(
    "wantToRead",
    []
  );
  const [read, setRead] = useLocalStorage<BookInfo[]>("read", []);
  const [didNotFinish, setDidNotFinish] = useLocalStorage<BookInfo[]>(
    "didNotFinish",
    []
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { loading, results, handleSearch } = useSearch();

  // Debounce automatique quand on tape (uniquement quand l'onglet Search est actif)
  useEffect(() => {
    if (tab !== 0) return;
    const id = setTimeout(() => {
      if (searchTerm.trim()) handleSearch(searchTerm.trim(), searchType);
    }, 600);
    return () => clearTimeout(id);
  }, [searchTerm, searchType, tab, handleSearch]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const addBook = (
    book: BookInfo,
    list: "reading" | "wantToRead" | "read" | "didNotFinish"
  ) => {
    switch (list) {
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

  const removeBook = (
    book: BookInfo,
    list: "reading" | "wantToRead" | "read" | "didNotFinish"
  ) => {
    const filterBooks = (books: BookInfo[]) =>
      books.filter((b) => {
        const bIsbn = b.isbn && b.isbn.length > 0 ? b.isbn[0] : undefined;
        const targetIsbn = book.isbn && book.isbn.length > 0 ? book.isbn[0] : undefined;

        // Si les deux ont un ISBN, on compare par ISBN
        if (bIsbn !== undefined && targetIsbn !== undefined) {
          return bIsbn !== targetIsbn;
        }

        // Sinon on compare par titre + premier auteur (si présents)
        const sameTitle = b.title === book.title;
        const bAuthor = b.author_name && b.author_name.length > 0 ? b.author_name[0] : "";
        const targetAuthor = book.author_name && book.author_name.length > 0 ? book.author_name[0] : "";
        if (sameTitle && bAuthor && targetAuthor) {
          return bAuthor !== targetAuthor;
        }

        // Si aucune clé utile, conserver l'élément (ne pas supprimer tout)
        return true;
      });

    switch (list) {
      case "reading":
        setReading(filterBooks(reading));
        break;
      case "wantToRead":
        setWantToRead(filterBooks(wantToRead));
        break;
      case "read":
        setRead(filterBooks(read));
        break;
      case "didNotFinish":
        setDidNotFinish(filterBooks(didNotFinish));
        break;
    }
  };

  const shouldDisplayNoResult =
    !loading && results.length === 0 && searchTerm !== "";

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

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

      {/* Onglets */}
      <Box sx={{ width: "100%", bgcolor: "background.paper", mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          centered
        >
          <Tab label="Search" />
          <Tab label="Reading" />
          <Tab label="Want to read" />
          <Tab label="Read" />
          <Tab label="Didn't finish" />
        </Tabs>
      </Box>

      {/* Panel Search */}
      {tab === 0 && (
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchTerm.trim(), searchType);
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label={`Search by ${searchType}`}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel id="search-type-label">Type</InputLabel>
                <Select
                  labelId="search-type-label"
                  value={searchType}
                  label="Type"
                  onChange={(e) =>
                    setSearchType(e.target.value as "author" | "title" | "isbn")
                  }
                >
                  <MenuItem value="author">Author</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="isbn">ISBN</MenuItem>
                </Select>
              </FormControl>
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

          {loading && <LoadingSpinner />}
          {shouldDisplayNoResult && <NoResults />}

          {!loading && results.length > 0 && (
            <Container sx={{ py: 8 }} maxWidth="md">
              <Grid container spacing={4}>
                {results.map((book: BookInfo) => {
                  // Priorité : ISBN (si présent) -> cover_i -> pas d'image
                  const coverSrc =
                    book.isbn && book.isbn.length > 0
                      ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg?default=false`
                      : book.cover_i
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                      : "";
                  return (
                    <Grid
                      item
                      key={book.isbn && book.isbn.length > 0 ? book.isbn[0] : book.title}
                      xs={12}
                      sm={6}
                      md={4}
                    >
                      <Book
                        title={book.title}
                        author={(book.author_name || []).join(", ")}
                        cover={coverSrc || undefined}
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
        </Box>
      )}

      {/* Panels listes (Reading, WantToRead, Read, DidNotFinish) */}
      {tab === 1 && (
        <div>
          <h2>Reading</h2>
          <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
              {reading.map((book: BookInfo) => {
                const coverSrc =
                  book.isbn && book.isbn.length > 0
                    ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg?default=false`
                    : book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "";
                return (
                  <Grid
                    item
                    key={book.isbn && book.isbn.length > 0 ? book.isbn[0] : book.title}
                    xs={12}
                    sm={6}
                    md={4}
                  >
                    <Book
                      title={book.title}
                      author={(book.author_name || []).join(", ")}
                      cover={coverSrc || undefined}
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
      )}

      {tab === 2 && (
        <div>
          <h2>Want to read</h2>
          <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
              {wantToRead.map((book: BookInfo) => {
                const coverSrc =
                  book.isbn && book.isbn.length > 0
                    ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg?default=false`
                    : book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "";
                return (
                  <Grid
                    item
                    key={book.isbn && book.isbn.length > 0 ? book.isbn[0] : book.title}
                    xs={12}
                    sm={6}
                    md={4}
                  >
                    <Book
                      title={book.title}
                      author={(book.author_name || []).join(", ")}
                      cover={coverSrc || undefined}
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
      )}

      {tab === 3 && (
        <div>
          <h2>Read</h2>
          <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
              {read.map((book: BookInfo) => {
                const coverSrc =
                  book.isbn && book.isbn.length > 0
                    ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg?default=false`
                    : book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "";
                return (
                  <Grid
                    item
                    key={book.isbn && book.isbn.length > 0 ? book.isbn[0] : book.title}
                    xs={12}
                    sm={6}
                    md={4}
                  >
                    <Book
                      title={book.title}
                      author={(book.author_name || []).join(", ")}
                      cover={coverSrc || undefined}
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
      )}

      {tab === 4 && (
        <div>
          <h2>Didn't finish</h2>
          <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
              {didNotFinish.map((book: BookInfo) => {
                const coverSrc =
                  book.isbn && book.isbn.length > 0
                    ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg?default=false`
                    : book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "";
                return (
                  <Grid
                    item
                    key={book.isbn && book.isbn.length > 0 ? book.isbn[0] : book.title}
                    xs={12}
                    sm={6}
                    md={4}
                  >
                    <Book
                      title={book.title}
                      author={(book.author_name || []).join(", ")}
                      cover={coverSrc || undefined}
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
      )}
    </div>
  );
};

export default SearchBook;
