import React, { useEffect, useState, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { countSyllablesInLine } from '../utils/syllableCounter';
import { CHROMATIC_NOTES } from '../utils/musicTheory';
import { SongDraft } from '../types';
import { LyricWritingToolbar } from './lyrics/LyricWritingToolbar';
import { ChordBadgeNode } from './lyrics/ChordBadgeExtension';
import { ChordInspectionModal } from './lyrics/ChordInspectionModal';
import {
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface LyricEditorProps {
  currentSong: SongDraft;
  onUpdateSong: (song: SongDraft) => void;
  onOpenSongManager?: () => void;
  onOpenBarBankModal: () => void;
  insertedBarText?: string | null;
  onClearInsertedBar?: () => void;
  onBack?: () => void;
}

// Helper to convert bracketed chords in plain strings into chord badge spans
function formatChordsForEditor(rawContent: string): string {
  if (!rawContent) return '';
  return rawContent.replace(/\[([A-G][b#]?(?:m|maj|min|dim|aug|sus[24]|add9|[0-9])*)\]/g, (_match, chord) => {
    return `<span data-chord="${chord}">[${chord}]</span>`;
  });
}

export const LyricEditor: React.FC<LyricEditorProps> = ({
  currentSong,
  onUpdateSong,
  onOpenBarBankModal,
  insertedBarText,
  onClearInsertedBar,
  onBack
}) => {
  const [songTitle, setSongTitle] = useState(currentSong.title);
  const [songKey, setSongKey] = useState(currentSong.key || 'C');
  const [songBpm, setSongBpm] = useState(currentSong.bpm || 95);
  const [songStatus, setSongStatus] = useState<'draft' | 'proses' | 'release'>(currentSong.status || 'draft');
  const [selectedChordForInspection, setSelectedChordForInspection] = useState<string | null>(null);

  // Initialize TipTap Editor with ChordBadge Extension
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      ChordBadgeNode,
    ],
    content: formatChordsForEditor(
      currentSong.content || '<p>[Verse 1]</p><p>Di sini ku menulis nada yang tertinggal</p><p>Mencari kata yang tak lagi menyangkal</p><p></p><p>[Chorus]</p><p>FALS mengalun di dada yang sunyi</p><p>Harmoni tercipta tanpa batas lagi</p>'
    ),
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-hidden min-h-[500px] text-[16px] sm:text-[17px] text-[#1C1917] leading-[2.25rem] font-normal px-1 sm:px-2',
      },
      handleClick: (_view, _pos, event) => {
        const target = event.target as HTMLElement | null;
        const badge = target?.closest('.chord-badge, [data-chord]') as HTMLElement | null;
        if (badge) {
          const chord = badge.getAttribute('data-chord') || badge.textContent?.replace(/[\[\]]/g, '').trim();
          if (chord) {
            setSelectedChordForInspection(chord);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdateSong({
        ...currentSong,
        title: songTitle,
        key: songKey,
        bpm: songBpm,
        content: html,
        updatedAt: Date.now(),
      });
    },
  });

  // Handle incoming inserted bar from Bank Bar
  useEffect(() => {
    if (insertedBarText && editor) {
      editor.commands.insertContent(`<p>${insertedBarText}</p>`);
      if (onClearInsertedBar) onClearInsertedBar();
    }
  }, [insertedBarText, editor, onClearInsertedBar]);

  // Sync title and metadata changes
  const handleTitleChange = (val: string) => {
    setSongTitle(val);
    onUpdateSong({
      ...currentSong,
      title: val,
      updatedAt: Date.now(),
    });
  };

  const handleKeyChange = (val: string) => {
    setSongKey(val);
    onUpdateSong({
      ...currentSong,
      key: val,
      updatedAt: Date.now(),
    });
  };

  const handleStatusChange = (val: 'draft' | 'proses' | 'release') => {
    setSongStatus(val);
    onUpdateSong({
      ...currentSong,
      status: val,
      updatedAt: Date.now(),
    });
  };

  // Dynamic vertical layout sync for gutter items
  interface GutterItem {
    id: string | number;
    top: number;
    syllables: number;
    isSectionTag: boolean;
  }

  const [gutterItems, setGutterItems] = useState<GutterItem[]>([]);

  // Fallback initial items to prevent any visual jump before DOM nodes are mounted
  const fallbackItems = useMemo<GutterItem[]>(() => {
    if (!editor) return [];
    const text = editor.getText();
    const rawLines = text.split('\n');
    return rawLines.map((line, index) => {
      const isSectionTag = /^\s*\[(verse|chorus|bridge|pre-chorus|hook|outro|intro)/i.test(line);
      const syllables = isSectionTag ? 0 : countSyllablesInLine(line);
      return {
        id: index,
        top: index * 36,
        syllables,
        isSectionTag,
      };
    });
  }, [editor?.getText()]);

  // Sync gutter positions accurately to DOM element rects
  useEffect(() => {
    if (!editor || !editor.view?.dom) return;

    const dom = editor.view.dom;

    const measureGutter = () => {
      const editorRect = dom.getBoundingClientRect();
      const children = Array.from(dom.children) as HTMLElement[];

      if (children.length === 0) {
        setGutterItems([]);
        return;
      }

      const items: GutterItem[] = children.map((child, index) => {
        // Clone child and strip all chord badges so chords are completely ignored in syllable counting
        const clone = child.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('.chord-badge, [data-chord]').forEach((badge) => badge.remove());
        const cleanLyricText = clone.innerText || clone.textContent || '';

        const rawText = child.innerText || child.textContent || '';
        const isSectionTag = /^\s*\[(verse|chorus|bridge|pre-chorus|hook|outro|intro)/i.test(rawText);
        const syllables = isSectionTag ? 0 : countSyllablesInLine(cleanLyricText);

        const childRect = child.getBoundingClientRect();
        // Exact pixel top relative to the top of editor.view.dom
        const top = childRect.top - editorRect.top;

        return {
          id: index,
          top,
          syllables,
          isSectionTag,
        };
      });

      setGutterItems(items);
    };

    // Initial measurement
    const rafId = requestAnimationFrame(measureGutter);

    // ResizeObserver on editor DOM and its children
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(measureGutter);
    });
    resizeObserver.observe(dom);
    Array.from(dom.children).forEach((child) => resizeObserver.observe(child));

    // MutationObserver on DOM changes
    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(measureGutter);
      Array.from(dom.children).forEach((child) => resizeObserver.observe(child));
    });
    mutationObserver.observe(dom, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [editor, editor?.state.doc]);

  const activeGutterItems = gutterItems.length > 0 ? gutterItems : fallbackItems;

  // Insert section heading into TipTap
  const handleInsertSection = (sectionName: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(`<h3>[${sectionName}]</h3><p></p>`).run();
  };

  // Insert chord symbol as interactive ChordBadgeNode at cursor
  const handleInsertChord = (chordSymbol: string) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'chordBadge',
        attrs: { chord: chordSymbol }
      })
      .insertContent(' ')
      .run();
  };

  // Dismiss keyboard explicitly
  const handleDismissKeyboard = () => {
    if (editor) {
      editor.commands.blur();
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  // Fallback click listener on editor container for chord badges
  const handleEditorContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    const badge = target?.closest('.chord-badge, [data-chord]') as HTMLElement | null;
    if (badge) {
      const chord = badge.getAttribute('data-chord') || badge.textContent?.replace(/[\[\]]/g, '').trim();
      if (chord) {
        setSelectedChordForInspection(chord);
      }
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#FAF9F5] min-h-[calc(100vh-140px)] animate-fade-in">
      {/* 1. Adaptive Header */}
      {/* DESKTOP HEADER (1 Single Row: [←] + Title + Key + Status + Bank Bar) */}
      <div className="hidden md:flex sticky top-0 z-20 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E5E4DE] py-2.5 items-center justify-between gap-3">
        {/* Left: Back button (icon only) & Big Inline Title */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-[#E5E4DE] bg-[#FFFFFF] hover:bg-[#F5F4EE] text-[#1C1917] transition cursor-pointer shadow-2xs"
              title="Kembali ke Daftar Lirik"
            >
              <ArrowLeft className="w-4 h-4 text-[#57534E]" />
            </button>
          )}

          <input
            type="text"
            value={songTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Judul lagumu..."
            className="flex-1 text-2xl font-extrabold text-[#1C1917] bg-transparent border-none outline-hidden tracking-tight placeholder:text-[#A8A29E] min-w-0"
          />
        </div>

        {/* Right: Key, Status & Bank Bar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Key selector */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg text-xs font-mono">
            <span className="text-[#78716C]">Key:</span>
            <select
              value={songKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              className="bg-transparent font-bold text-[#1C1917] outline-hidden cursor-pointer"
            >
              {CHROMATIC_NOTES.map(note => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg text-xs font-mono">
            <span className="text-[#78716C]">Status:</span>
            <select
              value={songStatus}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="bg-transparent font-semibold text-[#1C1917] outline-hidden cursor-pointer"
            >
              <option value="draft">Draft</option>
              <option value="proses">Proses</option>
              <option value="release">Release</option>
            </select>
          </div>

          {/* Bank Bar Shortcut */}
          <button
            onClick={onOpenBarBankModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#FFFFFF] hover:bg-[#F5F4EE] border border-[#E5E4DE] rounded-lg transition cursor-pointer shadow-2xs"
            title="Buka Bank Bar untuk comot ide rima"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#57534E]" />
            <span>Bank Bar</span>
          </button>
        </div>
      </div>

      {/* MOBILE HEADER (2 Rows: Row 1 = Controls, Row 2 = Full Title) */}
      <div className="md:hidden sticky top-0 z-20 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E5E4DE] pt-1.5 pb-2 px-3">
        {/* Row 1: Key, Status, Bank Bar */}
        <div className="flex items-center justify-between gap-2 pb-1">
          <div className="flex items-center gap-1.5">
            {/* Key selector */}
            <div className="flex items-center gap-1 px-2 py-1 bg-[#FFFFFF] border border-[#E5E4DE] rounded-md text-[11px] font-mono">
              <span className="text-[#78716C]">Key:</span>
              <select
                value={songKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                className="bg-transparent font-bold text-[#1C1917] outline-hidden cursor-pointer"
              >
                {CHROMATIC_NOTES.map(note => (
                  <option key={note} value={note}>{note}</option>
                ))}
              </select>
            </div>

            {/* Status selector */}
            <div className="flex items-center gap-1 px-2 py-1 bg-[#FFFFFF] border border-[#E5E4DE] rounded-md text-[11px] font-mono">
              <span className="text-[#78716C]">Status:</span>
              <select
                value={songStatus}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="bg-transparent font-semibold text-[#1C1917] outline-hidden cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="proses">Proses</option>
                <option value="release">Release</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Bank Bar Shortcut Button */}
            <button
              onClick={onOpenBarBankModal}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#1C1917] bg-[#FFFFFF] hover:bg-[#F5F4EE] border border-[#E5E4DE] rounded-md transition cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-[#57534E]" />
              <span>Bank Bar</span>
            </button>
          </div>
        </div>

        {/* Row 2: Big full-width Title Input */}
        <div className="pt-1">
          <input
            type="text"
            value={songTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Judul lagumu..."
            className="w-full text-xl font-extrabold text-[#1C1917] bg-transparent border-none outline-hidden tracking-tight placeholder:text-[#A8A29E]"
          />
        </div>
      </div>

      {/* 2. Self-Contained Modular Toolbar */}
      {/* Desktop: renders as sticky header strip. Mobile: renders dynamically docked directly above keyboard */}
      <LyricWritingToolbar
        variant="auto"
        activeKey={songKey}
        onInsertSection={handleInsertSection}
        onInsertChord={handleInsertChord}
        onDismissKeyboard={handleDismissKeyboard}
      />

      {/* 3. Main Full-Screen Writing Canvas */}
      <div
        className="relative flex flex-1 w-full min-h-[550px] bg-[#FAF9F5] paper-pattern pt-2 pb-16"
        onClick={handleEditorContainerClick}
      >
        {/* Left Gutter: Live Syllable Count Only - Flush to left edge ("mentok kiri") */}
        <div className="w-6 sm:w-7 shrink-0 select-none border-r border-[#E5E4DE]/60 bg-[#FAF9F5] relative pointer-events-none">
          {activeGutterItems.map((item) => (
            <div
              key={item.id}
              style={{ transform: `translateY(${item.top}px)` }}
              className="absolute left-0 top-0 w-full h-[2.25rem] flex items-center justify-center pointer-events-none"
            >
              {item.isSectionTag ? (
                <span className="text-[9px] font-mono font-bold text-[#78716C] tracking-tight leading-none">
                  SEC
                </span>
              ) : item.syllables > 0 ? (
                <span
                  className="inline-flex items-center justify-center px-1 py-0 h-4 min-w-[17px] text-[10px] font-mono font-bold rounded-[3px] bg-[#EAE8DF] text-[#44403C] leading-none tabular-nums shadow-2xs"
                  title={`${item.syllables} suku kata`}
                >
                  {item.syllables}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {/* TipTap Document Area: Expands across full horizontal canvas */}
        <div className="flex-1 min-w-0 pl-1.5 sm:pl-3 pr-3 sm:pr-4">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* 4. Interactive Chord Inspection Modal (Piano Roll & Guitar Fretboard) */}
      <ChordInspectionModal
        isOpen={Boolean(selectedChordForInspection)}
        onClose={() => setSelectedChordForInspection(null)}
        chordSymbol={selectedChordForInspection}
      />
    </div>
  );
};
