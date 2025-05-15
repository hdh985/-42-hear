import React, { useState } from 'react';
import axios from 'axios';
import { DollarSign, Upload, Check, User, X, Plus, Minus } from 'lucide-react';

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
  bank: '신한은행',
  account: '110-123-456789',
  name: '히어컴퍼니',
};

const OrderForm: React.FC<OrderFormProps> = ({ cartItems, cartTotal, cartCount, toggleOrder, updateCartItem }) => {
  const [orderComplete, setOrderComplete] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', agrees: false });
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [orderNumber, setOrderNumber] = useState('');

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPaymentImage(file);
  };

  const completeOrder = async () => {
    if (!userInfo.name || !userInfo.phone || !userInfo.agrees || !paymentImage) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    const items = cartItems.map(item => `${item.title} x ${item.quantity}`);
    const formData = new FormData();
    formData.append('table', userInfo.phone);
    formData.append('name', userInfo.name);
    formData.append('items', JSON.stringify(items));
    formData.append('total', cartTotal.toString());
    formData.append('song', '');
    formData.append('payment_image', paymentImage);
    formData.append('consent', 'true');

    try {
      const response = await axios.post('http://localhost:8000/api/orders', formData);
      setOrderNumber(`STONKS-${response.data.order_id}`);
      setOrderComplete(true);
    } catch (error) {
      alert('주문 전송 실패');
      console.error(error);
    }
  };

  if (orderComplete) {
    return (
      <div className="p-4 text-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">매수 체결 완료!</h3>
          <button onClick={toggleOrder} className="text-gray-500"><X size={20} /></button>
        </div>
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center">
            <Check size={28} />
          </div>
          <p className="font-medium">주문이 접수되었습니다.</p>
          <p className="text-gray-600 text-xs">송금 확인 후 메뉴가 준비됩니다.</p>
        </div>
        <div className="bg-blue-800 text-white p-3 rounded-lg space-y-1">
          <div className="flex justify-between text-sm"><span>주문 코드</span><span>{orderNumber}</span></div>
          <div className="flex justify-between text-sm"><span>총 금액</span><span>₩{cartTotal.toLocaleString()}</span></div>
        </div>
        <button onClick={toggleOrder} className="w-full py-2 bg-blue-600 text-white rounded-lg">확인</button>
      </div>
    );
  }

  return (
    <div className="p-4 text-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">매수 주문서</h3>
        <button onClick={toggleOrder} className="text-gray-500"><X size={20} /></button>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-bold mb-2">주문 내역</h4>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span className="font-medium">{item.title}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => updateCartItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1 rounded bg-gray-200 hover:bg-gray-300"><Minus size={14} /></button>
              <span>{item.quantity}</span>
              <button onClick={() => updateCartItem(item.id, item.quantity + 1)} className="p-1 rounded bg-gray-200 hover:bg-gray-300"><Plus size={14} /></button>
              <span className="ml-2 text-sm">₩{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3">
          <span>총액</span>
          <span>₩{cartTotal.toLocaleString()}</span>
        </div>
      </div>

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

      <div className="flex items-start text-xs">
        <input id="agrees" name="agrees" type="checkbox" checked={userInfo.agrees} onChange={handleInfoChange} className="mr-2" />
        <label htmlFor="agrees" className="text-gray-700">개인정보 수집 및 이용 동의</label>
      </div>

      <div className="bg-gray-50 p-3 rounded text-[11px] text-gray-600 space-y-1">
        <p>[수집 항목] 성명, 전화번호, 송금캡쳐 이미지</p>
        <p>[이용 목적] 축제 부스 운영 및 송금자 확인</p>
        <p>[보유 기간] 행사 종료 후 즉시 파기</p>
        <p className="text-red-500">동의 거부 시 등록 제한</p>
      </div>

      <div className="bg-gray-50 p-3 rounded">
        <h4 className="font-bold mb-2 flex items-center"><DollarSign size={14} className="mr-1" /> 송금 정보</h4>
        <p className="text-xs">은행: {bankInfo.bank}</p>
        <p className="text-xs">계좌: {bankInfo.account}</p>
        <p className="text-xs">예금주: {bankInfo.name}</p>
      </div>

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

      <button
        onClick={completeOrder}
        disabled={!userInfo.name || !userInfo.phone || !userInfo.agrees || !paymentImage}
        className="w-full py-2 bg-blue-700 text-white rounded-lg disabled:opacity-50"
      >
        🛒 주문 체결하기
      </button>
    </div>
  );
};

export default OrderForm;
