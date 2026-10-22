// Smart Syllable Counter for Indonesian & English lyrics

export function countSyllablesInWord(word: string): number {
  const clean = word.toLowerCase().trim().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  if (clean.length <= 2) return 1;

  // Indonesian syllable heuristics (Indonesian is phonetically syllable-timed)
  // Vowels: a, i, u, e, o, plus dipthongs ai, au, oi
  const matches = clean.match(/[aiueo]+/g);
  if (!matches) return 1;

  let count = 0;
  for (const group of matches) {
    if (group.length === 1) {
      count += 1;
    } else if (group === 'ai' || group === 'au' || group === 'oi') {
      count += 1; // standard diphthong
    } else {
      // e.g. "ia" in "dia", "ua" in "dua", "io" in "radio" -> usually 2 syllables in Indo
      count += group.length;
    }
  }

  return Math.max(1, count);
}

export function countSyllablesInLine(line: string): number {
  // Strip chord annotations like [Cmaj7] or (Am) if present in lyric line
  const textWithoutChords = line
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\([A-G][b#]?[a-zA-Z0-9]*\)/g, '')
    .trim();

  if (!textWithoutChords) return 0;
  
  // Ignore section tags like [Verse], [Chorus]
  if (/^(verse|chorus|bridge|pre-chorus|hook|outro|intro)/i.test(textWithoutChords.replace(/[:\-]/g, ''))) {
    return 0;
  }

  const words = textWithoutChords.split(/\s+/).filter(Boolean);
  return words.reduce((total, word) => total + countSyllablesInWord(word), 0);
}

// Find words that end in similar rhyme sound
export function getRhymeEnding(word: string): string {
  const clean = word.toLowerCase().trim().replace(/[^a-z]/g, '');
  if (clean.length < 2) return clean;
  // Get last 2-3 letters including last vowel
  const lastVowelIdx = clean.search(/[aiueo][^aiueo]*$/);
  if (lastVowelIdx !== -1) {
    return clean.slice(lastVowelIdx);
  }
  return clean.slice(-2);
}
