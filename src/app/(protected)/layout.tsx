import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import HeaderMenu from "@/components/header-menu";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-svh h-svh w-full flex-col">
      <header className="border-border bg-header-background border-b">
        <div className="mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/notes" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Notes"
                width="32"
                height="32"
                className="rounded-md"
              />
              <span className="decoration-foreground after:bg-foreground relative text-xl font-bold after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100">
                Notes
              </span>
            </Link>
          </div>

          <HeaderMenu email={user.email} />
        </div>
      </header>

      <main className="layout-container mx-auto flex-1">{children}</main>
    </div>
  );
}
