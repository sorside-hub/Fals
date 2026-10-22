import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audioEngine';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface MetronomeProps {
  currentBpm?: number;
  onBpmChange?: (bpm: number) => void;
  compact?: boolean;
}

export const Metronome: React.FC<MetronomeProps> = ({
  currentBpm = 95,
  onBpmChange,
  compact = false
}) => {
  const [bpm, setBpm] = useState<number>(currentBpm);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState<number>(4);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Tap tempo state
  const tapTimesRef = useRef<number[]>([]);
  const timerRef = useRef<number | null>(null);

  const updateBpm = (newBpm: number) => {
    const clamped = Math.max(40, Math.min(240, Math.round(newBpm)));
    setBpm(clamped);
    if (onBpmChange) onBpmChange(clamped);
  };

  const handleTap = () => {
    const now = performance.now();
    const taps = tapTimesRef.current;

    // Reset if last tap was more than 2 seconds ago
    if (taps.length > 0 && now - taps[taps.length - 1] > 2000) {
      taps.length = 0;
    }

    taps.push(now);
    if (taps.length > 4) taps.shift();

    if (taps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = 60000 / avgInterval;
      updateBpm(calculatedBpm);
    }
  };

  // Metronome interval loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentBeat(0);
      return;
    }

    const intervalMs = (60 / bpm) * 1000;
    let beat = 0;

    // Trigger initial beat
    setCurrentBeat(beat);
    if (soundEnabled) sound.playClick(beat === 0);

    timerRef.current = window.setInterval(() => {
      beat = (beat + 1) % beatsPerMeasure;
      setCurrentBeat(beat);
      if (soundEnabled) {
        sound.playClick(beat === 0);
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, beatsPerMeasure, soundEnabled]);

  return (
    <div className={`bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl shadow-2xs ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center justify-between pb-2 border-b border-[#F0EFEA] text-xs">
        <span className="font-semibold text-sm text-[#1C1917]">Metronom & Ketukan Bar</span>
        
        <div className="flex items-center gap-2">
          {/* Beats per measure selector */}
          <div className="flex bg-[#F5F4EE] border border-[#E5E4DE] rounded-md p-0.5 text-[11px] font-mono">
            {[2, 3, 4, 6].map(beats => (
              <button
                key={beats}
                onClick={() => setBeatsPerMeasure(beats)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition ${
                  beatsPerMeasure === beats
                    ? 'bg-[#1C1917] text-[#FAF9F5] font-semibold'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                {beats}/4
              </button>
            ))}
          </div>

          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            className="p-1 rounded text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F4EE] cursor-pointer"
            title={soundEnabled ? 'Matikan suara tick' : 'Nyalakan suara tick'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-[#A8A29E]" />}
          </button>
        </div>
      </div>

      {/* Tempo Display & Pulsing indicators */}
      <div className="py-3 flex flex-col items-center">
        {/* Beat dots */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {Array.from({ length: beatsPerMeasure }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2.5 rounded-full transition-all duration-75 ${
                isPlaying && currentBeat === idx
                  ? idx === 0
                    ? 'w-7 bg-[#1C1917]'
                    : 'w-5 bg-[#57534E]'
                  : 'w-2 bg-[#E5E4DE]'
              }`}
            />
          ))}
        </div>

        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-4xl font-bold text-[#1C1917] tracking-tight">{bpm}</span>
          <span className="text-xs text-[#78716C] uppercase">BPM</span>
        </div>

        {/* BPM fine-tune buttons */}
        <div className="flex items-center gap-1 mt-2 text-xs font-mono">
          <button
            onClick={() => updateBpm(bpm - 5)}
            className="px-2 py-1 bg-[#F5F4EE] hover:bg-[#EAE8DF] border border-[#E5E4DE] rounded text-[#44403C] cursor-pointer"
          >
            -5
          </button>
          <button
            onClick={() => updateBpm(bpm - 1)}
            className="px-2 py-1 bg-[#F5F4EE] hover:bg-[#EAE8DF] border border-[#E5E4DE] rounded text-[#44403C] cursor-pointer"
          >
            -1
          </button>
          <input
            type="range"
            min={40}
            max={220}
            value={bpm}
            onChange={(e) => updateBpm(Number(e.target.value))}
            className="w-28 sm:w-40 mx-2 accent-[#1C1917] cursor-pointer"
          />
          <button
            onClick={() => updateBpm(bpm + 1)}
            className="px-2 py-1 bg-[#F5F4EE] hover:bg-[#EAE8DF] border border-[#E5E4DE] rounded text-[#44403C] cursor-pointer"
          >
            +1
          </button>
          <button
            onClick={() => updateBpm(bpm + 5)}
            className="px-2 py-1 bg-[#F5F4EE] hover:bg-[#EAE8DF] border border-[#E5E4DE] rounded text-[#44403C] cursor-pointer"
          >
            +5
          </button>
        </div>
      </div>

      {/* Main Start / Pause and Tap Tempo Bar */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0EFEA]">
        <button
          onClick={() => setIsPlaying(prev => !prev)}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            isPlaying
              ? 'bg-[#EAE8DF] text-[#1C1917] border border-[#D6D3D1]'
              : 'bg-[#1C1917] text-[#FAF9F5] hover:bg-[#292524] shadow-xs'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Hentikan Beat</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Metronom</span>
            </>
          )}
        </button>

        <button
          onClick={handleTap}
          className="flex items-center justify-center gap-2 py-2.5 bg-[#F5F4EE] hover:bg-[#EAE8DF] border border-[#E5E4DE] text-[#1C1917] rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer active:scale-95"
          title="Ketuk beberapa kali sesuai tempo lagu untuk deteksi otomatis"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#57534E]" />
          <span>Tap Tempo</span>
        </button>
      </div>
    </div>
  );
};
