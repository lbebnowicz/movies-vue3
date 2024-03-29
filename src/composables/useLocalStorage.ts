import { TMovieData } from "@/types/movies";

export function getFavorites(): TMovieData[] {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}

export function addFavorite(movie: TMovieData): void {
    const favorites = getFavorites();
    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

export function removeFavorite(movie: TMovieData): void {
    let favorites = getFavorites();
    favorites = favorites.filter((e: any) => e.id !== movie.id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
