import { Suspense } from "react";
import { SignUpPage } from "@/pages/sign-up";

export default function Page() {
  return (
    <Suspense>
      <SignUpPage />
    </Suspense>
  );
}