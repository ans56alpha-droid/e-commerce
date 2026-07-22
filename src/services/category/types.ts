export interface CreateCategoryInput {
    name: string;
  
    description?: string;
  
    image?: string;
  
    isFeatured?: boolean;
  
    isActive?: boolean;
  
    sortOrder?: number;
  }
  
  export type UpdateCategoryInput =
    Partial<CreateCategoryInput>;
  
  export interface CategoryFilters {
    featured?: boolean;
  
    active?: boolean;
  }