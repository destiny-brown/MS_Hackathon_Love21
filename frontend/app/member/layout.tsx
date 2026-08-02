import { AccountLayout } from "@/components/layouts/account-layout";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountLayout allowedRoles={["member"]} title="Member area">
      {children}
    </AccountLayout>
  );
}
