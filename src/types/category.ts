export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    description?: string;
    productCount: number;
}

export interface CategoryOption {
    id: string;
    name: string;
}

export interface CategoryDetail {
    id: string;
    name: string;
    slug: string;
    description?: string;
}