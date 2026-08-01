import { AccountLayout } from "@/components/layouts/account-layout";

export default function SupporterLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountLayout allowedRoles={["supporter"]} title="Supporter dashboard">
      {children}
    </AccountLayout>
  );
}
