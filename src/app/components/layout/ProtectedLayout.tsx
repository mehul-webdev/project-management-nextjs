"use client";

import React, { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const ProtectedLayoutUi = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <p>
                Small steps every day lead to big achievements tomorrow. Stay
                consistent and keep moving forward.
              </p>
            </div>
          </header>
          <Card className="m-4 h-full">
            <CardContent>{children}</CardContent>
          </Card>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default ProtectedLayoutUi;
