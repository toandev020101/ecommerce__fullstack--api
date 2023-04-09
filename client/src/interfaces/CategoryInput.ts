export interface CategoryInput {
  imageUrl: string;
  name: string;
  slug: string;
  level: number | string;
  parentId?: number | string;
  isActive: number;
}
