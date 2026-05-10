"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  PlusCircle,
  Scale,
  Home as HomeIcon,
  Utensils,
  Menu,
  Target,
  BarChart3,
  LogOut,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { logOut } from "@/components/auth-client";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const today = new Date();

  if (pathname === "/signin" || pathname === "/signup") {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-2 mb-4">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 ${pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <HomeIcon className="h-6 w-6" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link
            href={`/logfood/${formatDate(today)}`}
            className="flex flex-col items-center gap-1 -mt-8"
          >
            <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Utensils className="h-8 w-8 text-primary-foreground" />
            </div>
          </Link>

          <Link
            href="/weight"
            className={`flex flex-col items-center gap-1 ${pathname === "/weight" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Scale className="h-6 w-6" />
            <span className="text-[10px] font-medium">Weight</span>
          </Link>

          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="h-6 w-6" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </div>

      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            className="fixed bottom-20 left-4 right-4 max-w-2xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card border border-border rounded-2xl p-2 shadow-lg space-y-1">
              <Link
                href="/favs"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setShowMoreMenu(false)}
              >
                <Heart className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">My Favs</span>
              </Link>
              <Link
                href="/goals"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setShowMoreMenu(false)}
              >
                <Target className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Goals</span>
              </Link>
              <Link
                href="/memain"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setShowMoreMenu(false)}
              >
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Stats</span>
              </Link>
              <Link
                href="/logweight"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setShowMoreMenu(false)}
              >
                <PlusCircle className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Log Weight</span>
              </Link>
              <button
                onClick={async () => {
                  setShowMoreMenu(false);
                  alert("1: starting logout");
                  try {
                    alert("2: calling signOut");
                    await logOut();
                    alert("3: signOut done");
                    router.push("/signin");
                  } catch (error) {
                    alert("4: error: " + error);
                    console.error("Logout failed:", error);
                  }
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors w-full text-left text-red-500"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
