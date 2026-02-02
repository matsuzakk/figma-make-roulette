import { useState } from 'react';
import { motion } from 'motion/react';

const ITEMS = [
  { label: '🎁', color: '#FF6B6B' },
  { label: '⭐', color: '#4ECDC4' },
  { label: '🎉', color: '#FFE66D' },
  { label: '💎', color: '#95E1D3' },
  { label: '🎈', color: '#F38181' },
  { label: '🌟', color: '#AA96DA' },
  { label: '🎊', color: '#FCBAD3' },
  { label: '✨', color: '#A8E6CF' },
];

export function Roulette() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // ランダムな回転数を計算（5-8回転 + ランダムな角度）
    const spins = 5 + Math.random() * 3;
    const randomDegree = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + randomDegree;

    setRotation(totalRotation);

    // 3秒後に結果を表示
    setTimeout(() => {
      setIsSpinning(false);
      const normalizedRotation = totalRotation % 360;
      const segmentAngle = 360 / ITEMS.length;
      // 矢印は上部にあるので、回転を調整して当選項目を計算
      const winningIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % ITEMS.length;
      setWinner(ITEMS[winningIndex].label);
    }, 3000);
  };

  const segmentAngle = 360 / ITEMS.length;

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-gray-800">ルーレット</h1>
      
      <div className="relative">
        {/* 矢印 */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg" />
        </div>

        {/* ルーレットホイール */}
        <div className="relative w-80 h-80 rounded-full shadow-2xl overflow-hidden">
          <motion.div
            className="w-full h-full relative"
            animate={{ rotate: rotation }}
            transition={{
              duration: 3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {/* SVGでセグメントを描画 */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {ITEMS.map((item, index) => {
                const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
                const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
                
                const x1 = 100 + 100 * Math.cos(startAngle);
                const y1 = 100 + 100 * Math.sin(startAngle);
                const x2 = 100 + 100 * Math.cos(endAngle);
                const y2 = 100 + 100 * Math.sin(endAngle);

                const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`;

                const textAngle = (index * segmentAngle + segmentAngle / 2);
                const textRadius = 65;
                const textX = 100 + textRadius * Math.cos((textAngle - 90) * (Math.PI / 180));
                const textY = 100 + textRadius * Math.sin((textAngle - 90) * (Math.PI / 180));

                return (
                  <g key={index}>
                    <path d={pathData} fill={item.color} stroke="white" strokeWidth="2" />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="28"
                      transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {/* 中央の円 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg border-4 border-gray-300" />
        </div>
      </div>

      {/* スピンボタン */}
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
      >
        {isSpinning ? '回転中...' : 'スピン！'}
      </button>

      {/* 結果表示 */}
      {winner && !isSpinning && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white rounded-2xl p-6 shadow-xl"
        >
          <p className="text-gray-600 mb-2">当選！</p>
          <p className="text-6xl">{winner}</p>
        </motion.div>
      )}
    </div>
  );
}
