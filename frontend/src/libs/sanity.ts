import SanityClient from "next-sanity-client";
export const fetchCache = 'force-no-store'
export const revalidate = 0 // seconds
export const dynamic = 'force-dynamic'
const sanityClient = new SanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_STUDIO_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_STUDIO_DATASET as string,
  useCdn: process.env.NODE_ENV === "development",
});
export default sanityClient;
