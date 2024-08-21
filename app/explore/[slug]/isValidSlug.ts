export default function isValid(slug: string) {
    const SlugURL = ["tags"]
    return SlugURL.includes(slug);
}