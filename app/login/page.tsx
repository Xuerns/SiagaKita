import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Masuk - SiagaKita | Kesiapsiagaan Bencana",
  description: "Masuk ke akun SiagaKita untuk akses notifikasi peringatan dini bencana, rute evakuasi offline, dan koordinasi komunitas.",
};

export default function LoginPage() {
  return <AuthLayout initialMode="login" />;
}
