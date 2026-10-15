import React, { useState, useEffect } from "react";
import { CheckSquare, Check, Save, HardDrive } from "lucide-react";
import { ChecklistItem } from "@/types";
import { initialChecklistItems } from "@/data/mockDisasterData";
import { 
  migrateChecklistFromLocalStorage, 
  saveOfflineChecklist 
} from "@/lib/offline/db";

export function TasSiagaChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(initialChecklistItems);
  const [savedNotification, setSavedNotification] = useState(false);

  // Load from IndexedDB (with legacy localStorage migration)
  useEffect(() => {
    let mounted = true;
    migrateChecklistFromLocalStorage(initialChecklistItems).then((loaded) => {
      if (mounted && loaded) {
        setItems(loaded);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const toggleItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      // Auto-save perubahan ke IndexedDB di latar belakang
      saveOfflineChecklist(updated);
      return updated;
    });
  };

  const handleSave = async () => {
    await saveOfflineChecklist(items);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F2]">
        <div>
          <h3 className="text-sm font-bold text-[#17211D] flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#176B4D]" />
            <span>Checklist Tas Siaga Bencana (TSB)</span>
          </h3>
          <p className="text-[11px] text-[#68756E] mt-0.5">
            Perlengkapan wajib untuk bertahan mandiri selama 72 jam pertama darurat.
          </p>
        </div>

        <div className="text-right">
          <span className="text-sm font-bold text-[#176B4D]">
            {completedCount}/{items.length}
          </span>
          <span className="text-[10px] text-[#929D96] block font-medium">Siap</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-4">
        <div className="w-full bg-[#F1F4F2] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#176B4D] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items list */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`flex items-start justify-between p-3 rounded-[12px] border cursor-pointer transition-all select-none ${
              item.completed
                ? "bg-[#E5F5EA]/50 border-[#CDD7D1]"
                : "bg-[#F8FAF9] border-[#E6EBE8] hover:bg-[#F1F8F3]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                  item.completed
                    ? "bg-[#176B4D] border-[#176B4D] text-white"
                    : "bg-white border-[#CDD7D1]"
                }`}
              >
                {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div>
                <span
                  className={`text-xs font-semibold block ${
                    item.completed
                      ? "text-[#104A35] line-through opacity-75"
                      : "text-[#17211D]"
                  }`}
                >
                  {item.label}
                </span>
                {item.sublabel && (
                  <span className="text-[10px] text-[#68756E] block mt-0.5">
                    {item.sublabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer controls & Persistence Indicator */}
      <div className="mt-5 pt-3 border-t border-[#F1F4F2] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-[#68756E]">
          <HardDrive className="w-3.5 h-3.5 text-[#176B4D]" />
          <span>Tersimpan di IndexedDB perangkat ini (Offline Ready)</span>
        </div>

        <button
          onClick={handleSave}
          className="py-2 px-4 rounded-[10px] bg-[#176B4D] hover:bg-[#104A35] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Simpan Checklist</span>
        </button>
      </div>

      {savedNotification && (
        <div className="mt-2 text-center text-xs text-[#176B4D] font-semibold bg-[#E5F5EA] py-1.5 rounded-lg border border-[#CDD7D1] animate-in fade-in">
          ✓ Progres checklist berhasil disimpan secara lokal!
        </div>
      )}
    </div>
  );
}
