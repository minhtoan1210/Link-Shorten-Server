export function caculatePages(count: number, limit: number) {
  return count % limit > 0 ? Math.floor(count / limit) + 1 : count / limit;
}
