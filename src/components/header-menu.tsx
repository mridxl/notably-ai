"use client";

import { ModeToggle } from "./theme-switcher";
import { signout } from "@/app/(auth)/actions";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/useMobile";

export default function HeaderMenu({ email }: { email: string | undefined }) {
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center gap-4">
      {!isMobile && (
        <p
          className="max-w-[14rem] truncate text-sm md:max-w-xs"
          title={email ?? undefined}
        >
          <span className="wave">👋</span> Hello, {email ?? "User"}!
        </p>
      )}
      <ModeToggle />
      <form action={signout}>
        <Button type="submit" variant="neutral" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
