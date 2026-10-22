import React, { useState, useEffect } from 'react';
import { TabType, SongDraft } from './types';
import { BottomNav } from './components/BottomNav';
import { TheoryLearnView } from './components/TheoryLearnView';
import { LyricListView } from './components/lyrics/LyricListView';
import { LyricEditor } from './components/LyricEditor';
import { BankBar } from './components/BankBar';
import { ToolsView } from './components/ToolsView';
import { BankBarPickerModal } from './components/BankBarPickerModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useSongs } from './hooks/useSongs';
import { useBarBank } from './hooks/useBarBank';
import { useAppNavigation } from './hooks/useAppNavigation';

export default function App() {
  // Native History, Hash Routing, and Scroll Retention Engine
  const { route, navigate, goBack } = useAppNavigation();

  // Modular state management with custom hooks
  const {
    songs,
    currentSong,
    currentSongId,
    updateSong,
    createSong,
    deleteSong,
    selectSong,
  } = useSongs();

  const {
    barItems,
    addBar,
    updateBar,
    deleteBar,
  } = useBarBank();

  // Modal and insertion states
  const [isBankBarPickerOpen, setIsBankBarPickerOpen] = useState(false);
  const [insertedBarText, setInsertedBarText] = useState<string | null>(null);

  // Sync current song from route ID if navigating directly via #lyrics/editor/:songId
  useEffect(() => {
    if (route.tab === 'lyrics' && route.subView === 'editor' && route.id) {
      const targetSong = songs.find(s => s.id === route.id);
      if (targetSong && targetSong.id !== currentSongId) {
        selectSong(targetSong);
      }
    }
  }, [route, songs, currentSongId, selectSong]);

  // Tab switching via hash router
  const handleSelectTab = (tab: TabType) => {
    navigate(`#${tab}`);
  };

  // Lyric navigation
  const handleSelectSongFromList = (song: SongDraft) => {
    selectSong(song);
    navigate(`#lyrics/editor/${song.id}`);
  };

  const handleCreateSongFromList = (title: string, key: string, status?: 'draft' | 'proses' | 'release') => {
    const created = createSong(title, key, status || 'draft');
    if (created) {
      selectSong(created);
      navigate(`#lyrics/editor/${created.id}`);
    }
  };

  // Send bar directly to active lyric editor
  const handleSendToLyric = (text: string) => {
    setInsertedBarText(text);
    navigate(`#lyrics/editor/${currentSong.id}`);
  };

  const isLyricEditorOpen = route.tab === 'lyrics' && route.subView === 'editor';
  const isTheoryDeepDiveOpen = route.tab === 'learn' && route.subView === 'deep';
  const isBarEditorOpen = route.tab === 'bank' && route.subView === 'editor';
  const isFullScreenEditor = isLyricEditorOpen || isBarEditorOpen;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1C1917] selection:bg-[#EAE8DF]">
      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Main Responsive Content Workspace (Header removed for clean, full vertical height) */}
      <main
        className={`flex-1 w-full mx-auto pb-24 md:pb-16 ${
          isFullScreenEditor
            ? 'max-w-6xl px-3 sm:px-6 md:px-8 pt-2 sm:pt-3'
            : 'max-w-7xl px-3 sm:px-6 md:px-8 pt-3 sm:pt-6'
        }`}
      >
        {/* Tab Teori */}
        {route.tab === 'learn' && (
          <div className="animate-fade-in">
            <TheoryLearnView
              initialThemeId={route.id}
              isDeepDive={isTheoryDeepDiveOpen}
              onNavigateToDeepDive={(themeId) => navigate(`#learn/deep/${themeId}`)}
              onBackFromDeepDive={goBack}
            />
          </div>
        )}

        {/* Tab Lirik: Two-Step (List View ➔ Full Bleed Canvas Editor) */}
        {route.tab === 'lyrics' && (
          <div className="animate-fade-in w-full">
            {isLyricEditorOpen ? (
              <LyricEditor
                currentSong={currentSong}
                onUpdateSong={updateSong}
                onOpenBarBankModal={() => setIsBankBarPickerOpen(true)}
                insertedBarText={insertedBarText}
                onClearInsertedBar={() => setInsertedBarText(null)}
                onBack={goBack}
              />
            ) : (
              <div className="max-w-5xl mx-auto">
                <LyricListView
                  songs={songs}
                  onSelectSong={handleSelectSongFromList}
                  onCreateSong={handleCreateSongFromList}
                  onDeleteSong={deleteSong}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab Bank Bar: Two-Step (List View ➔ Full Bleed Bar Editor) */}
        {route.tab === 'bank' && (
          <div className="animate-fade-in w-full">
            <BankBar
              barItems={barItems}
              onAddBar={addBar}
              onUpdateBar={updateBar}
              onDeleteBar={deleteBar}
              onSendToLyric={handleSendToLyric}
              isEditorActive={isBarEditorOpen}
              activeBarId={route.id}
              onNavigateToEditor={(barId) => navigate(`#bank/editor/${barId}`)}
              onBackFromEditor={goBack}
            />
          </div>
        )}

        {/* Tab Tools */}
        {route.tab === 'tools' && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <ToolsView />
          </div>
        )}
      </main>

      {/* Quick Bank Bar Picker Modal (for inserting inside TipTap) */}
      <BankBarPickerModal
        isOpen={isBankBarPickerOpen}
        onClose={() => setIsBankBarPickerOpen(false)}
        barItems={barItems}
        onInsertBar={(text) => {
          setInsertedBarText(text);
          setIsBankBarPickerOpen(false);
        }}
      />

      {/* Mobile & Desktop Persistent Bottom Navigation (Preserved at all times) */}
      <BottomNav
        currentTab={route.tab}
        onSelectTab={handleSelectTab}
        bankBarCount={barItems.length}
      />
    </div>
  );
}
