import { Category } from "@/models/category";
import sanityClient from "./sanity";
import { Games } from "@/models/games";

export const getCategories = async (): Promise<Category[]> => {
  const query = `*[_type == "category"] {
    _id,
    name,
    slug{current},
    image,
    subtitle,
 }`;
  const categories: Category[] = await sanityClient.fetch({ query });

  return categories;
};

export const getGames = async (): Promise<Games[]> => {
  const query = `*[_type == "game"]{
    name,
    price,
    images,
    isFeatured,
    isTrending,
    'category': *[ _id == ^.category._ref][0]{
        name,
        slug{
            current
        }
    },
    slug,
    quantity,
    description,
    }`;
  const games: Games[] = await sanityClient.fetch({ query });

  return games;
};

export const getCategoriesGames = async (slug: string): Promise<Games[]> => {
  const query = `*[_type == "game" && category->slug.current == "${slug}"]{
    name,
    price,
    images,
    isFeatured,
    isTrending,
    'category': *[ _id == ^.category._ref][0]{
        name,
        subtitle,
    },
    slug,
    quantity,
    description,
    }`;
  const games: Games[] = await sanityClient.fetch({ query });

  return games;
};

export const getCategory = async (slug: string): Promise<Category> => {
  const query = `*[_type == "category" && slug.current == "${slug}" ][0]`;
  const categories: Category = await sanityClient.fetch({ query });
  return categories;
};

export const getRecentGames = async (): Promise<Games[]> => {
  const query = `*[_type == "game"]| order(_createdAt desc)[0... 4]{
    name,
    price,
    images,
    isFeatured,
    isTrending,
    'category': *[ _id == ^.category._ref][0]{
        name,
        slug{
            current
        }
    },
    slug,
    quantity,
    description,
    }`;
  const games: Games[] = await sanityClient.fetch({ query });

  return games;
};

export const getGame = async (slug: string): Promise<Games> => {
  const query = `*[_type == "game" && slug.current == "${slug}" ][0]{
    _id,
    name,
    price,
    images,
    isFeatured,
    isTrending,
    'category': *[ _id == ^.category._ref][0]{
        name,
        slug{
            current
        }
    },
    slug,
    quantity,
    description,
  }`;
  const game: Games = await sanityClient.fetch({ query });
  return game;
};
