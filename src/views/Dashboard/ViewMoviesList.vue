<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { CategoriesTabs, MovieCard } from "@/app.organizer";
import { TCategoryItem } from "@/types/movies";
import { ROUTE_DASHBOARD_MOVIES_LIST } from "@/app.routes";
import useMovies from "@/composables/useMovies";
import { useRoute, useRouter } from 'vue-router'

const router = useRouter();
const route = useRoute();
const storeMovies = useMovies;

const refInfiniteList = ref<HTMLElement | null>(null);
const currentTab = ref<TCategoryItem | null>(null);
const isLoadingNextPage = ref(false);
const categories = ref([ //todo move it to separate file
    {
        name: "All",
        value: [28, 16, 12, 35, 99],
    },
    {
        name: "Action",
        value: [28],
    },
    {
        name: "Animation",
        value: [16],
    },
    {
        name: "Adventure",
        value: [12],
    },
    {
        name: "Comedy",
        value: [35],
    },
    {
        name: "Documentary",
        value: [99],
    },
]);

const currentPage = computed(() => storeMovies.currentPage.value);
const moviesGenres = computed(() => storeMovies.moviesGenres.value);
const end = computed(() => storeMovies.end.value);

const getCategory = (name: string): TCategoryItem | undefined => {
    return categories.value.find((e: any) => e.name === name);
};

const getGenres = async (genre: number[], page: number = 1) => {
    await storeMovies.loadGenres(genre, page);
};

const onChangeTab = (tab: TCategoryItem): void => {
    const route = {
        name: ROUTE_DASHBOARD_MOVIES_LIST.name,
        query: { genre: tab.name },
    };
    currentTab.value = tab;
    storeMovies.loadGenres(tab.value, 1);
    router.push(route);
};

const handleScroll = async (event: any) => {
    const { target } = event;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - (400 * currentPage.value)) {
        if (!end.value && !isLoadingNextPage.value) {
            isLoadingNextPage.value = true;
            const category = currentTab.value || null;
            if (category) await storeMovies.loadGenres(category.value, currentPage.value + 1);
            isLoadingNextPage.value = false;
        }
    }
};

onMounted(() => {
    const queryGenre = route.query.genre || null;
    if (queryGenre) {
        let categoryQuery = getCategory(queryGenre as string);
        if (categoryQuery) currentTab.value = categoryQuery;
    } else {
        currentTab.value = categories.value[0];
    }

    refInfiniteList.value = refInfiniteList.value as HTMLElement;
    const category = currentTab.value;
    if (category) getGenres(category.value, currentPage.value);
});
</script>

<template>
  <div class="db-movies-list flex-1 flex flex-col p-1 pt-16">
    <CategoriesTabs
      :items="categories"
      @onChange="onChangeTab"
      :value="currentTab"
      class="a-04 fadeInDown"
    />
    <div
      ref="refInfiniteList"
      class="a-07 fadeInUp h-10 overflow-y-scroll flex-auto"
      @scroll="handleScroll"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <MovieCard
          v-for="(movie, index) in moviesGenres"
          :key="'m-' + index"
          :data="movie"
        />
      </div>
    </div>
  </div>
</template>
