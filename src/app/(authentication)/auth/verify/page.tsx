import TokenVerification from "@/components/Authentication/TokenVerification";
import { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <TokenVerification />
      </Suspense>
    </div>
  );
};

export default page;
