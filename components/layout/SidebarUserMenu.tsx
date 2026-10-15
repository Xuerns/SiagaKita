"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, LogOut, Settings, UserCheck } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { cn, getUserInitials, getUserRoleLabel } from "@/lib/utils";

interface SidebarUserMenuProps {
  onOpenSettings: () => void;
}

/**
 * Profile trigger + popover living in the sidebar footer.
 * Expanded: avatar + name/role, menu opens above.
 * Collapsed: centered avatar only, menu opens to the right.
 */
export function SidebarUserMenu({ onOpenSettings }: SidebarUserMenuProps) {
  const { user, isGuest, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initials = getUserInitials(user?.nama, "WG");
  const roleLabel = getUserRoleLabel(user, isGuest);

  const RoleIcon = UserCheck;
  const name = user?.nama || "Pengguna Siaga";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={name}
        className={cn(
          "flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] p-1.5 text-left transition-colors hover:bg-[#F5F7F6]",
          open && "bg-[#F5F7F6]",
          "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#176B4D] text-xs font-semibold text-white ring-2 ring-[#E5F5EA]">
          {initials}
        </span>
        <span className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
          <span className="truncate text-xs font-semibold leading-tight text-[#17211D]">{name}</span>
          <span className="flex items-center gap-0.5 truncate text-[10px] text-[#68756E]">
            <RoleIcon className="size-2.5 shrink-0 text-[#176B4D]" />
            {roleLabel}
          </span>
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-[#929D96] group-data-[collapsible=icon]:hidden" />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 w-56 rounded-[14px] border border-[#E6EBE8] bg-white py-2 shadow-xl animate-in fade-in zoom-in-95 duration-150",
            "bottom-full left-0 mb-2",
            "group-data-[collapsible=icon]:bottom-0 group-data-[collapsible=icon]:left-full group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:ml-3"
          )}
        >
          <div className="border-b border-[#F1F4F2] px-3.5 pb-2">
            <div className="truncate text-xs font-bold text-[#17211D]">{name}</div>
            <div className="truncate text-[11px] text-[#68756E]">
              {user?.email || (isGuest ? "Sesi Tamu Terbatas" : "Tanpa Email")}
            </div>
            <span
              className={cn(
                "mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold",
                isGuest ? "bg-[#FEF1E6] text-[#C96B10]" : "bg-[#E5F5EA] text-[#176B4D]"
              )}
            >
              {roleLabel}
            </span>
          </div>

          <div className="pt-1">
            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onOpenSettings();
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3.5 py-2 text-left text-xs text-[#17211D] transition-colors hover:bg-[#F8FAF9]"
            >
              <Settings className="size-3.5 text-[#68756E]" />
              Pengaturan & Profil
            </button>

            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3.5 py-2 text-left text-xs text-[#68756E] transition-colors hover:bg-[#F8FAF9]"
            >
              <LogOut className="size-3.5" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
