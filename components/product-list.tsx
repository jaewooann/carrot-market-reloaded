"use client";

import { useState } from "react";
import ListProduct from "./list-product";
import { InitialProducts } from "@/app/(tabs)/products/page";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      <button>Load more</button>
    </div>
  );
}
