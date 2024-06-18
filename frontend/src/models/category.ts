export interface Category {
  _id: string;
  name: string;
  slug: { current: string }; // inside slug
  image: string;
  subtitle: string;
}
