import { useState } from 'react';
import { Roulette } from './components/Roulette';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-8">
      <Roulette />
    </div>
  );
}
