const TOTAL_ITEMS = 1000;
const arr = new Array(TOTAL_ITEMS).fill(true).map((_, i) => ({
  id: i,
}));

export const mockFetch = async (page: number, pageSize: number) => {
  const items = arr.slice(pageSize * (page - 1), pageSize * page);
  const result = {
    items,
    pagination: {
      pageSize,
      page,
      totalItems: TOTAL_ITEMS,
    },
  };
  return result;
};
