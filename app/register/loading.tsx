import React from "react";
import { AuthSkeleton } from "@/components/skeletons/AuthSkeleton";

export default function RegisterLoading() {
  return <AuthSkeleton mode="register" />;
}
