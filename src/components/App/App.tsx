import { useState } from "react";
import type { ComponentType } from "react";
import type { Movie } from "../../types/movie.ts";
import {
  fetchMovies,
  type FetchMoviesResponse,
} from "../../services/movieService.ts";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import SearchBar from "../SearchBar/SearchBar.tsx";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import { useQuery } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from "./App.module.css";
import { Toaster } from "react-hot-toast";
type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isError, isLoading } = useQuery<FetchMoviesResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== "",
  });

  const handleSearch = (nextQuery: string) => {
    setQuery(nextQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const movies = data?.results ?? [];
  const totalPages = data?.totalPages ?? 0;
  const hasNoResults =
    query.trim() !== "" && !isLoading && !isError && movies.length === 0;

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {hasNoResults && (
        <ErrorMessage message="No movies were found for your request." />
      )}
      {movies.length > 0 && !isLoading && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {selectedMovie !== null && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <Toaster />
    </>
  );
}
