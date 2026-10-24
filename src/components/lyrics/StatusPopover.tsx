import React, { useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

interface StatusPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: 'draft' | 'proses' | 'release';
  onSelectStatus: (status: 'draft' | 'proses' | 'release') => void;
}

export const StatusPopover: React.FC<StatusPopoverProps> = ({
  isOpen,
  onClose,
  currentStatus,
  onSelectStatus,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const options: { key: 'draft' | 'proses' | 'release'; label: string; desc: string; badgeColor: string }[] = [
    { key: 'draft', label: 'Draft', desc: 'Ide awal / konsep dasar', badgeColor: 'bg-[#78716C]' },
    { key: 'proses', label: 'Proses', desc: 'Sedang direvisi & dipoles', badgeColor: 'bg-amber-500' },
    { key: 'release', label: 'Release', desc: 'Lagu final & rampung', badgeColor: 'bg-emerald-500' },
  ];

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1.5 w-52 bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl shadow-lg p-1.5 z-40 animate-scale-up space-y-0.5"
    >
      <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C]">
        Status Progres
      </div>
      {options.map((opt) => {
        const isSelected = currentStatus === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => {
              onSelectStatus(opt.key);
              onClose();
            }}
            className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition cursor-pointer text-xs ${
              isSelected ? 'bg-[#F5F4EE] font-bold text-[#1C1917]' : 'hover:bg-[#FAF9F5] text-[#44403C]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${opt.badgeColor}`} />
              <div>
                <div className="font-semibold text-xs">{opt.label}</div>
                <div className="text-[10px] text-[#78716C] font-normal leading-none mt-0.5">{opt.desc}</div>
              </div>
            </div>
            {isSelected && <Check className="w-3.5 h-3.5 text-[#1C1917] shrink-0" />}
          </button>
        );
      })}
    </div>
  );
};
