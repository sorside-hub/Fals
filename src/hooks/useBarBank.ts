import { useState, useEffect } from 'react';
import { BarItem } from '../types';

const INITIAL_BARS: BarItem[] = [
  {
    id: 'bar-aporia',
    text: 'Aporia',
    meaning: 'Keadaan kebuntuan filosofis atau kebingungan saat sebuah premis mencapai paradoks tanpa jalan keluar.',
    category: 'diksi',
    rhymeScheme: 'Free',
    syllableCount: 4,
    tags: ['diksi', 'filsafat', 'paradoks'],
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'bar-jendela',
    text: 'Jendela berembun menatap sepi',
    meaning: 'Menggambarkan keterasingan dan sunyi mendalam dari balik dinding kaca melihat dunia luar yang samar.',
    category: 'metafor',
    rhymeScheme: 'Free',
    syllableCount: 11,
    tags: ['metafor', 'kesepian', 'suasana'],
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'bar-1',
    text: 'Tersesat di fret yang sama, mencari kunci tanpa nama / Menghitung detik yang tersisa, di antara doa dan rasa.',
    meaning: 'Pergulatan musisi mencari inspirasi nada di tengah keterbatasan waktu dan harapan.',
    category: 'bar',
    rhymeScheme: 'AABB',
    syllableCount: 24,
    tags: ['bar', 'fret', 'doa'],
    createdAt: Date.now() - 14400000,
  },
  {
    id: 'bar-3',
    text: 'Biar nada ini bicara, saat kata kehilangan arah.',
    meaning: 'Pernyataan pasrah ketika logika dan kata-kata tak mampu menampung luapan emosi.',
    category: 'hook',
    rhymeScheme: 'AA',
    syllableCount: 16,
    tags: ['hook', 'chorus'],
    createdAt: Date.now() - 28800000,
  },
  {
    id: 'bar-4',
    text: 'Minor ketujuh di senar berkarat, seperti rindu yang kian memberat.',
    meaning: 'Analogi akor minor dan senar tua dengan penyesalan yang tidak pernah tersampaikan.',
    category: 'metafor',
    rhymeScheme: 'AA',
    syllableCount: 18,
    tags: ['metafor', 'akor', 'rindu'],
    createdAt: Date.now() - 43200000,
  },
  {
    id: 'bar-5',
    text: 'Bukan nada yang fals, tapi telinga dunia yang terlalu bising untuk mendengar ketulusan.',
    meaning: 'Kritik sosial tentang kejujuran berekspresi di tengah tren yang seragam.',
    category: 'bar',
    rhymeScheme: 'Free',
    syllableCount: 26,
    tags: ['punchline', 'filosofi', 'fals'],
    createdAt: Date.now() - 86400000,
  }
];

export function useBarBank() {
  const [barItems, setBarItems] = useState<BarItem[]>(() => {
    try {
      const saved = localStorage.getItem('fals_bar_bank');
      if (!saved) return INITIAL_BARS;
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => {
        let cat = item.category || 'diksi';
        if (cat === 'metaphor' || cat === 'idea') cat = 'metafor';
        if (cat === 'punchline' || cat === 'rhyme') cat = 'bar';
        return { ...item, category: cat };
      });
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

  const addBar = (newBar: Omit<BarItem, 'id' | 'createdAt'> & { id?: string; createdAt?: number }) => {
    const item: BarItem = {
      ...newBar,
      id: newBar.id || `bar-${Date.now()}`,
      createdAt: newBar.createdAt || Date.now(),
    };
    setBarItems(prev => [item, ...prev]);
    return item;
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
