import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RoleSwitcher } from "@/components/RoleSwitcher";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar className="relative w-full" />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className={cn("min-h-screen transition-all duration-300 lg:ml-64")}>
        {/* Top Bar with Role Switcher */}
        <div className="sticky top-0 z-30 flex items-center justify-end border-b bg-background/95 backdrop-blur px-6 py-3">
          <RoleSwitcher />
        </div>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}