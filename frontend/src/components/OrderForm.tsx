import React, { useState } from 'react';
import axios from 'axios';
import { DollarSign, Upload, Check, User, X } from 'lucide-react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface UserInfoType {
  name: string;
  phone: string;
  agrees: boolean;
}

interface BankInfo {
  bank: string;
  account: string;
  name: string;
}

interface OrderFormProps {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  toggleOrder: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ cartItems, cartTotal, cartCount, toggleOrder }) => {
  const [orderComplete, setOrderComplete] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoType>({ name: '', phone: '', agrees: false });
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [orderNumber, setOrderNumber] = useState('');

  const bankInfo: BankInfo = {
    bank: '신한은행',
    account: '110-123-456789',
    name: '히어컴퍼니'
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserInfo({ ...userInfo, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPaymentImage(file);
  };

  const completeOrder = async () => {
    if (!userInfo.name || !userInfo.phone || !userInfo.agrees) {
      alert('모든 정보를 입력하고 개인정보 수집에 동의해주세요.');
      return;
    }
    if (!paymentImage) {
      alert('송금 내역 이미지를 업로드해주세요.');
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
      alert('주문 전송에 실패했습니다.');
      console.error(error);
    }
  };

  if (orderComplete) {
    return (
      <div className="p-3 text-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">매수 체결 완료!</h3>
          <button onClick={toggleOrder} className="p-2 text-gray-500">
            <X size={18} />
          </button>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
            <Check size={28} className="text-white" />
          </div>
          <h3 className="font-bold mb-1">주문이 체결되었습니다!</h3>
          <p className="text-gray-600 mb-3">송금 확인 후 메뉴가 준비됩니다.</p>
        </div>
        <div className="bg-blue-800 text-white p-3 rounded-lg mb-3">
          <div className="flex justify-between mb-1">
            <span>주문 코드</span>
            <span className="font-bold">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>매수 금액</span>
            <span className="font-bold">₩{cartTotal.toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded mb-3">
          <p>저희 직원이 직접 서빙해드릴 예정입니다.</p>
        </div>
        <button onClick={toggleOrder} className="w-full py-2 bg-blue-600 text-white rounded-full">확인</button>
      </div>
    );
  }

  return (
    <div className="p-3 text-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">매수 주문서</h3>
        <button onClick={toggleOrder} className="p-2 text-gray-500">
          <X size={18} />
        </button>
      </div>
      <div className="bg-blue-50 p-2 rounded mb-3">
        <h4 className="font-bold text-blue-900">주문 내역</h4>
        <div className="flex justify-between font-bold">
          <span>총액</span>
          <span>₩{cartTotal.toLocaleString()}</span>
        </div>
        <p className="text-blue-600 mt-1">종목 {cartCount}개 매수</p>
      </div>
      <div className="space-y-2 mb-4">
        {cartItems.map(item => (
          <div key={item.id} className="p-2 bg-gray-50 rounded flex justify-between items-center">
            <span className="font-medium">{item.title}</span>
            <span>{item.quantity} × ₩{item.price.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block mb-1">매수자명</label>
          <div className="relative">
            <div className="absolute left-2 top-2.5 text-gray-400">
              <User size={14} />
            </div>
            <input type="text" name="name" value={userInfo.name} onChange={handleInfoChange} placeholder="이름" className="pl-8 pr-2 py-2 border rounded text-sm w-full" />
          </div>
        </div>
        <div>
          <label className="block mb-1">테이블 번호</label>
          <input type="tel" name="phone" value={userInfo.phone} onChange={handleInfoChange} className="px-2 py-2 border rounded text-sm w-full" />
        </div>
      </div>
      <div className="flex items-start mb-3">
  <input id="agrees" name="agrees" type="checkbox" checked={userInfo.agrees} onChange={handleInfoChange} className="mt-1 h-4 w-4" />
      <label htmlFor="agrees" className="ml-2 text-xs font-medium">개인정보 수집 및 이용 동의</label>
    </div>

    <div className="bg-gray-50 border border-gray-300 rounded p-3 mb-4 text-[11px] text-gray-600 leading-snug">
      <p className="font-semibold mb-1">[수집하는 개인정보 항목]</p>
      <p>- 성명, 전화번호</p>
      <p className="font-semibold mt-2 mb-1">[수집 및 이용 목적]</p>
      <p>- 입장 확인, 연락 및 호출</p>
      <p className="font-semibold mt-2 mb-1">[보유 및 이용 기간]</p>
      <p>- 행사 종료 후 즉시 파기됨</p>
      <p className="mt-2 text-red-500">※ 귀하는 이에 대한 동의를 거부할 수 있으며, 동의하지 않을 경우 등록이 제한됩니다.</p>
      </div>

      <div className="bg-gray-50 p-3 rounded mb-3">
        <h4 className="font-bold mb-2 flex items-center"><DollarSign size={14} className="mr-1 text-blue-600" /> 송금 정보</h4>
        <div className="text-xs">
          <div className="mb-1">은행명: {bankInfo.bank}</div>
          <div className="mb-1">계좌번호: {bankInfo.account}</div>
          <div>예금주: {bankInfo.name}</div>
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1">송금 증빙 업로드</label>
        <div className={`border-2 border-dashed rounded p-3 text-center ${paymentImage ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
          {paymentImage ? (
            <div>
              <div className="mb-1 text-green-600 flex items-center justify-center">
                <Check size={16} className="mr-1" /> 업로드 완료
              </div>
              <p className="text-xs">{paymentImage.name}</p>
              <button onClick={() => setPaymentImage(null)} className="mt-2 text-blue-600 text-xs">다시 업로드</button>
            </div>
          ) : (
            <div>
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-1 text-xs text-gray-600">송금 캡쳐 이미지를 첨부해주세요</p>
              <label className="mt-2 inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded cursor-pointer">
                이미지 선택
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          )}
        </div>
      </div>
      <button onClick={completeOrder} className="w-full py-2 bg-blue-600 text-white rounded" disabled={!userInfo.name || !userInfo.phone || !userInfo.agrees || !paymentImage}>
        주문 체결하기
      </button>
    </div>
  );
};

export default OrderForm;
