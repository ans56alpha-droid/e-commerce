export interface Wishlist {
    productIds: string[];
  }
  
  export function mapWishlist(
    productIds: string[]
  ): Wishlist {
    return {
      productIds,
    };
  }