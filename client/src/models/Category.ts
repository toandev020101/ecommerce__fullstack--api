export interface Category {
  id: number;
  imageUrl: string;
  name: string;
  slug: string;
  level: number;
  parentId?: string;
  isActive: number;
  parent?: {
    id: number;
    name: string;
  };
}
