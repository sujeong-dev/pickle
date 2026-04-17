import { Suspense } from "react";
import { KakaoCallbackPage } from "@/pages/login";

export default function Page() {
  return (
    <Suspense>
      <KakaoCallbackPage />
    </Suspense>
  );
}
