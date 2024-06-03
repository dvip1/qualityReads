import { SlugUrl } from "./data";
const isValidSlug = (slug: string) => {
    return SlugUrl.includes(slug);
};
export default isValidSlug;