import { CategoryMap } from "./types";
import { createShoes } from "./shoes";
import { createElectronics } from "./electronics";
import { createMen } from "./men";
import { createWomen } from "./women";

export function createProductSeed(
  categories: CategoryMap
) {

  const shoes = createShoes(categories);

  console.log("Shoes count:", shoes.length);
  console.log(shoes.map((p) => p.name));

  return [
    ...createShoes(categories),
    ...createElectronics(categories),
    ...createMen(categories),
    ...createWomen(categories),
  ];
}