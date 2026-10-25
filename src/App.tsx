import React, { useState, useEffect } from 'react';
import { TabType, SongDraft } from './types';
import { BottomNav } from './components/BottomNav';
import { TheoryLearnView } from './components/TheoryLearnView';
import { LyricListView } from './components/lyrics/LyricListView';
import { LyricEditor } from './components/LyricEditor';
import { ConceptEditor } from './components/lyrics/ConceptEditor';
import { BankBar } from './components/BankBar';
import { ToolsView } from './components/ToolsView';
import { BankBarPickerModal } from './components/BankBarPickerModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useSongs } from './hooks/useSongs';
import { useBarBank } from './hooks/useBarBank';
import { useAppNavigation } from './hooks/useAppNavigation';
import { useVirtualKeyboard } from './hooks/useVirtualKeyboard';

export default function App() {
  // Native History, Hash Routing, and Scroll Retention Engine
  const { route, navigate, goBack } = useAppNavigation();

  // Centralized Virtual Keyboard Hook for Mobile Ergonomics
  const { isKeyboardVisible } = useVirtualKeyboard();

  // Modular state management with custom hooks
  const {
    songs,
    currentSong,
    currentSongId,
    updateSong,
    createSong,
    deleteSong,
    selectSong,
    addVersion,
    setFinalVersion,
    switchVersion,
    renameVersion,
    deleteVersion,
    addAudioMemo,
    renameAudioMemo,
    deleteAudioMemo,
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
  const [lastActiveSongId, setLastActiveSongId] = useState<string | null>(currentSongId);
  const [lastLyricSubView, setLastLyricSubView] = useState<'list' | 'editor'>('list');

  // Track active subView and sync current song when navigating in lyrics tab
  useEffect(() => {
    if (route.tab === 'lyrics') {
      if (route.subView === 'editor' || route.subView === 'concept') {
        setLastLyricSubView('editor');
        if (route.id) {
          setLastActiveSongId(route.id);
          const targetSong = songs.find(s => s.id === route.id);
          if (targetSong && targetSong.id !== currentSongId) {
            selectSong(targetSong);
          }
        }
      } else {
        setLastLyricSubView('list');
      }
    }
  }, [route, songs, currentSongId, selectSong]);

  // Tab switching via hash router
  const handleSelectTab = (tab: TabType) => {
    if (tab === 'lyrics') {
      if (route.tab === 'lyrics') {
        // If currently ALREADY in lyrics tab and on editor/concept: clicking lyrics tab toggles back to list view
        if (route.subView === 'editor' || route.subView === 'concept') {
          setLastLyricSubView('list');
          navigate('#lyrics');
        } else {
          // Already on list view
          navigate('#lyrics');
        }
      } else {
        // Switching from ANOTHER tab (learn/bank/tools) back to lyrics tab:
        // Only return to editor if user was previously in editor before leaving lyrics tab
        if (lastLyricSubView === 'editor') {
          const activeSongId = lastActiveSongId || currentSongId;
          const exists = activeSongId && songs.some(s => s.id === activeSongId);
          if (exists) {
            navigate(`#lyrics/editor/${activeSongId}`);
          } else {
            navigate('#lyrics');
          }
        } else {
          navigate('#lyrics');
        }
      }
    } else {
      navigate(`#${tab}`);
    }
  };

  // Lyric navigation
  const handleSelectSongFromList = (song: SongDraft) => {
    selectSong(song);
    setLastActiveSongId(song.id);
    setLastLyricSubView('editor');
    navigate(`#lyrics/editor/${song.id}`);
  };

  const handleCreateSongFromList = (title: string, key: string, status?: 'draft' | 'proses' | 'release') => {
    const created = createSong(title, key, status || 'draft');
    if (created) {
      selectSong(created);
      setLastActiveSongId(created.id);
      setLastLyricSubView('editor');
      navigate(`#lyrics/editor/${created.id}`);
    }
  };

  // Send bar directly to active lyric editor
  const handleSendToLyric = (text: string) => {
    setInsertedBarText(text);
    setLastLyricSubView('editor');
    navigate(`#lyrics/editor/${currentSong.id}`);
  };

  const isLyricEditorOpen = route.tab === 'lyrics' && route.subView === 'editor';
  const isLyricConceptOpen = route.tab === 'lyrics' && route.subView === 'concept';
  const isTheoryDeepDiveOpen = route.tab === 'learn' && route.subView === 'deep';
  const isBarEditorOpen = route.tab === 'bank' && route.subView === 'editor';
  const isFullScreenEditor = isLyricEditorOpen || isLyricConceptOpen || isBarEditorOpen;

  // Hide bottom navbar on mobile when keyboard is open in editors
  const shouldHideBottomNavOnMobile = isFullScreenEditor && isKeyboardVisible;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1C1917] selection:bg-[#EAE8DF]">
      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Main Responsive Content Workspace */}
      <main
        className={`flex-1 w-full mx-auto pb-14 md:pb-16 ${
          isLyricEditorOpen || isLyricConceptOpen
            ? 'max-w-6xl px-0 sm:px-6 md:px-8 pt-1 sm:pt-3'
            : isBarEditorOpen
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

        {/* Tab Lirik: Multi-View (List View ➔ Full Bleed Canvas Editor / Concept Editor) */}
        {route.tab === 'lyrics' && (
          <div className="animate-fade-in w-full">
            {isLyricConceptOpen ? (
              <ConceptEditor
                currentSong={currentSong}
                onUpdateSong={updateSong}
                onBack={goBack}
              />
            ) : isLyricEditorOpen ? (
              <LyricEditor
                currentSong={currentSong}
                onUpdateSong={updateSong}
                barItems={barItems}
                onOpenBarBankModal={() => setIsBankBarPickerOpen(true)}
                onOpenConceptEditor={() => navigate(`#lyrics/concept/${currentSong.id}`)}
                onAddVersion={(dup) => addVersion(currentSong.id, dup)}
                onSetFinalVersion={(vId) => setFinalVersion(currentSong.id, vId)}
                onSwitchVersion={(vId) => switchVersion(currentSong.id, vId)}
                onRenameVersion={(vId, name) => renameVersion(currentSong.id, vId, name)}
                onDeleteVersion={(vId) => deleteVersion(currentSong.id, vId)}
                onAddAudioMemo={(name, duration, blob) => {
                  const newMemo = {
                    id: `audio-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    name,
                    duration,
                    createdAt: Date.now(),
                  };
                  addAudioMemo(currentSong.id, newMemo, blob);
                }}
                onRenameAudioMemo={(memoId, name) => renameAudioMemo(currentSong.id, memoId, name)}
                onDeleteAudioMemo={(memoId) => deleteAudioMemo(currentSong.id, memoId)}
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

      {/* Persistent Bottom Navigation (Auto-hidden on mobile when keyboard is open in editors) */}
      <div className={shouldHideBottomNavOnMobile ? 'hidden md:block' : 'block'}>
        <BottomNav
          currentTab={route.tab}
          onSelectTab={handleSelectTab}
          bankBarCount={barItems.length}
        />
      </div>
    </div>
  );
}
