import axios from "axios";
import type { Movie } from "../types/types.ts";

interface FetchMoviesApiResponse {
  results: Movie[];
  total_pages: number;
}

export interface FetchMoviesResponse {
  results: Movie[];
  totalPages: number;
}

const token = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (
  query: string,
  page: number = 1,
): Promise<FetchMoviesResponse> => {
  const options = {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
  const response = await axios.get<FetchMoviesApiResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    options,
  );
  return {
    results: response.data.results,
    totalPages: response.data.total_pages,
  };
};
