"use client";

import React from "react";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
  type: "submit" | "button" | "reset";
}

const Button = ({ text, type }: ButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <button
      type={type}
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {pending ? "로딩 중" : text}
    </button>
  );
};

export default Button;
