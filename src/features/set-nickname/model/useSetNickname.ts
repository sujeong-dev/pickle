"use client";

import { useState } from "react";

const NICKNAME_REGEX = /^[a-zA-Z가-힣0-9_]{2,12}$/;

export function useSetNickname() {
  const [nickname, setNickname] = useState("");

  const isValid = NICKNAME_REGEX.test(nickname);

  function handleClear() {
    setNickname("");
  }

  return { nickname, setNickname, isValid, handleClear };
}
