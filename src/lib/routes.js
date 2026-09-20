export function routeHref(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
