import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Check,
  Info,
  BarChart3,
} from 'lucide-react';

export interface MenuItemType {
  id: string;
  category: 'snack' | 'beverage';
  title: string;
  description: string;
  price: number;
  change: string;
  trend: 'up' | 'down';
  marketCap: string;
  volume: string;
  volatility: string;
  investment: string;
  isSoldOut?: boolean;
}

interface MenuItemProps {
  item: MenuItemType;
  addToCart: (item: MenuItemType) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, addToCart }) => {
  const [added, setAdded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // ===== CSS (애니메이션/보딩패스 패턴) =====
  const css = `
    @keyframes taxi-lights {
      0% { background-position: 0 0, 0 0; }
      100% { background-position: 40px 0, -40px 0; }
    }
    @keyframes shine {
      from { transform: translateX(-120%); }
      to   { transform: translateX(160%); }
    }
    @keyframes pulse-soft {
      0%,100% { opacity: .75; }
      50%     { opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .animate-taxi, .animate-shine, .animate-pulse-soft { animation: none !important; }
    }
  `;

  const handleAddToCart = () => {
    if (item.isSoldOut) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    addToCart(item);
  };

  const TrendIcon = item.trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor =
    item.trend === 'up' ? 'text-emerald-600' : 'text-rose-600';
  const trendBg =
    item.trend === 'up'
      ? 'bg-emerald-50/70 border-emerald-500/30'
      : 'bg-rose-50/70 border-rose-500/30';

  // 기존 투자 라벨을 "운영팀 권고" 칩 스타일로 재사용
  const getAdvisoryChip = (investment: string) => {
    const base = 'px-2 py-0.5 rounded-full text-[11px] font-bold border';
    switch (investment) {
      case '즉시 체포':
        return `${base} bg-amber-900 text-amber-100 border-amber-700`;
      case '체포 권장':
        return `${base} bg-emerald-900 text-emerald-200 border-emerald-700`;
      case '감시 중':
        return `${base} bg-sky-900 text-sky-200 border-sky-700`;
      case '수배 중':
        return `${base} bg-yellow-900 text-yellow-200 border-yellow-700`;
      case '체포 완료':
        return `${base} bg-rose-900 text-rose-200 border-rose-700`;
      default:
        return `${base} bg-slate-800 text-slate-200 border-slate-600`;
    }
  };

  // 카테고리 → 가상의 IATA 라우트 표기 (스낵: ICN→SNK / 음료: ICN→BEV)
  const routeCode = item.category === 'snack' ? 'ICN → SNK' : 'ICN → BEV';

  return (
    <div
      className={`group relative mb-4 rounded-2xl overflow-hidden border-4 border-sky-900/70 shadow-md transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${
        item.isSoldOut ? 'opacity-70' : ''
      }`}
      style={{
        // 보딩패스/게이트 패턴
        backgroundImage: `
          linear-gradient(180deg, rgba(9,18,36,0.92) 0%, rgba(10,26,50,0.92) 100%),
          radial-gradient(1200px 400px at 50% -200px, rgba(44,127,255,0.18) 0%, rgba(0,0,0,0) 70%)
        `,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* 상단 택시 라이트 러닝 라인 */}
      <div
        className="animate-taxi h-1 w-full"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,0.22) 25%, transparent 25% 50%, rgba(255,255,255,0.22) 50% 75%, transparent 75%), linear-gradient(90deg, rgba(255,255,255,0.12) 25%, transparent 25% 50%, rgba(255,255,255,0.12) 50% 75%, transparent 75%)',
          backgroundSize: '40px 2px, 40px 2px',
          animation: 'taxi-lights 3.6s linear infinite',
        }}
      />

      {/* SOLD OUT 리본 → "CANCELLED" 스타일 */}
      {item.isSoldOut && (
        <div className="pointer-events-none absolute -right-14 top-4 rotate-45 bg-rose-700 text-rose-50 text-xs font-extrabold tracking-wider px-16 py-1 shadow-lg border border-rose-400">
          CANCELLED
        </div>
      )}

      {/* 카드 콘텐츠 */}
      <div className="relative z-10 p-4">
        {/* 상단: 타이틀 + 라우트 + 트렌드 */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-800/80 border border-sky-500/40 text-sky-100 text-[11px] font-semibold">
                ✈️ {routeCode}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${trendBg} ${trendColor} text-[11px] font-bold border`}
              >
                <TrendIcon size={14} />
                {item.change}
              </span>
            </div>
            <h3 className="mt-1 font-extrabold text-sky-100 text-[17px] tracking-wide drop-shadow-sm truncate">
              {item.title}
            </h3>
            <p className="text-sky-200/80 text-[13px] mt-0.5 font-medium break-words">
              {item.description}
            </p>
          </div>
        </div>

        {/* 가격(운임) */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-[11px] text-sky-300/80 font-semibold">Fare</span>
            <p className="font-extrabold text-amber-300 text-2xl leading-7 drop-shadow-md tabular-nums">
              ₩{item.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 액션 */}
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            onClick={() => setShowDetails((v) => !v)}
            aria-expanded={showDetails}
            aria-label="메뉴 상세 보기"
            className="p-1.5 rounded-full bg-sky-800 text-sky-100 hover:bg-sky-700 transition-colors border border-sky-500/50 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <Info size={16} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={item.isSoldOut}
            className={`relative inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-bold border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
              item.isSoldOut
                ? 'bg-slate-500/60 text-slate-200 border-slate-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md'
                : 'bg-amber-300 text-[#0a1220] border-amber-400 hover:bg-amber-200 hover:shadow-lg active:translate-y-[1px]'
            }`}
            aria-label={
              item.isSoldOut
                ? '품절'
                : added
                ? '장바구니에 추가됨'
                : '장바구니에 담기'
            }
          >
            {added ? (
              <Check size={18} className="mr-2" />
            ) : (
              <PlusCircle size={18} className="mr-2" />
            )}
            {item.isSoldOut ? '매진' : added ? '추가됨' : '담기'}
            {!item.isSoldOut && !added && (
              <span className="animate-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-white/0 via-white/35 to-white/0" style={{ animation: 'shine 1.4s ease-in-out infinite' }} />
            )}
          </button>
        </div>

        {/* 상세 (운항 정보) */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-sky-700/60">
            <div className="rounded-xl p-3 border bg-sky-900/40 border-sky-600/40">
              <h4 className="font-bold text-sm text-sky-100 mb-2 flex items-center">
                <BarChart3 size={16} className="mr-1.5 text-sky-300" />
                운항 정보
              </h4>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-sky-900/30 p-2 rounded-lg shadow-sm border border-sky-600/40">
                  <p className="text-[11px] font-semibold text-sky-300/90">총 좌석(가용)</p>
                  <p className="font-bold text-sm text-sky-100">{item.marketCap}</p>
                </div>
                <div className="bg-sky-900/30 p-2 rounded-lg shadow-sm border border-sky-600/40">
                  <p className="text-[11px] font-semibold text-sky-300/90">변동성(혼잡도)</p>
                  <p className="font-bold text-sm text-sky-100">{item.volatility}</p>
                </div>
              </div>

              <div className="bg-sky-900/30 p-2 rounded-lg shadow-sm border border-sky-600/40">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-sky-300/90">
                    운영팀 권고
                  </p>
                  <p className={getAdvisoryChip(item.investment)}>{item.investment}</p>
                </div>
                <p className="text-sky-100/90 text-[12px] mt-1 font-medium">
                  {item.trend === 'up'
                    ? '수요 증가 구간입니다. 주문 대기시간이 다소 길 수 있어요.'
                    : '혼잡 완화 구간입니다. 지금 주문하면 비교적 빠를 수 있어요.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 러닝 라인 */}
      <div
        className="animate-taxi h-1 w-full"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,0.22) 25%, transparent 25% 50%, rgba(255,255,255,0.22) 50% 75%, transparent 75%), linear-gradient(90deg, rgba(255,255,255,0.12) 25%, transparent 25% 50%, rgba(255,255,255,0.12) 50%, transparent 75%)',
          backgroundSize: '40px 2px, 40px 2px',
          animation: 'taxi-lights 3.6s linear infinite',
        }}
      />
    </div>
  );
};

export default MenuItem;
