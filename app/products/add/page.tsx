"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { FormEvent, useState } from "react";
import { uploadProduct } from "./actions";
import { MB, PLZ_ADD_PHOTO } from "@/lib/constants";
import { useFormState } from "react-dom";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [state, action] = useFormState(uploadProduct, null);

  const isOverSizeImage = (file: File) => {
    if (file.size > 2 * MB) {
      alert("파일 크기가 2MB를 초과했습니다.");
      return true;
    }
    return false;
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    const file = files[0];
    if (isOverSizeImage(file)) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const onSubmitData = (event: FormEvent) => {
    if (!preview) {
      event.preventDefault();
      alert(PLZ_ADD_PHOTO);
      return;
    }
  };

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
