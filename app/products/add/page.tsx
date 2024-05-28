"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { FormEvent, useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { MB, PLZ_ADD_PHOTO } from "@/lib/constants";
import { useFormState } from "react-dom";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [imageId, setImageId] = useState("");

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
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setImageId(id);
    }
  };

  const onSubmitData = (event: FormEvent) => {
    if (!preview) {
      event.preventDefault();
      alert(PLZ_ADD_PHOTO);
      return;
    }
  };

  const interceptAction = async (_: any, formData: FormData) => {
    // upload image to cloudflare
    const file = formData.get("photo");
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
    const photoUrl = `https://imagedelivery.net/aSbksvJjax-AUC7qVnaC4A/${imageId}`;
    formData.set("photo", photoUrl);

    // call upload product.
    return uploadProduct(_, formData);
  };
  const [state, action] = useFormState(interceptAction, null);

  return (
    <div>
      <form
        action={action}
        onSubmit={onSubmitData}
        className="p-5 flex flex-col gap-5"
      >
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
                {state?.fieldErrors.photo}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input
          name="title"
          type="text"
          placeholder="제목"
          required
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          type="number"
          placeholder="가격"
          required
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          type="text"
          placeholder="자세한 설명"
          required
          errors={state?.fieldErrors.description}
        />
        <Button type="submit" text="작성 완료" />
      </form>
    </div>
  );
}
