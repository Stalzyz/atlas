import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atlas Enterprise Engine | The Omnichannel Operating System",
  description: "Scale your commerce and control your empire with the Atlas Enterprise Ecommerce Engine.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
