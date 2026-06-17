import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Bell } from "lucide-react";
import { Settings } from "lucide-react";

export const IconButtonConfig = {
  size: 20,
  strokeWidth: 1.5,
};

export function DashboardHeader() {
  return (
    <header className="flex justify-between items-center mb-5">
      <SearchBar />
      <div className="flex items-center gap-3">
        <UserAvatar />
        <Button variant="outline">
          <Bell
            size={IconButtonConfig.size}
            strokeWidth={IconButtonConfig.strokeWidth}
          />
        </Button>
        <Button variant="outline">
          <Settings
            size={IconButtonConfig.size}
            strokeWidth={IconButtonConfig.strokeWidth}
          />
        </Button>
      </div>
    </header>
  );
}
