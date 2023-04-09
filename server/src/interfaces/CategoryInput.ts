export interface CategoryInput {
  imageUrl: string;
  name: string;
  slug: string;
  level: number;
  parentId?: number;
  isActive: number;
}
