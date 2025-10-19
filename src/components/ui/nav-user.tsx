"use client";

import { ChevronsUpDown, LogOut, Moon, Settings, Sun } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import { logout } from "@/store/authSlice";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { showToast } from "@/store/toastSlice";
import { useTheme } from "next-themes";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    profilePicture: string;
  };
}) {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const router = useRouter();
  const { setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      const res = await api.post("/api/auth/logout");

      if (res.status === 200) {
        dispatch(logout());
        dispatch(
          showToast({
            title: "Logout Successfully",
            showCloseIcon: true,
            state: "success",
            show: true,
          })
        );
        router.push("/login");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.message || "Fail to logout");
    }

    dispatch(logout());
  };

  const handleGetInitials = (name: string) => {
    if (!name) {
      return "";
    }

    return name
      .split(" ")
      .map((letter) => letter.slice(0, 1))
      .join("");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.profilePicture || undefined}
                  alt={user.name}
                />
                <AvatarFallback className="rounded-lg">{`${handleGetInitials(
                  user.name
                )}`}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.profilePicture || undefined}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">{`${handleGetInitials(
                    user.name
                  )}`}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all  dark:-rotate-90" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:-rotate-90" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Settings className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all  dark:-rotate-90" />
              System
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
