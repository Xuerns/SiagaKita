import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SiagaKita API & Backend',
  description: 'Backend services and DTOs for SiagaKita',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
