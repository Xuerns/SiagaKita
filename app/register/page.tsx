import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Daftar Akun - SiagaKita | Kesiapsiagaan Bencana",
  description: "Daftar akun SiagaKita sebagai Warga atau Relawan untuk memantau risiko bencana dan melindungi sesama.",
};

export default function RegisterPage() {
  return <AuthLayout initialMode="register" />;
}
