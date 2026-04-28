"use client";

import { useEffect } from "react";
import { Toast } from "@/shared/ui";
import { useToastStore } from "@/shared/model";

export function LoginToast() {
  const message = useToastStore((s) => s.message);
  const visible = useToastStore((s) => s.visible);
  const hide = useToastStore((s) => s.hide);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(hide, 3000);
    return () => clearTimeout(timer);
  }, [visible, hide]);

  return <Toast message={message} visible={visible} className="bg-gray-800 text-white" />;
}
