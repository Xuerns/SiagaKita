import React from "react";
import { AuthSkeleton } from "@/components/skeletons/AuthSkeleton";

export default function LoginLoading() {
  return <AuthSkeleton mode="login" />;
}
