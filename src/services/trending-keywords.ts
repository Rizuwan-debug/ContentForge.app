/**
 * Represents a trending keyword.
 */
export interface TrendingKeyword {
  /**
   * The keyword text.
   */
  keyword: string;

  /**
   * The search volume of the keyword.
   */
  searchVolume: number;
}

/**
 * Asynchronously retrieves trending keywords for a given category.
 *
 * @param category The category for which to retrieve trending keywords.
 * @returns A promise that resolves to an array of TrendingKeyword objects.
 */
export async function getTrendingKeywords(category: string): Promise<TrendingKeyword[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      keyword: 'example keyword 1',
      searchVolume: 1000,
    },
    {
      keyword: 'example keyword 2',
      searchVolume: 2000,
    },
  ];
}
