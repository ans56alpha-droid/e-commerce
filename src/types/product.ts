// export interface Product {
//     id: string;
//     name: string;
//     slug: string;
//     price: number;
//     image: string;
//     category: string;
//     featured: boolean;
//     rating: number;
// }


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
  
    inStock: boolean;
}
