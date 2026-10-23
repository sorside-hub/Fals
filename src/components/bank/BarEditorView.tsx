import React, { useState, useMemo } from 'react';
import { BarItem, BarCategory } from '../../types';
import { countSyllablesInLine } from '../../utils/syllableCounter';
import { BarWritingToolbar } from './BarWritingToolbar';
import {
  ArrowLeft,
  Save,
  Send,
  Copy,
  Check,
  Tag,
  Plus,
  X
} from 'lucide-react';

interface BarEditorViewProps {
  bar: BarItem;
  onSaveBar: (updatedBar: BarItem) => void;
  onBack: () => void;
  onSendToLyric?: (text: string) => void;
}

export const BarEditorView: React.FC<BarEditorViewProps> = ({
  bar,
  onSaveBar,
  onBack,
  onSendToLyric,
}) => {
  const [text, setText] = useState(bar.text);
  const [category, setNewCategory] = useState<BarCategory>(bar.category);
  const [rhymeScheme, setRhymeScheme] = useState<string>(bar.rhymeScheme || 'AABB');
  const [tags, setTags] = useState<string[]>(bar.tags || []);
  const [tagInput, setTagInput] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  // Line-by-line live syllable calculation
  const linesInfo = useMemo(() => {
    const rawLines = text.split('\n');
    return rawLines.map((line, idx) => {
      const syllables = countSyllablesInLine(line);
      return {
        lineNum: idx + 1,
        lineText: line,
        syllables,
        isEmpty: line.trim() === '',
      };
    });
  }, [text]);

  const totalSyllables = useMemo(() => {
    return linesInfo.reduce((sum, l) => sum + l.syllables, 0);
  }, [linesInfo]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = () => {
    const updated: BarItem = {
      ...bar,
      text: text.trim(),
      category,
      rhymeScheme,
      syllableCount: totalSyllables,
      tags,
    };
    onSaveBar(updated);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleSend = () => {
    handleSave();
    if (onSendToLyric) {
      onSendToLyric(text);
    }
  };

  const handleDismissKeyboard = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#FAF9F5] min-h-[calc(100vh-140px)] animate-fade-in">
      {/* 1. Sticky Minimalist Context Header */}
      <div className="sticky top-0 z-20 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E5E4DE] pb-3 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-3 py-1">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F5F4EE] px-2.5 py-1.5 rounded-lg border border-[#E5E4DE] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#57534E]" />
            <span>Kembali ke Bank Bar</span>
          </button>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg text-xs font-mono">
              <span className="text-[#78716C]">Kategori:</span>
              <select
                value={category}
                onChange={(e) => setNewCategory(e.target.value as BarCategory)}
                className="bg-transparent font-semibold text-[#1C1917] outline-hidden cursor-pointer"
              >
                <option value="punchline">Punchline</option>
                <option value="rhyme">Rima & Flow</option>
                <option value="hook">Ide Hook / Chorus</option>
                <option value="metaphor">Metafora & Kata</option>
                <option value="idea">Catatan Konsep</option>
              </select>
            </div>

            {/* Rhyme Scheme selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg text-xs font-mono">
              <span className="text-[#78716C]">Rima:</span>
              <select
                value={rhymeScheme}
                onChange={(e) => setRhymeScheme(e.target.value)}
                className="bg-transparent font-semibold text-[#1C1917] outline-hidden cursor-pointer"
              >
                <option value="AABB">AABB</option>
                <option value="ABAB">ABAB</option>
                <option value="AAAA">AAAA</option>
                <option value="Internal">Internal Rhyme</option>
                <option value="Free">Free Flow</option>
              </select>
            </div>

            {/* Syllable Counter Badge */}
            <span className="text-xs font-mono text-[#78716C] px-1.5 py-0.5 rounded bg-[#F5F4EE] border border-[#E5E4DE]">
              {totalSyllables} suku kata
            </span>
          </div>
        </div>

        {/* Action Buttons Strip */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#FFFFFF] hover:bg-[#F5F4EE] border border-[#E5E4DE] rounded-lg transition cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#57534E]" />
                  <span>Salin Bar</span>
                </>
              )}
            </button>

            {savedNotification && (
              <span className="text-xs font-mono text-emerald-600 font-semibold animate-fade-in">
                ✓ Tersimpan
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onSendToLyric && (
              <button
                onClick={handleSend}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F5F4EE] text-[#1C1917] border border-[#E5E4DE] rounded-lg text-xs font-medium transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#57534E]" />
                <span className="hidden sm:inline">Kirim ke Lirik</span>
              </button>
            )}

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1C1917] hover:bg-[#292524] text-[#FAF9F5] rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Bar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Self-Contained Modular Toolbar (Desktop sticky strip + Mobile docked keyboard accessory) */}
      <BarWritingToolbar
        variant="auto"
        rhymeScheme={rhymeScheme}
        onSelectRhymeScheme={setRhymeScheme}
        onDismissKeyboard={handleDismissKeyboard}
      />

      {/* 3. Full-Screen Writing Canvas */}
      <div className="relative flex flex-1 w-full min-h-[480px] bg-[#FAF9F5] paper-pattern mt-1">
        {/* Left Column: Line Numbers & Live Syllable Count */}
        <div className="w-12 sm:w-16 shrink-0 py-3 select-none border-r border-[#E5E4DE]/60 bg-[#FAF9F5] font-mono text-[11px] text-[#A8A29E] flex flex-col items-center leading-[2.5rem]">
          {linesInfo.map((l) => (
            <div key={l.lineNum} className="h-[2.5rem] flex items-center justify-between w-full px-1.5 sm:px-2">
              <span className="text-[10px] text-[#A8A29E]">{l.lineNum}</span>
              {l.syllables > 0 ? (
                <span
                  className="text-[10px] font-medium px-1 rounded bg-[#EAE8DF] text-[#44403C]"
                  title={`${l.syllables} suku kata`}
                >
                  {l.syllables}k
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {/* Textarea matching line-height with left column, full width */}
        <div className="flex-1 py-3 px-2 sm:px-6 md:px-8">
          <textarea
            rows={Math.max(10, linesInfo.length + 2)}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis baris kata, rima, atau punchline di sini...&#10;Setiap baris baru akan dihitung suku katanya di margin kiri secara otomatis."
            className="w-full h-full bg-transparent border-none outline-hidden text-[#1C1917] text-[16px] sm:text-[17px] leading-[2.5rem] resize-none font-normal placeholder:text-[#A8A29E]"
            autoFocus
          />
        </div>
      </div>

      {/* 4. Integrated Tags Section */}
      <div className="py-3 border-t border-[#E5E4DE]/70 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#78716C]">
          <span className="flex items-center gap-1.5 uppercase font-mono text-[11px]">
            <Tag className="w-3.5 h-3.5" />
            <span>Label & Tagging Bar</span>
          </span>
          <span className="text-[11px] font-mono">{tags.length} tag</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {tags.map(t => (
            <span
              key={t}
              className="flex items-center gap-1 text-xs font-mono bg-[#FFFFFF] border border-[#E5E4DE] text-[#1C1917] px-2.5 py-1 rounded-lg"
            >
              <span>#{t}</span>
              <button
                onClick={() => handleRemoveTag(t)}
                className="hover:text-rose-600 transition cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Add tag input */}
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Tambah tag..."
              className="w-24 sm:w-32 px-2.5 py-1 text-xs bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg outline-hidden text-[#1C1917] focus:border-[#1C1917]"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="p-1 rounded bg-[#FFFFFF] hover:bg-[#F5F4EE] border border-[#E5E4DE] text-[#1C1917] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
