import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Bell } from "lucide-react";
import { Settings } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { auth } from "@/lib/auth";

export const IconButtonConfig = {
  size: 20,
  strokeWidth: 1.5,
};

export async function DashboardHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="flex justify-between items-center mb-5">
      <SearchBar />
      <div className="flex items-center gap-3">
        <UserAvatar src={user?.image} name={user?.name} />
        <Button variant="outline">
          <Bell
            size={IconButtonConfig.size}
            strokeWidth={IconButtonConfig.strokeWidth}
          />
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.DASHBOARD_SETTINGS}>
            <Settings
              size={IconButtonConfig.size}
              strokeWidth={IconButtonConfig.strokeWidth}
            />
          </Link>
        </Button>
      </div>
    </header>
  );
}

