import { Suspense } from "react";
import { ReviewPage } from "@/pages/review";

export default function Page() {
  return (
    <Suspense>
      <ReviewPage />
    </Suspense>
  );
}
