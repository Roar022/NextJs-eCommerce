import { constants } from "buffer";

export interface Games {
  _id: string;
  name: string;
  price: number;
  images: Array<{
    _key: string;
    url: string;
  }>;
  isFeatured: boolean;
  isTrending: boolean;
  category: { name: string; slug: { current: string } };
  slug: { current: string };
  quantity: number;
  description: string;
}

export type GameSubset = Pick<
  Games,
  "_id" | "price" | "quantity" | "images" | "name"
> & { maxQuantity: number };
