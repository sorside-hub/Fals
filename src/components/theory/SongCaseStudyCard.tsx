import React from 'react';
import { SongCaseStudy } from '../../types';
import { Play } from 'lucide-react';

interface SongCaseStudyCardProps {
  study: SongCaseStudy;
  onPlayProgression: (chords: string[]) => void;
}

export const SongCaseStudyCard: React.FC<SongCaseStudyCardProps> = ({
  study,
  onPlayProgression,
}) => {
  return (
    <div className="p-4 bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl flex flex-col justify-between space-y-3">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#1C1917]">{study.song}</h4>
            <p className="text-xs text-[#78716C]">{study.artist}</p>
          </div>
          <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#FFFFFF] border border-[#E5E4DE] rounded text-[#1C1917]">
            {study.romanNumerals}
          </span>
        </div>

        {/* Chord sequence tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 font-mono text-xs">
          {study.progression.map((chord, cIdx) => (
            <React.Fragment key={cIdx}>
              <span className="px-2 py-0.5 bg-[#FFFFFF] border border-[#D6D3D1] rounded font-bold text-[#1C1917]">
                {chord}
              </span>
              {cIdx < study.progression.length - 1 && (
                <span className="text-[#A8A29E]">→</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="text-xs text-[#44403C] leading-relaxed mt-3">
          {study.whyItWorks}
        </p>
      </div>

      <div className="pt-2 border-t border-[#E5E4DE]">
        <button
          onClick={() => onPlayProgression(study.progression)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] hover:underline cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Dengarkan Urutan Progresi</span>
        </button>
      </div>
    </div>
  );
};
