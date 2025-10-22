import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { BookInfo } from "../types";

const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BookInfo[]>([]);
  const requestIdRef = useRef(0);

  const handleSearch = useCallback(
    async (
      searchTerm: string,
      type: "author" | "title" | "isbn" = "author"
    ) => {
      if (!searchTerm) {
        setResults([]);
        return;
      }

      const id = ++requestIdRef.current;
      setLoading(true);

      try {
        const param =
          type === "author" ? "author" : type === "title" ? "title" : "isbn";
        const response = await axios.get(
          `https://openlibrary.org/search.json?${param}=${encodeURIComponent(
            searchTerm
          )}`
        );

        const docs = Array.isArray(response.data?.docs)
          ? (response.data.docs as unknown[])
          : [];

        const normalized: BookInfo[] = docs.map((doc) => {
          const d = doc as Record<string, unknown>;

          const title =
            typeof d.title === "string"
              ? d.title
              : typeof d.title_suggest === "string"
              ? d.title_suggest
              : "Untitled";

          const author_name = Array.isArray(d.author_name)
            ? (d.author_name as string[]).filter((a) => typeof a === "string")
            : [];

          const isbn = Array.isArray(d.isbn)
            ? (d.isbn as string[]).filter((i) => typeof i === "string")
            : [];

          const cover_i =
            typeof d.cover_i === "number" ? (d.cover_i as number) : undefined;

          return {
            title,
            author_name,
            isbn,
            cover_i,
          } as BookInfo;
        });

        // n'appliquer la réponse que si c'est la plus récente
        if (requestIdRef.current === id) {
          setResults(normalized);
        }
      } catch (error) {
        console.error("Error fetching results", error);
        if (requestIdRef.current === id) {
          setResults([]);
        }
      } finally {
        if (requestIdRef.current === id) {
          setLoading(false);
        }
      }
    },
    [setLoading, setResults]
  );

  return { loading, results, handleSearch };
};

export default useSearch;
