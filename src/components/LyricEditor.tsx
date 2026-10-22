import React, { useEffect, useState, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { countSyllablesInLine } from '../utils/syllableCounter';
import { CHROMATIC_NOTES } from '../utils/musicTheory';
import { sound } from '../utils/audioEngine';
import { SongDraft } from '../types';
import {
  Sparkles,
  ChevronDown,
  ArrowLeft,
  Volume2,
  FolderOpen,
  Check
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

export const LyricEditor: React.FC<LyricEditorProps> = ({
  currentSong,
  onUpdateSong,
  onOpenSongManager,
  onOpenBarBankModal,
  insertedBarText,
  onClearInsertedBar,
  onBack
}) => {
  const [songTitle, setSongTitle] = useState(currentSong.title);
  const [songKey, setSongKey] = useState(currentSong.key || 'C');
  const [songBpm, setSongBpm] = useState(currentSong.bpm || 95);
  const [songStatus, setSongStatus] = useState<'draft' | 'proses' | 'release'>(currentSong.status || 'draft');
  const [lastSaved, setLastSaved] = useState<string>('Tersimpan');
  const [showChordTray, setShowChordTray] = useState(false);

  // Initialize TipTap Editor with comfortable leading and full width
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: currentSong.content || '<p>[Verse 1]</p><p>Di sini ku menulis nada yang tertinggal</p><p>Mencari kata yang tak lagi menyangkal</p><p></p><p>[Chorus]</p><p>FALS mengalun di dada yang sunyi</p><p>Harmoni tercipta tanpa batas lagi</p>',
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-hidden min-h-[500px] text-[16px] sm:text-[17px] text-[#1C1917] leading-[2.5rem] font-normal px-2 sm:px-4',
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
      setLastSaved('Baru disimpan');
    },
  });

  // Handle incoming inserted bar from Bank Bar
  useEffect(() => {
    if (insertedBarText && editor) {
      editor.commands.insertContent(`<p>${insertedBarText}</p>`);
      if (onClearInsertedBar) onClearInsertedBar();
      setLastSaved('Bar disisipkan');
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

  // Calculate live syllable counts per line
  const linesInfo = useMemo(() => {
    if (!editor) return [];
    const text = editor.getText();
    const rawLines = text.split('\n');

    return rawLines.map((line, index) => {
      const syllables = countSyllablesInLine(line);
      const isSectionTag = /^\s*\[(verse|chorus|bridge|pre-chorus|hook|outro|intro)/i.test(line);
      return {
        lineIndex: index + 1,
        lineText: line,
        syllables,
        isSectionTag,
        isEmpty: line.trim() === '',
      };
    });
  }, [editor?.getText()]);

  // Common chords for the chosen song key
  const availableChords = useMemo(() => {
    const root = songKey;
    return [
      { name: root, intervals: [0, 4, 7] },
      { name: `${root}maj7`, intervals: [0, 4, 7, 11] },
      { name: `${root}add9`, intervals: [0, 4, 7, 14] },
      { name: `${root}sus2`, intervals: [0, 2, 7] },
      { name: `${root}sus4`, intervals: [0, 5, 7] },
    ];
  }, [songKey]);

  // Insert section heading into TipTap
  const insertSection = (sectionName: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(`<h3>[${sectionName}]</h3><p></p>`).run();
  };

  // Insert chord symbol at cursor
  const insertChord = (chordSymbol: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(`[${chordSymbol}] `).run();
    sound.playChord(songKey, [0, 4, 7]);
  };

  return (
    <div className="w-full flex flex-col bg-[#FAF9F5] min-h-[calc(100vh-140px)] animate-fade-in">
      {/* 1. Sticky Minimalist Context Header (Edge-to-Edge) */}
      <div className="sticky top-0 z-20 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E5E4DE] pb-2 pt-1">
        {/* Navigation & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-1">
          {/* Back button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F5F4EE] px-2.5 py-1.5 rounded-lg border border-[#E5E4DE] transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#57534E]" />
              <span>Daftar Lirik</span>
            </button>
          )}

          {/* Metadata & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status selector */}
            <div className="flex items-center gap-1 px-2 py-1 bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg text-xs font-mono">
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

            {/* Key selector */}
            <div className="flex items-center gap-1 px-2 py-1 bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg text-xs font-mono">
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

            {/* Bank Bar Shortcut Button */}
            <button
              onClick={onOpenBarBankModal}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#1C1917] bg-[#FFFFFF] hover:bg-[#F5F4EE] border border-[#E5E4DE] rounded-lg transition cursor-pointer"
              title="Buka Bank Bar untuk comot ide rima"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#57534E]" />
              <span>Bank Bar</span>
            </button>

            {/* Auto-saved indicator */}
            <span className="text-[11px] font-mono text-[#78716C] px-1 hidden sm:inline">
              {lastSaved}
            </span>
          </div>
        </div>

        {/* Big Seamless Document Title Input */}
        <div className="pt-2">
          <input
            type="text"
            value={songTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ketik judul lagumu di sini..."
            className="w-full text-2xl sm:text-3xl font-extrabold text-[#1C1917] bg-transparent border-none outline-hidden tracking-tight placeholder:text-[#A8A29E]"
          />
        </div>
      </div>

      {/* 2. Fluid Section & Chord Toolbar */}
      <div className="py-2.5 border-b border-[#F0EFEA] flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Section Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[#78716C] mr-1 font-mono text-[11px] shrink-0">Sisip Bagian:</span>
          {['Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Hook', 'Outro'].map(sec => (
            <button
              key={sec}
              onClick={() => insertSection(sec)}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#FFFFFF] border border-[#E5E4DE] text-[#44403C] hover:bg-[#F5F4EE] hover:text-[#1C1917] cursor-pointer whitespace-nowrap transition"
            >
              +{sec}
            </button>
          ))}
        </div>

        {/* Toggle Chord Inserter */}
        <button
          onClick={() => setShowChordTray(prev => !prev)}
          className="flex items-center gap-1 text-[11px] font-mono text-[#57534E] hover:text-[#1C1917] px-2 py-1 rounded bg-[#FFFFFF] border border-[#E5E4DE] cursor-pointer ml-auto"
        >
          <span>Sisip Akor ({songKey})</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showChordTray ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Collapsible Chord Inserter Bar */}
      {showChordTray && (
        <div className="py-2 px-1 border-b border-[#E5E4DE] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs bg-[#F5F4EE]/60">
          <span className="text-[11px] font-mono text-[#78716C] shrink-0 mr-1">Klik sisip akor:</span>
          {availableChords.map(c => (
            <button
              key={c.name}
              onClick={() => insertChord(c.name)}
              className="px-2.5 py-1 rounded-md font-mono font-medium text-[11px] bg-[#FFFFFF] border border-[#D6D3D1] text-[#1C1917] hover:bg-[#FAF9F5] hover:border-[#1C1917] transition cursor-pointer flex items-center gap-1"
            >
              <span>[{c.name}]</span>
            </button>
          ))}
          <button
            onClick={() => sound.playChord(songKey, [0, 4, 7])}
            className="p-1 rounded text-[#78716C] hover:text-[#1C1917] ml-auto cursor-pointer"
            title="Dengarkan akor dasar"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Full-Screen Writing Canvas (Zero Box/Card, Max Horizontal Space) */}
      <div className="relative flex flex-1 w-full min-h-[550px] bg-[#FAF9F5] paper-pattern mt-1">
        {/* Left Column: Line Numbers & Live Syllable Count */}
        <div className="w-12 sm:w-16 shrink-0 py-2 select-none border-r border-[#E5E4DE]/60 bg-[#FAF9F5] font-mono text-[11px] text-[#A8A29E] flex flex-col items-center leading-[2.5rem]">
          {linesInfo.map((info) => (
            <div key={info.lineIndex} className="h-[2.5rem] flex items-center justify-between w-full px-1.5 sm:px-2">
              <span className="text-[10px] text-[#A8A29E]">{info.lineIndex}</span>
              {info.isSectionTag ? (
                <span className="text-[9px] font-semibold text-[#78716C]">SEC</span>
              ) : info.syllables > 0 ? (
                <span
                  className="text-[10px] font-medium px-1 rounded bg-[#EAE8DF] text-[#44403C]"
                  title={`${info.syllables} suku kata di baris ini`}
                >
                  {info.syllables}k
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {/* TipTap Document Area: Expands across full horizontal canvas */}
        <div className="flex-1 py-2 px-2 sm:px-6 md:px-8 overflow-y-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Subtle Writing Status Footer */}
      <div className="py-3 border-t border-[#E5E4DE]/60 flex items-center justify-between text-xs text-[#78716C]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span className="font-mono text-[11px]">
            {linesInfo.filter(l => !l.isEmpty && !l.isSectionTag).length} baris lirik aktif
          </span>
        </div>
        <div className="font-mono text-[11px] text-[#A8A29E]">
          {linesInfo.reduce((sum, l) => sum + (l.isSectionTag ? 0 : l.syllables), 0)} suku kata total
        </div>
      </div>
    </div>
  );
};
