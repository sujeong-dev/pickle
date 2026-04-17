import { Suspense } from "react";
import { NaverCallbackPage } from "@/pages/login";

export default function Page() {
  return (
    <Suspense>
      <NaverCallbackPage />
    </Suspense>
  );
}
