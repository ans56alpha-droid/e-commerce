interface Pagination {
  page: number;
  limit: number;
  skip: number;
}

export function buildPagination(
  page?: number,
  limit?: number
): Pagination {
  const resolvedPage = page ?? 1;
  const resolvedLimit = limit ?? 8;
  const skip = (resolvedPage - 1) * resolvedLimit;

  return {
    page: resolvedPage,
    limit: resolvedLimit,
    skip,
  };
}
