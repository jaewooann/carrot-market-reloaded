"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { FormEvent, useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { MB, PLZ_ADD_PHOTO } from "@/lib/constants";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType, productSchema } from "./schema";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const isOverSizeImage = (file: File) => {
    if (file.size > 2 * MB) {
      alert("파일 크기가 2MB를 초과했습니다.");
      return true;
    }
    return false;
  };

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    const file = files[0];
    if (isOverSizeImage(file)) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/aSbksvJjax-AUC7qVnaC4A/${id}`
      );
    }
  };

  const onSubmit = handleSubmit(async (data: ProductType) => {
    // upload image to cloudflare
    if (!file) {
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      return;
    }

    // replace `photo` in formData
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);
    formData.append("photo", data.photo);

    // call upload product.
    return uploadProduct(formData);
  });

  const onValid = async () => {
    await onSubmit();
  };

  console.log(register("title"));

  return (
    <div>
      <form action={onValid} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          style={{ backgroundImage: `url(${preview})` }}
          className="bg-center bg-cover border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer"
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                {PLZ_ADD_PHOTO}
                {errors.photo?.message}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          type="text"
          placeholder="제목"
          required
          {...register("title")}
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          type="number"
          placeholder="가격"
          required
          {...register("price")}
          errors={[errors.price?.message ?? ""]}
        />
        <Input
          type="text"
          placeholder="자세한 설명"
          required
          {...register("description")}
          errors={[errors.description?.message ?? ""]}
        />
        <Button type="submit" text="작성 완료" />
      </form>
    </div>
  );
}
