"use client";

import React from "react";
import deleteProductAction from "./delete.action";
import { useRouter } from "next/navigation";

interface ProductDeleteButtonProps {
  productId: number;
}

const ProductDeleteButton = ({ productId }: ProductDeleteButtonProps) => {
  const router = useRouter();
  const handleDelete = async () => {
    const res = await deleteProductAction(productId);

    if (res) {
      alert("삭제되었습니다.");
      router.replace("/products");
    } else {
      alert("실패했습니다.");
    }
  };
  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold"
    >
      Delete Product
    </button>
  );
};

export default ProductDeleteButton;
