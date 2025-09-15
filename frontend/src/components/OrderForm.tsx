// OrderForm.tsx — UX & style polish (V2, sticky CTA 정리)
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DollarSign, Upload, Check, X, Plus, Minus, Copy, Trash2 } from 'lucide-react';
import PolicyModal from './PolicyModal';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface OrderFormProps {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  toggleOrder: () => void;
  updateCartItem: (id: string, quantity: number) => void;
  /** 모달 마운트 시 컨테이너의 맨 아래로 스크롤할지 여부 (기본값: false) */
  scrollToBottomOnMount?: boolean;
}

const bankInfo = {
  bank: '토스뱅크',
  account: '1001-9279-2832',
  name: '이수연',
};

const SEAT_FEE_PER_PERSON = 0;

// 가장 가까운 세로 스크롤 컨테이너 찾기
function getScrollParent(node: HTMLElement | null): HTMLElement | Window {
  let cur: HTMLElement | null = node;
  while (cur) {
    const style = window.getComputedStyle(cur);
    const overflowY = style.overflowY;
    const isScrollable = /(auto|scroll|overlay)/.test(overflowY) && cur.scrollHeight > cur.clientHeight;
    if (isScrollable) return cur;
    cur = cur.parentElement;
  }
  return window;
}

const OrderForm: React.FC<OrderFormProps> = ({
  cartItems,
  cartTotal,
  cartCount,
  toggleOrder,
  updateCartItem,
  scrollToBottomOnMount = false, // ✅ 기본값: 자동 스크롤 OFF
}) => {
  const [orderComplete, setOrderComplete] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    privacyAgree: false,
    termsAgree: false,
  });
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [tableSize, setTableSize] = useState<number>(2);
  const [copied, setCopied] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const seatFeeTotal = tableSize * SEAT_FEE_PER_PERSON;
  const finalTotal = cartTotal + seatFeeTotal;

  // 루트 컨테이너 ref
  const rootRef = useRef<HTMLDivElement>(null);

  // 필요할 때만 스크롤 컨테이너의 맨 아래로 이동
  useEffect(() => {
    if (!scrollToBottomOnMount) return;

    const el = rootRef.current;
    const scroller = getScrollParent(el);
    const scrollToBottom = () => {
      if (scroller === window) {
        const height = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        );
        window.scrollTo({ top: height, behavior: 'auto' });
      } else {
        const s = scroller as HTMLElement;
        s.scrollTop = s.scrollHeight;
      }
    };
    const raf = requestAnimationFrame(scrollToBottom);
    return () => cancelAnimationFrame(raf);
  }, [scrollToBottomOnMount]);

  // 이미지 리사이즈 (긴 변 기준)
  const resizeImage = (file: File, maxSide = 800, quality = 0.9): Promise<File> => {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = objectUrl;

      img.onload = () => {
        let { width, height } = img;
        const longer = Math.max(width, height);
        const ratio = Math.min(maxSide / longer, 1);
        const targetW = Math.round(width * ratio);
        const targetH = Math.round(height * ratio);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, targetW, targetH);

        const isPNG = file.type === 'image/png';
        const mime = isPNG ? 'image/png' : 'image/jpeg';

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) return resolve(file);
            const ext = isPNG ? '.png' : '.jpg';
            const name = file.name.replace(/\.[^.]+$/i, ext);
            resolve(new File([blob], name, { type: mime }));
          },
          mime,
          isPNG ? undefined : quality
        );
      };
    });
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const resized = await resizeImage(file, 300, 0.9);
    setPaymentImage(resized);
  };

  const copyAccount = () => {
    navigator.clipboard.writeText(bankInfo.account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const completeOrder = async () => {
    const { name, phone, privacyAgree, termsAgree } = userInfo;
    if (!name || !phone || !privacyAgree || !termsAgree || !paymentImage) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    const items = [
      ...cartItems.map((item) => `${item.title} x ${item.quantity}`),
      `자리세 x ${tableSize}명 (₩${seatFeeTotal.toLocaleString()})`,
    ];

    const formData = new FormData();
    formData.append('table', phone);
    formData.append('name', name);
    formData.append('items', JSON.stringify(items));
    formData.append('total', finalTotal.toString());
    formData.append('song', '');
    formData.append('payment_image', paymentImage);
    formData.append('table_size', tableSize.toString());
    formData.append('seat_fee', seatFeeTotal.toString());
    formData.append('consent_privacy', privacyAgree.toString());
    formData.append('consent_terms', termsAgree.toString());

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, formData);
      setOrderNumber(`WANTED-${response.data.order_id}`);
      setOrderComplete(true);
    } catch (error) {
      alert('메뉴 신청 실패');
      console.error(error);
    }
  };

  if (orderComplete) {
    return (
      <div className="rounded-lg border-4 border-amber-800 bg-gradient-to-b from-amber-50 to-amber-100 p-6 space-y-5">
        <div className="text-center">
          <h3 className="mb-2 text-xl font-bold text-green-700">메뉴 주문 완료!</h3>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-4 border-green-800 bg-green-600 text-white shadow">
            <Check size={32} />
          </div>
          <p className="mt-3 text-sm font-medium text-amber-800">입금 확인 후 메뉴 서빙을 시작합니다.</p>
        </div>

        <div className="rounded-lg border-4 border-amber-600 bg-white p-4 shadow-lg">
          <h4 className="mb-3 border-b-2 border-amber-300 pb-2 text-base font-bold text-amber-900">메뉴 신청 내역</h4>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between py-1 text-sm">
              <span className="text-amber-800">
                {item.title} x {item.quantity}
              </span>
              <span className="tabular-nums font-bold text-amber-900">
                ₩{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="mt-2 border-t-2 border-amber-300 pt-2 text-base font-bold">
            <div className="flex justify-between text-amber-900">
              <span>총 결제 금액</span>
              <span className="tabular-nums">₩{finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={toggleOrder}
          className="w-full rounded-lg border-2 border-amber-800 bg-amber-700 px-4 py-3 font-bold text-white shadow hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          닫기
        </button>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="rounded-lg border-4 border-amber-800 bg-gradient-to-b from-amber-50 to-amber-100 p-4 text-sm">
      {/* 본문 영역을 묶어서 sticky CTA와 겹치지 않도록 하단 여백 확보 */}
      <div className="space-y-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-600 pb-2">
          <h3 className="text-lg font-bold text-amber-900">메뉴 주문서</h3>
          <button
            onClick={toggleOrder}
            className="rounded p-1 text-amber-700 hover:bg-amber-100 hover:text-amber-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* Notice */}
        <div className="rounded-lg border-2 border-red-400 bg-red-50 p-3 text-red-800">
          <p className="mb-2 font-bold">⚠️ 주문 주의사항</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>메뉴 주문 완료 후에는 변경, 취소, 환불이 불가합니다.</li>
            <li>잘못 입력한 정보(테이블 번호, 메뉴 선택 등)에 대한 책임은 신청자에게 있습니다.</li>
            <li>입금자명과 송금 증빙의 명의 불일치 시 메뉴 서빙이 지연될 수 있습니다.</li>
          </ul>
        </div>

        {/* Cart */}
        <div className="rounded-lg border-2 border-amber-400 bg-white p-3">
          <h4 className="mb-3 border-b border-amber-300 pb-1 font-bold text-amber-900">장바구니</h4>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="mb-2 flex items-center justify-between rounded border border-amber-300 bg-amber-50 p-2"
            >
              <span className="font-medium text-amber-900">{item.title}</span>
              <div className="flex items-center gap-2">
                {item.quantity <= 1 ? (
                  <button
                    onClick={() => updateCartItem(item.id, 0)}
                    className="rounded border border-red-400 bg-red-200 p-1 text-xs text-red-700 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                    aria-label="삭제"
                  >
                    <Trash2 size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => updateCartItem(item.id, item.quantity - 1)}
                    className="rounded border border-amber-400 bg-amber-200 p-1 text-amber-800 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    aria-label="수량 감소"
                  >
                    <Minus size={14} />
                  </button>
                )}
                <span className="min-w-[1.5rem] text-center font-bold text-amber-900">{item.quantity}</span>
                <button
                  onClick={() => updateCartItem(item.id, item.quantity + 1)}
                  className="rounded border border-amber-400 bg-amber-200 p-1 text-amber-800 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  aria-label="수량 증가"
                >
                  <Plus size={14} />
                </button>
                <span className="ml-2 tabular-nums font-bold text-amber-900">
                  ₩{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          <div className="mt-3 border-t-2 border-amber-400 pt-2 text-base font-bold">
            <div className="flex justify-between text-amber-900">
              <span>총 결제 금액</span>
              <span className="tabular-nums">₩{finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-amber-800">입금자명</label>
            <input
              name="name"
              value={userInfo.name}
              onChange={handleInfoChange}
              placeholder="입금자 성명"
              className="w-full rounded border-2 border-amber-400 bg-white px-3 py-2 text-sm placeholder:text-amber-600/60 focus:border-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-amber-800">테이블 번호</label>
            <input
              name="phone"
              value={userInfo.phone}
              onChange={handleInfoChange}
              placeholder="1 ~ 64"
              inputMode="numeric"
              className="w-full rounded border-2 border-amber-400 bg-white px-3 py-2 text-sm placeholder:text-amber-600/60 focus:border-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            />
          </div>
        </div>

        {/* People */}
        <div className="mt-1">
          <label className="text-xs font-bold text-amber-800">인원</label>
          <div className="mt-1 flex items-center justify-between rounded border-2 border-amber-400 bg-white px-3 py-2">
            <button
              type="button"
              onClick={() => setTableSize((prev) => Math.max(1, prev - 1))}
              className="rounded border border-amber-400 bg-amber-200 p-2 text-amber-800 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              aria-label="인원 감소"
            >
              <Minus size={14} />
            </button>
            <span className="tabular-nums text-base font-bold text-amber-900">{tableSize}명</span>
            <button
              type="button"
              onClick={() => setTableSize((prev) => prev + 1)}
              className="rounded border border-amber-400 bg-amber-200 p-2 text-amber-800 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              aria-label="인원 증가"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Consent */}
        <div className="rounded-lg border-2 border-amber-400 bg-white p-3 text-xs">
          <p className="mb-1 font-bold text-amber-800">부스 이용 동의</p>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              name="privacyAgree"
              checked={userInfo.privacyAgree}
              onChange={handleInfoChange}
              className="mt-0.5 accent-amber-700"
            />
            <span className="text-amber-800">
              <span className="cursor-pointer font-bold text-blue-600 underline" onClick={() => setShowPrivacy(true)}>
                개인정보 처리방침
              </span>
              에 동의합니다.
            </span>
          </label>
          <label className="mt-2 flex items-start gap-2">
            <input
              type="checkbox"
              name="termsAgree"
              checked={userInfo.termsAgree}
              onChange={handleInfoChange}
              className="mt-0.5 accent-amber-700"
            />
            <span className="text-amber-800">
              <span className="cursor-pointer font-bold text-blue-600 underline" onClick={() => setShowTerms(true)}>
                이용약관
              </span>
              에 동의합니다.
            </span>
          </label>
        </div>

        {/* Bank */}
        <div className="space-y-3 rounded-lg border-4 border-amber-600 bg-white p-4 shadow-lg">
          <h4 className="flex items-center border-b-2 border-amber-300 pb-2 text-base font-bold text-amber-900">
            <DollarSign size={16} className="mr-2 text-amber-700" />
            송금 정보
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-amber-800">은행</span>
              <span className="font-bold text-gray-900">{bankInfo.bank}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-amber-800">계좌번호</span>
              <div className="flex items-center gap-2">
                <span className="tabular-nums font-bold text-gray-900">{bankInfo.account}</span>
                <button
                  onClick={copyAccount}
                  className="rounded bg-blue-100 p-1 text-blue-700 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  aria-live="polite"
                >
                  <Copy size={16} />
                </button>
                {copied && <span className="text-xs font-bold text-green-600">복사됨!</span>}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-amber-800">예금주</span>
              <span className="font-bold text-gray-900">{bankInfo.name}</span>
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-800">송금 증빙 업로드</label>
          <div
            className={`rounded-lg border-4 border-dashed p-4 text-center transition-colors ${
              paymentImage ? 'border-green-500 bg-green-50' : 'border-amber-400 bg-white hover:bg-amber-50'
            }`}
          >
            {paymentImage ? (
              <>
                <div className="flex items-center justify-center font-bold text-green-700">
                  <Check size={16} className="mr-2" /> 업로드 완료
                </div>
                <p className="mt-1 text-xs text-green-700">{paymentImage.name}</p>
                <button
                  onClick={() => setPaymentImage(null)}
                  className="mt-2 text-xs font-bold text-blue-600 underline hover:text-blue-800"
                >
                  다시 업로드
                </button>
              </>
            ) : (
              <>
                <Upload className="mx-auto mb-2 text-amber-600" size={24} />
                <p className="mb-2 font-serif text-xs font-bold text-amber-800">송금 증빙 이미지를 첨부해주세요</p>
                <label className="inline-block cursor-pointer rounded-lg border-2 border-amber-800 bg-amber-700 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-600">
                  파일 선택
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CTA (sticky — 음수 마진 제거, 안전영역 포함) */}
      <div
        className="sticky bottom-0 left-0 right-0 z-10 border-t-2 border-amber-300 bg-gradient-to-b from-amber-100/90 to-amber-100/95 px-4 pt-3 pb-3 backdrop-blur"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}
      >
        <button
          onClick={completeOrder}
          disabled={!userInfo.name || !userInfo.phone || !userInfo.privacyAgree || !userInfo.termsAgree || !paymentImage}
          className="w-full rounded-lg border-2 border-amber-800 bg-amber-700 px-4 py-3 text-base font-bold text-white shadow transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
        >
          주문하기
        </button>
      </div>

      {/* Modals */}
      <PolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} type="privacy" />
      <PolicyModal isOpen={showTerms} onClose={() => setShowTerms(false)} type="terms" />
    </div>
  );
};

export default OrderForm;
