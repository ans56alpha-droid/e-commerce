
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
  
    price: number;
    compareAtPrice?: number;
  
    image: string;
  
    rating: number;
    reviewCount: number;
  
    category: string;
  
    featured: boolean;
    isNew: boolean;
  
    stock: number;
}


export interface ProductDetails {
    id: string;
  
    name: string;
  
    slug: string;
  
    shortDescription: string;
  
    description: string;
  
    price: number;
  
    compareAtPrice?: number;
  
    brand?: string;
  
    stock: number;
  
    images: {
      url: string;
      alt: string;
      isPrimary: boolean;
    }[];
  
    specifications: {
      key: string;
      value: string;
    }[];
  
    category: {
      id: string;
      name: string;
      slug: string;
    };
   
    tags: string[];

    rating: number;

    reviewCount: number;
}