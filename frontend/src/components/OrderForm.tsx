// OrderForm.tsx
import React, { useState } from 'react';
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
}

const bankInfo = {
  bank: '토스뱅크',
  account: '1001-9279-2832',
  name: '이수연',
};

const SEAT_FEE_PER_PERSON = 0;

const OrderForm: React.FC<OrderFormProps> = ({ cartItems, cartTotal, cartCount, toggleOrder, updateCartItem }) => {
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

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPaymentImage(file);
  };

  const copyAccount = () => {
    navigator.clipboard.writeText(bankInfo.account)
      .then(() => {
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
      ...cartItems.map(item => `${item.title} x ${item.quantity}`),
      `자리세 x ${tableSize}명 (₩${seatFeeTotal.toLocaleString()})`
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
      alert('현상금 신청 실패');
      console.error(error);
    }
  };

  if (orderComplete) {
    return (
      <div className="p-6 space-y-5 bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg border-4 border-amber-800">
        <div className="text-center">
          <h3 className="text-xl font-bold font-serif text-green-700 mb-2">현상금 신청 완료!</h3>
          <div className="w-20 h-20 mx-auto bg-green-600 text-white rounded-full flex items-center justify-center border-4 border-green-800">
            <Check size={32} />
          </div>
          <p className="text-sm text-amber-800 font-serif mt-3">입금 확인 후 현상범 체포를 시작합니다.</p>
        </div>
        
        <div className="bg-white border-4 border-amber-600 rounded-lg p-4 shadow-lg">
          <h4 className="text-base font-bold font-serif text-amber-900 mb-3 border-b-2 border-amber-300 pb-2">
            현상금 신청 내역
          </h4>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm font-serif py-1">
              <span className="text-amber-800">{item.title} x {item.quantity}</span>
              <span className="font-bold text-amber-900">₩{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t-2 border-amber-300 pt-2 mt-2 text-base">
            <span className="text-amber-900 font-serif">총 현상금</span>
            <span className="text-amber-900 font-serif">₩{finalTotal.toLocaleString()}</span>
          </div>
        </div>
       
        <button 
          onClick={toggleOrder} 
          className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold font-serif rounded-lg border-2 border-amber-800 transition-colors"
        >
          보안관 사무소 닫기
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 text-sm space-y-4 bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg border-4 border-amber-800">
      <div className="flex justify-between items-center border-b-2 border-amber-600 pb-2">
        <h3 className="text-lg font-bold font-serif text-amber-900">현상금 신청서</h3>
        <button onClick={toggleOrder} className="text-amber-700 hover:text-amber-900">
          <X size={20} />
        </button>
      </div>

      <div className="bg-red-100 border-2 border-red-400 text-red-800 text-xs p-3 rounded-lg">
        <p className="font-bold font-serif mb-2">⚠️ 보안관 주의사항</p>
        <ul className="list-disc ml-5 space-y-1 font-serif">
          <li>현상금 신청 완료 후에는 변경, 취소, 환불이 불가합니다.</li>
          <li>잘못 입력한 정보(테이블 번호, 현상범 선택 등)에 대한 책임은 신청자에게 있습니다.</li>
          <li>입금자명과 송금 증빙의 명의 불일치 시 현상금 지급이 지연될 수 있습니다.</li>
        </ul>
      </div>

      <div className="bg-white border-2 border-amber-400 p-3 rounded-lg">
        <h4 className="font-bold font-serif text-amber-900 mb-3 border-b border-amber-300 pb-1">
          체포 대상 현상범
        </h4>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center mb-2 p-2 bg-amber-50 rounded border border-amber-300">
            <span className="font-medium font-serif text-amber-900">{item.title}</span>
            <div className="flex items-center gap-2">
              {item.quantity <= 1 ? (
                <button 
                  onClick={() => updateCartItem(item.id, 0)} 
                  className="p-1 rounded bg-red-200 hover:bg-red-300 text-red-700 text-xs border border-red-400"
                >
                  <Trash2 size={14} />
                </button>
              ) : (
                <button 
                  onClick={() => updateCartItem(item.id, item.quantity - 1)} 
                  className="p-1 rounded bg-amber-200 hover:bg-amber-300 text-amber-800 border border-amber-400"
                >
                  <Minus size={14} />
                </button>
              )}
              <span className="font-bold text-amber-900">{item.quantity}</span>
              <button 
                onClick={() => updateCartItem(item.id, item.quantity + 1)} 
                className="p-1 rounded bg-amber-200 hover:bg-amber-300 text-amber-800 border border-amber-400"
              >
                <Plus size={14} />
              </button>
              <span className="ml-2 text-sm font-bold text-amber-900">
                ₩{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        <div className="flex justify-between font-bold text-base mt-3 pt-2 border-t-2 border-amber-400">
          <span className="font-serif text-amber-900">총 현상금</span>
          <span className="font-serif text-amber-900">₩{finalTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold font-serif text-amber-800">입금자명</label>
          <input 
            name="name" 
            value={userInfo.name} 
            onChange={handleInfoChange} 
            placeholder="보안관 이름" 
            className="w-full px-3 py-2 border-2 border-amber-400 rounded text-sm bg-white focus:border-amber-600" 
          />
        </div>
        <div>
          <label className="text-xs font-bold font-serif text-amber-800">테이블 번호</label>
          <input 
            name="phone" 
            value={userInfo.phone} 
            onChange={handleInfoChange} 
            placeholder="1 ~ 100" 
            className="w-full px-3 py-2 border-2 border-amber-400 rounded text-sm bg-white focus:border-amber-600" 
          />
        </div>
      </div>

      {/* 인원수 */}
      <div className="mt-3">
        <label className="text-xs font-bold font-serif text-amber-800">현상금 헌터 인원</label>
        <div className="flex items-center justify-between bg-white border-2 border-amber-400 rounded px-3 py-2 mt-1">
          <button 
            type="button" 
            onClick={() => setTableSize(prev => Math.max(1, prev - 1))} 
            className="p-2 rounded bg-amber-200 hover:bg-amber-300 text-amber-800 border border-amber-400"
          >
            <Minus size={14} />
          </button>
          <span className="font-bold text-base font-serif text-amber-900">{tableSize}명</span>
          <button 
            type="button" 
            onClick={() => setTableSize(prev => prev + 1)} 
            className="p-2 rounded bg-amber-200 hover:bg-amber-300 text-amber-800 border border-amber-400"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* 동의 체크 */}
      <div className="flex flex-col gap-2 text-xs mt-3 p-3 bg-white border-2 border-amber-400 rounded-lg">
        <p className="font-bold font-serif text-amber-800 mb-1">보안관 규정 동의</p>
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            name="privacyAgree"
            checked={userInfo.privacyAgree}
            onChange={handleInfoChange}
            className="mt-0.5"
          />
          <span className="font-serif text-amber-800">
            <span className="text-blue-600 underline cursor-pointer font-bold" onClick={() => setShowPrivacy(true)}>
              개인정보 처리방침
            </span>에 동의합니다.
          </span>
        </label>
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            name="termsAgree"
            checked={userInfo.termsAgree}
            onChange={handleInfoChange}
            className="mt-0.5"
          />
          <span className="font-serif text-amber-800">
            <span className="text-blue-600 underline cursor-pointer font-bold" onClick={() => setShowTerms(true)}>
              이용약관
            </span>에 동의합니다.
          </span>
        </label>
      </div>

      {/* 송금 정보 */}
      <div className="bg-white border-4 border-amber-600 p-4 rounded-lg space-y-3 shadow-lg">
        <h4 className="text-base font-bold font-serif text-amber-900 flex items-center border-b-2 border-amber-300 pb-2">
          <DollarSign size={16} className="mr-2 text-amber-700" /> 
          현상금 송금 정보
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-serif">
            <span className="font-bold text-amber-800">은행</span>
            <span className="text-gray-900 font-bold">{bankInfo.bank}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-serif">
            <span className="font-bold text-amber-800">계좌번호</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 font-bold">{bankInfo.account}</span>
              <button 
                onClick={copyAccount} 
                className="text-blue-600 hover:text-blue-800 p-1 bg-blue-100 rounded"
              >
                <Copy size={16} />
              </button>
              {copied && <span className="text-green-600 text-xs font-bold">복사됨!</span>}
            </div>
          </div>
          <div className="flex justify-between items-center text-sm font-serif">
            <span className="font-bold text-amber-800">예금주</span>
            <span className="text-gray-900 font-bold">{bankInfo.name}</span>
          </div>
        </div>
      </div>

      {/* 송금 이미지 업로드 */}
      <div className="space-y-2">
        <label className="text-xs font-bold font-serif text-amber-800">송금 증빙 업로드</label>
        <div className={`border-4 border-dashed rounded-lg p-4 text-center transition-colors ${
          paymentImage 
            ? 'border-green-500 bg-green-50' 
            : 'border-amber-400 bg-white hover:bg-amber-50'
        }`}>
          {paymentImage ? (
            <>
              <div className="text-green-700 flex justify-center items-center font-bold">
                <Check size={16} className="mr-2" /> 
                업로드 완료
              </div>
              <p className="text-xs font-serif text-green-700 mt-1">{paymentImage.name}</p>
              <button 
                onClick={() => setPaymentImage(null)} 
                className="text-blue-600 text-xs mt-2 font-bold underline"
              >
                다시 업로드
              </button>
            </>
          ) : (
            <>
              <Upload className="mx-auto text-amber-600 mb-2" size={24} />
              <p className="text-xs font-serif text-amber-800 font-bold mb-2">
                송금 증빙 이미지를 첨부해주세요
              </p>
              <label className="inline-block text-white bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg text-xs cursor-pointer font-bold border-2 border-amber-800 transition-colors">
                파일 선택
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </>
          )}
        </div>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={completeOrder}
        disabled={!userInfo.name || !userInfo.phone || !userInfo.privacyAgree || !userInfo.termsAgree || !paymentImage}
        className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold font-serif rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border-2 border-amber-800 text-base transition-colors"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
      >
        현상금 신청하기
      </button>

      {/* 모달 */}
      <PolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} type="privacy" />
      <PolicyModal isOpen={showTerms} onClose={() => setShowTerms(false)} type="terms" />
    </div>
  );
};

export default OrderForm;