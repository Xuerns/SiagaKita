"use client";

import React, { useContext } from "react";
import {
  Home,
  Map,
  AlertTriangle,
  FileText,
  ShieldAlert,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarContext,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "@/components/layout/SidebarLogo";
import { SidebarUserMenu } from "@/components/layout/SidebarUserMenu";
import { cn } from "@/lib/utils";

export type NavTab =
  | "beranda"
  | "peta"
  | "peringatan"
  | "laporan"
  | "mitigasi"
  | "pengaturan"
  | "tokens";

export interface DesktopSidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  warningCount?: number;
  className?: string;
  onTestRiskAlert?: () => void;
}

// Shared item styling: centered + fixed square when collapsed.
const itemBase =
  "rounded-[10px] px-3 text-[13px] font-medium transition-colors cursor-pointer " +
  "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center";
const labelHide = "group-data-[collapsible=icon]:hidden";

function InnerDesktopSidebar({
  currentTab,
  onSelectTab,
  warningCount = 1,
  className,
  onTestRiskAlert,
}: DesktopSidebarProps) {
  const { isMobile } = useSidebar();

  // Pada layar mobile, sidebar ditiadakan dan digantikan oleh MobileBottomNav
  if (isMobile) {
    return null;
  }

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "beranda", label: "Beranda", icon: Home },
    { id: "peta", label: "Peta Evakuasi", icon: Map },
    { id: "laporan", label: "Laporan Warga", icon: FileText },
    { id: "mitigasi", label: "Mitigasi", icon: ShieldAlert },
  ];

  const stateClass = (active: boolean) =>
    active
      ? "bg-[#E5F5EA] text-[#176B4D] font-semibold"
      : "text-[#68756E] hover:bg-[#F5F7F6] hover:text-[#17211D]";

  return (
    <Sidebar
      collapsible="icon"
      className={cn("border-r border-[#E6EBE8] bg-white select-none", className)}
    >
      <SidebarHeader className="p-3 group-data-[collapsible=icon]:px-2">
        <SidebarLogo onClick={() => onSelectTab("beranda")} />
      </SidebarHeader>

      <SidebarSeparator className="mx-2 w-auto bg-[#F1F4F2]" />

      <SidebarContent className="px-2">
        <SidebarGroup className="p-0 pt-2">
          <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#929D96]">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                const hasBadge = item.badge !== undefined && item.badge > 0;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => onSelectTab(item.id as NavTab)}
                      className={cn(itemBase, "h-10 gap-2.5", stateClass(isActive))}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          isActive ? "text-[#176B4D]" : "text-[#929D96]"
                        )}
                      />
                      <span className={cn("truncate", labelHide)}>{item.label}</span>
                    </SidebarMenuButton>
                    {hasBadge && (
                      <>
                        <SidebarMenuBadge className="top-2.5! min-w-[18px] rounded-full bg-[#D64545] px-1.5 text-[10px] font-bold text-white peer-hover/menu-button:text-white peer-data-active/menu-button:text-white">
                          {item.badge}
                        </SidebarMenuBadge>
                        {/* Collapsed: red dot on the icon */}
                        <span className="pointer-events-none absolute right-2 top-2 hidden size-2 rounded-full bg-[#D64545] ring-2 ring-white group-data-[collapsible=icon]:block" />
                      </>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {onTestRiskAlert && (
          <SidebarGroup className="p-0 pt-4">
            <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#929D96]">
              Mode Pengujian
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Tes Pop-up Peringatan Tinggi"
                    onClick={onTestRiskAlert}
                    className={cn(
                      itemBase,
                      "h-10 gap-2.5 text-[#B71C1C] hover:bg-[#FDECEC] hover:text-[#991B1B] bg-[#FFF5F5] border border-red-200/80 font-medium"
                    )}
                  >
                    <AlertTriangle className="size-4 shrink-0 text-[#D64545]" />
                    <span className={cn("truncate font-semibold text-xs", labelHide)}>
                      Tes Pop-up Siaga
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-[#F1F4F2] p-2">
        <SidebarUserMenu onOpenSettings={() => onSelectTab("pengaturan")} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export function DesktopSidebar(props: DesktopSidebarProps) {
  const hasProvider = useContext(SidebarContext);

  if (!hasProvider) {
    return (
      <SidebarProvider className="min-h-screen w-auto shrink-0">
        <InnerDesktopSidebar {...props} />
      </SidebarProvider>
    );
  }

  return <InnerDesktopSidebar {...props} />;
}