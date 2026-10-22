import { useState, useEffect } from 'react';
import { BarItem } from '../types';

const INITIAL_BARS: BarItem[] = [
  {
    id: 'bar-1',
    text: 'Tersesat di fret yang sama, mencari kunci tanpa nama / Menghitung detik yang tersisa, di antara doa dan rasa.',
    category: 'punchline',
    rhymeScheme: 'AABB',
    syllableCount: 24,
    tags: ['punchline', 'fret', 'doa'],
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'bar-2',
    text: 'Malam merapat tanpa permisi / Bayangmu pekat penuhi sepi / Coba kuatur nada harmoni / Tapi gitarku tetaplah sunyi',
    category: 'rhyme',
    rhymeScheme: 'AAAA',
    syllableCount: 36,
    tags: ['rima', 'malam', 'sunyi'],
    createdAt: Date.now() - 14400000,
  },
  {
    id: 'bar-3',
    text: 'Biar nada ini bicara, saat kata kehilangan arah.',
    category: 'hook',
    rhymeScheme: 'AA',
    syllableCount: 16,
    tags: ['hook', 'chorus'],
    createdAt: Date.now() - 28800000,
  },
  {
    id: 'bar-4',
    text: 'Minor ketujuh di senar berkarat, seperti rindu yang kian memberat.',
    category: 'metaphor',
    rhymeScheme: 'AA',
    syllableCount: 18,
    tags: ['metafora', 'akor', 'rindu'],
    createdAt: Date.now() - 43200000,
  },
  {
    id: 'bar-5',
    text: 'Bukan nada yang fals, tapi telinga dunia yang terlalu bising untuk mendengar ketulusan.',
    category: 'punchline',
    rhymeScheme: 'Free',
    syllableCount: 26,
    tags: ['filosofi', 'fals'],
    createdAt: Date.now() - 86400000,
  }
];

export function useBarBank() {
  const [barItems, setBarItems] = useState<BarItem[]>(() => {
    try {
      const saved = localStorage.getItem('fals_bar_bank');
      return saved ? JSON.parse(saved) : INITIAL_BARS;
    } catch {
      return INITIAL_BARS;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('fals_bar_bank', JSON.stringify(barItems));
    } catch (e) {
      console.error('Failed to save bar bank to localStorage', e);
    }
  }, [barItems]);

  const addBar = (newBar: Omit<BarItem, 'id' | 'createdAt'>) => {
    const item: BarItem = {
      ...newBar,
      id: `bar-${Date.now()}`,
      createdAt: Date.now(),
    };
    setBarItems(prev => [item, ...prev]);
  };

  const updateBar = (updatedBar: BarItem) => {
    setBarItems(prev => prev.map(b => b.id === updatedBar.id ? updatedBar : b));
  };

  const deleteBar = (id: string) => {
    setBarItems(prev => prev.filter(b => b.id !== id));
  };

  return {
    barItems,
    addBar,
    updateBar,
    deleteBar,
  };
}
