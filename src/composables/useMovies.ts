import { ref } from 'vue';
import { getFavorites, addFavorite, removeFavorite } from './useLocalStorage';
import { GET_MOVIES_GENRES, GET_MOVIES_POPULAR } from './useMoviesCalls';
import useApi from '@composables/useApi';

const moviesTrends = ref([]);
const moviesGenres = ref([]);
const end = ref(false);
const currentPage = ref(1);
const favorites = ref(getFavorites());

const loadGenres = async (genre: number[], page: number = 1) => {
    try {
        const response = await useApi(GET_MOVIES_GENRES, {
            query: {
                with_genres: !genre.includes(0) ? genre.join("|") : null,
                page: page,
            }
        })

        if (page <= 1) moviesGenres.value = response.data.results;
        else moviesGenres.value = moviesGenres.value.concat(response.data.results);
        if (response.data.total_pages === page) end.value = true;
        else end.value = false;

        currentPage.value = page;
        return response;
    } catch (err) {
        console.error(err);
    }
};

const loadTrends = async () => {
    try {
        const response = await useApi(GET_MOVIES_POPULAR);

        moviesTrends.value = response.data.results.slice(0, 4);
        return response;
    } catch (err) {
        console.error(err);
    }
}

const addFavoriteMovie = (movie: any) => {
    addFavorite(movie);
    favorites.value.push(movie);
};

const removeFavoriteMovie = (movie: any) => {
    removeFavorite(movie);
    favorites.value = favorites.value.filter((e: any) => e.id !== movie.id);
};

export default {
    moviesTrends,
    moviesGenres,
    end,
    currentPage,
    loadGenres,
    loadTrends,
    favorites,
    addFavoriteMovie,
    removeFavoriteMovie,
};
