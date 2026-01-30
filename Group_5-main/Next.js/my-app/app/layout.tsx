import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lab 1: Login Page",
  description: "FPT University Lab 1 Submission",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Thêm suppressHydrationWarning={true} vào thẻ body.
        Lệnh này giúp React "bỏ qua" sự khác biệt do các Extension (như dịch trang, chặn quảng cáo)
        tự ý chèn code lạ vào body, từ đó sửa được lỗi màn hình đỏ.
      */}
      <body
        className="antialiased"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}