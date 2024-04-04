export interface tagsResponse {
  items: {
    has_synonyms: boolean;
    is_moderator_only: boolean;
    is_required: boolean;
    count: number;
    name: string;
  }[];
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
  /**
   * required &filter=!nNPvSNVZJS in query
   */
  total: number;
}
