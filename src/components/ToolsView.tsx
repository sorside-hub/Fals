import React, { useState } from 'react';
import { CHROMATIC_NOTES, CHORD_FORMULAS, SCALES, getChordNotes, getScaleNotes } from '../utils/musicTheory';
import { InteractivePiano } from './InteractivePiano';
import { InteractiveFretboard } from './InteractiveFretboard';
import { CircleOfFifths } from './CircleOfFifths';
import { Metronome } from './Metronome';
import { sound } from '../utils/audioEngine';
import { Volume2, Sliders, Music, Compass } from 'lucide-react';

export const ToolsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chord' | 'scale' | 'circle' | 'metronome'>('chord');
  const [selectedRoot, setSelectedRoot] = useState<string>('C');
  const [selectedChordKey, setSelectedChordKey] = useState<string>('maj7');
  const [selectedScaleKey, setSelectedScaleKey] = useState<string>('major');
  const [instrumentView, setInstrumentView] = useState<'piano' | 'fretboard'>('piano');

  const chordInfo = CHORD_FORMULAS[selectedChordKey] || CHORD_FORMULAS['major'];
  const scaleInfo = SCALES[selectedScaleKey] || SCALES['major'];

  const currentChordNotes = getChordNotes(selectedRoot, selectedChordKey);
  const currentScaleNotes = getScaleNotes(selectedRoot, selectedScaleKey);

  const handlePlayActiveChord = () => {
    sound.playChord(selectedRoot, chordInfo.intervals);
  };

  const handlePlayScaleAscending = () => {
    currentScaleNotes.forEach((note, i) => {
      sound.playNote(note, 4, 0.8, i * 0.15);
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Header tool selector tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#F5F4EE] border border-[#E5E4DE] rounded-xl overflow-x-auto scrollbar-none text-xs">
        {[
          { key: 'chord', label: 'Chord Explorer' },
          { key: 'scale', label: 'Scale Explorer' },
          { key: 'circle', label: 'Circle of Fifths' },
          { key: 'metronome', label: 'Metronom Audio' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.key
                ? 'bg-[#FFFFFF] text-[#1C1917] shadow-2xs'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Chord Explorer */}
      {activeTab === 'chord' && (
        <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EFEA]">
            <div>
              <h3 className="text-base font-bold text-[#1C1917]">
                Kalkulator & Generator Akor
              </h3>
              <p className="text-xs text-[#78716C]">
                Cari anatomi akor, jarak interval, dan bunyi suara instrumennya.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayActiveChord}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1C1917] text-[#FAF9F5] rounded-lg hover:bg-[#292524] transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Bunyikan Akor</span>
              </button>
            </div>
          </div>

          {/* Root Note & Chord Type pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#78716C] mb-1.5">
                Pilih Root Note (Induk Nada)
              </label>
              <div className="flex flex-wrap gap-1">
                {CHROMATIC_NOTES.map(note => (
                  <button
                    key={note}
                    onClick={() => setSelectedRoot(note)}
                    className={`w-9 h-8 rounded font-mono text-xs font-semibold transition cursor-pointer border ${
                      selectedRoot === note
                        ? 'bg-[#1C1917] text-[#FAF9F5] border-[#1C1917]'
                        : 'bg-[#FAF9F5] text-[#44403C] border-[#E5E4DE] hover:bg-[#F5F4EE]'
                    }`}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#78716C] mb-1.5">
                Karakter / Tipe Akor
              </label>
              <select
                value={selectedChordKey}
                onChange={(e) => setSelectedChordKey(e.target.value)}
                className="w-full p-2.5 bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg text-xs font-semibold text-[#1C1917] outline-hidden cursor-pointer"
              >
                {Object.entries(CHORD_FORMULAS).map(([key, formula]) => (
                  <option key={key} value={key}>
                    {formula.name} ({formula.formulaNames})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chord Summary Card */}
          <div className="p-3.5 bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-[#1C1917]">
                  {selectedRoot}{chordInfo.symbol}
                </span>
                <span className="text-xs text-[#78716C]">
                  {chordInfo.name}
                </span>
              </div>
              <div className="text-xs text-[#57534E] mt-1">
                <strong>Rasa Karakter:</strong> {chordInfo.feeling}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#78716C] font-mono">Nada:</span>
              <div className="flex gap-1 font-mono text-xs font-bold text-[#1C1917]">
                {currentChordNotes.map(n => (
                  <span key={n} className="px-2 py-0.5 rounded bg-[#EAE8DF] border border-[#D6D3D1]">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Toggle Instrument Visualizer */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-[#78716C]">Tampilan Visual:</span>
            <div className="flex bg-[#F5F4EE] border border-[#E5E4DE] rounded-md p-0.5 text-xs">
              <button
                onClick={() => setInstrumentView('piano')}
                className={`px-3 py-1 rounded transition cursor-pointer ${
                  instrumentView === 'piano' ? 'bg-[#1C1917] text-[#FAF9F5]' : 'text-[#78716C]'
                }`}
              >
                Piano Roll
              </button>
              <button
                onClick={() => setInstrumentView('fretboard')}
                className={`px-3 py-1 rounded transition cursor-pointer ${
                  instrumentView === 'fretboard' ? 'bg-[#1C1917] text-[#FAF9F5]' : 'text-[#78716C]'
                }`}
              >
                Fretboard Gitar
              </button>
            </div>
          </div>

          {instrumentView === 'piano' ? (
            <InteractivePiano
              highlightNotes={currentChordNotes}
              rootNote={selectedRoot}
              title={`Posisi Tuts Akor ${selectedRoot}${chordInfo.symbol}`}
            />
          ) : (
            <InteractiveFretboard
              highlightNotes={currentChordNotes}
              rootNote={selectedRoot}
              title={`Posisi Fretboard Akor ${selectedRoot}${chordInfo.symbol}`}
            />
          )}
        </div>
      )}

      {/* Tab 2: Scale Explorer */}
      {activeTab === 'scale' && (
        <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EFEA]">
            <div>
              <h3 className="text-base font-bold text-[#1C1917]">
                Eksplorasi Tangga Nada & Skala
              </h3>
              <p className="text-xs text-[#78716C]">
                Temukan melodi yang pas untuk solo gitar atau vokal tanpa nada fals.
              </p>
            </div>

            <button
              onClick={handlePlayScaleAscending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1C1917] text-[#FAF9F5] rounded-lg hover:bg-[#292524] transition cursor-pointer self-start sm:self-auto"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Bunyikan Skala Naik</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#78716C] mb-1.5">
                Root Note
              </label>
              <div className="flex flex-wrap gap-1">
                {CHROMATIC_NOTES.map(note => (
                  <button
                    key={note}
                    onClick={() => setSelectedRoot(note)}
                    className={`w-9 h-8 rounded font-mono text-xs font-semibold transition cursor-pointer border ${
                      selectedRoot === note
                        ? 'bg-[#1C1917] text-[#FAF9F5] border-[#1C1917]'
                        : 'bg-[#FAF9F5] text-[#44403C] border-[#E5E4DE] hover:bg-[#F5F4EE]'
                    }`}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#78716C] mb-1.5">
                Pilih Tangga Nada / Modus
              </label>
              <select
                value={selectedScaleKey}
                onChange={(e) => setSelectedScaleKey(e.target.value)}
                className="w-full p-2.5 bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg text-xs font-semibold text-[#1C1917] outline-hidden cursor-pointer"
              >
                {Object.entries(SCALES).map(([key, scale]) => (
                  <option key={key} value={key}>
                    {scale.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3.5 bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-[#1C1917]">
                Skala {selectedRoot} {scaleInfo.symbol}
              </span>
              <span className="text-xs text-[#78716C]">
                {currentScaleNotes.join(' - ')}
              </span>
            </div>
            <p className="text-xs text-[#57534E]">
              <strong>Karakter Rasa:</strong> {scaleInfo.mood}
            </p>
            <p className="text-xs text-[#78716C]">
              <strong>Cocok Untuk Genre:</strong> {scaleInfo.usage}
            </p>
          </div>

          <InteractivePiano
            highlightNotes={currentScaleNotes}
            rootNote={selectedRoot}
            title={`Tuts Skala ${selectedRoot} ${scaleInfo.symbol}`}
          />
        </div>
      )}

      {/* Tab 3: Circle of Fifths */}
      {activeTab === 'circle' && (
        <CircleOfFifths />
      )}

      {/* Tab 4: Metronome */}
      {activeTab === 'metronome' && (
        <div className="max-w-md mx-auto">
          <Metronome />
        </div>
      )}
    </div>
  );
};
