import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import StyledComponentsRegistry from "./_lib/registry";
import { UserProvider } from "./utils/userContext";
import { ProductProvider } from "@/app/utils/productContex";
const poppins = Poppins({ weight: "500", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Desafio Ti Saude",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <ProductProvider>
      <html lang="en" style={{ padding: 0, margin: 0 }}>
        <body className={poppins.className} style={{ padding: 0, margin: 0 }}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </body>
      </html>
      </ProductProvider>
    </UserProvider>
  );
}
