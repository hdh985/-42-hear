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
      setOrderNumber(`STONKS-${response.data.order_id}`);
      setOrderComplete(true);
    } catch (error) {
      alert('주문 전송 실패');
      console.error(error);
    }
  };

  if (orderComplete) {
    return (
      <div className="p-6 space-y-5">
        <h3 className="text-xl font-bold text-green-600 text-center">주문 체결 완료!</h3>
        <div className="w-20 h-20 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center">
          <Check size={32} />
        </div>
        <p className="text-sm text-gray-700 text-center">송금 확인 후 메뉴가 준비됩니다.</p>
        <div className="bg-white border rounded-lg p-4 shadow space-y-3">
          <h4 className="text-base font-bold">📝 주문 내역</h4>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.title} x {item.quantity}</span>
              <span>₩{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          {/* <div className="flex justify-between text-sm">
            <span>자리세 x {tableSize}명</span>
            <span>₩{seatFeeTotal.toLocaleString()}</span>
          </div> */}
          <div className="flex justify-between font-bold border-t pt-2 mt-2 text-sm">
            <span>총 결제 금액</span>
            <span>₩{finalTotal.toLocaleString()}</span>
          </div>
        </div>
       
        <button onClick={toggleOrder} className="w-full py-2 bg-blue-600 text-white rounded-lg">닫기</button>
      </div>
    );
  }

  return (
    <div className="p-4 text-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">매수 주문서</h3>
        <button onClick={toggleOrder} className="text-gray-500"><X size={20} /></button>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-xs p-3 rounded space-y-1">
        <p className="font-semibold">⚠️ 유의사항</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>주문 완료 후에는 메뉴 변경, 취소, 환불 등 어떤 유형도 불가합니다.</li>
          <li>이용자가 잘못 입력한 정보(테이블 번호, 메뉴 선택, 금액 등)에 대한 책임은 이용자 본인에게 있습니다.</li>
          <li>입금자명과 송금 증빙 이미지의 명의 불일치로 발생하는 혼선에 대한 책임은 이용자 본인에게 있습니다.</li>
        </ul>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-bold mb-2">주문 내역</h4>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span className="font-medium">{item.title}</span>
            <div className="flex items-center gap-2">
              {item.quantity <= 1 ? (
                <button onClick={() => updateCartItem(item.id, 0)} className="p-1 rounded bg-red-200 hover:bg-red-300 text-red-600 text-xs">
                  <Trash2 size={14} />
                </button>
              ) : (
                <button onClick={() => updateCartItem(item.id, item.quantity - 1)} className="p-1 rounded bg-gray-200 hover:bg-gray-300">
                  <Minus size={14} />
                </button>
              )}
              <span>{item.quantity}</span>
              <button onClick={() => updateCartItem(item.id, item.quantity + 1)} className="p-1 rounded bg-gray-200 hover:bg-gray-300"><Plus size={14} /></button>
              <span className="ml-2 text-sm">₩{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          </div>
        ))}
        {/* <div className="flex justify-between items-center mt-2 border-t pt-2 font-medium text-sm">
          <span>자리세 x {tableSize}명</span>
          <span>₩{seatFeeTotal.toLocaleString()}</span>
        </div> */}
        <div className="flex justify-between font-bold text-base mt-2">
          <span>총 결제 금액</span>
          <span>₩{finalTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs">입금자명</label>
          <input name="name" value={userInfo.name} onChange={handleInfoChange} placeholder="이름" className="w-full px-3 py-2 border rounded text-sm" />
        </div>
        <div>
          <label className="text-xs">테이블 번호</label>
          <input name="phone" value={userInfo.phone} onChange={handleInfoChange} placeholder="1 ~ 100" className="w-full px-3 py-2 border rounded text-sm" />
        </div>
      </div>

      {/* 인원수 */}
      <div className="mt-3">
        <label className="text-xs font-medium">인원수</label>
        <div className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2 mt-1">
          <button type="button" onClick={() => setTableSize(prev => Math.max(1, prev - 1))} className="p-2 rounded bg-gray-200 hover:bg-gray-300"><Minus size={14} /></button>
          <span className="font-bold text-base">{tableSize}명</span>
          <button type="button" onClick={() => setTableSize(prev => prev + 1)} className="p-2 rounded bg-gray-200 hover:bg-gray-300"><Plus size={14} /></button>
        </div>
      </div>

      {/* 동의 체크 */}
      <div className="flex flex-col gap-2 text-xs mt-3">
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            name="privacyAgree"
            checked={userInfo.privacyAgree}
            onChange={handleInfoChange}
          />
          <span>
            <span className="text-blue-600 underline cursor-pointer" onClick={() => setShowPrivacy(true)}>개인정보 처리방침</span>에 동의합니다.
          </span>
        </label>
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            name="termsAgree"
            checked={userInfo.termsAgree}
            onChange={handleInfoChange}
          />
          <span>
            <span className="text-blue-600 underline cursor-pointer" onClick={() => setShowTerms(true)}>이용약관</span>에 동의합니다.
          </span>
        </label>
      </div>

      {/* 송금 정보 (유지) */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2">
        <h4 className="text-base font-bold flex items-center"><DollarSign size={16} className="mr-2 text-blue-600" /> 송금 정보</h4>
        <div className="flex justify-between items-center text-sm font-medium">
          <span>은행</span>
          <span className="text-gray-900">{bankInfo.bank}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium">
          <span>계좌번호</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-900">{bankInfo.account}</span>
            <button onClick={copyAccount} className="text-blue-600 hover:text-blue-800"><Copy size={16} /></button>
            {copied && <span className="text-green-500 text-xs">복사됨!</span>}
          </div>
        </div>
        <div className="flex justify-between items-center text-sm font-medium">
          <span>예금주</span>
          <span className="text-gray-900">{bankInfo.name}</span>
        </div>
      </div>

      {/* 송금 이미지 업로드 */}
      <div className="space-y-2">
        <label className="text-xs">송금 증빙 업로드</label>
        <div className={`border-2 border-dashed rounded p-3 text-center ${paymentImage ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
          {paymentImage ? (
            <>
              <div className="text-green-600 flex justify-center items-center"><Check size={14} className="mr-1" /> 업로드 완료</div>
              <p className="text-xs">{paymentImage.name}</p>
              <button onClick={() => setPaymentImage(null)} className="text-blue-600 text-xs mt-1">다시 업로드</button>
            </>
          ) : (
            <>
              <Upload className="mx-auto text-gray-400" size={20} />
              <p className="text-xs mt-1">송금 캡쳐 이미지를 첨부해주세요</p>
              <label className="inline-block mt-2 text-white bg-blue-600 px-3 py-1 rounded text-xs cursor-pointer">
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
        className="w-full py-2 bg-blue-700 text-white rounded-lg disabled:opacity-50"
      >
        🛒 결제하기
      </button>

      {/* 모달 */}
      <PolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} type="privacy" />
      <PolicyModal isOpen={showTerms} onClose={() => setShowTerms(false)} type="terms" />
    </div>
  );
};

export default OrderForm;
