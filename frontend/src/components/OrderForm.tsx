import React, { useState } from 'react';
import axios from 'axios';
import { DollarSign, Upload, Check, User, X } from 'lucide-react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
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
    setUserInfo({
      ...userInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentImage(file);
    }
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
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 text-lg">매수 체결 완료!</h3>
          <button onClick={toggleOrder} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Check size={36} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">주문이 체결되었습니다!</h3>
          <p className="text-gray-600 mb-4">송금 확인 후 메뉴가 준비됩니다.</p>
        </div>
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white p-4 rounded-xl mb-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-200">주문 코드</span>
            <span className="font-bold text-xl">{orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-200">매수 금액</span>
            <span className="font-bold">₩{cartTotal.toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg mb-4">
          <p className="text-sm text-yellow-800">저희 직원이 직접 서빙해드릴 예정입니다.</p>
        </div>
        <button onClick={toggleOrder} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-500 transition-colors shadow-md">확인</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-lg">매수 주문서</h3>
        <button onClick={toggleOrder} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <X size={20} />
        </button>
      </div>
      <div className="bg-blue-50 p-3 rounded-lg mb-4">
        <h4 className="font-bold text-blue-900">주문 내역</h4>
        <div className="flex justify-between text-lg font-bold">
          <span>총액</span>
          <span>₩{cartTotal.toLocaleString()}</span>
        </div>
        <div className="mt-1 text-sm text-blue-600">종목 {cartCount}개 매수</div>
      </div>
      <div className="space-y-3 mb-6">
        {cartItems.map(item => (
          <div key={item.id} className="p-3 bg-gray-50 rounded-lg flex items-center">
            <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover" />
            <div className="ml-3 flex-1">
              <h4 className="font-medium text-gray-900">{item.title}</h4>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-600">{item.quantity}주 × ₩{item.price.toLocaleString()}</p>
                <p className="font-bold">₩{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">매수자명</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={16} className="text-gray-400" />
            </div>
            <input type="text" name="name" value={userInfo.name} onChange={handleInfoChange} placeholder="이름" className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm" required />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">테이블 번호</label>
          <input type="tel" name="phone" value={userInfo.phone} onChange={handleInfoChange} className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" required />
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-start">
          <input id="agrees" name="agrees" type="checkbox" checked={userInfo.agrees} onChange={handleInfoChange} className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded" required />
          <label htmlFor="agrees" className="ml-2 block text-sm text-gray-700">개인정보 수집 및 이용에 동의합니다. (주문 확인용으로만 사용되며 24시간 내 파기)</label>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-2 flex items-center">
          <DollarSign size={16} className="mr-1 text-blue-600" /> 송금 정보
        </h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-gray-500 text-xs">은행명</p>
            <p className="font-medium">{bankInfo.bank}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500 text-xs">계좌번호</p>
            <p className="font-medium">{bankInfo.account}</p>
          </div>
          <div className="col-span-3">
            <p className="text-gray-500 text-xs">예금주</p>
            <p className="font-medium">{bankInfo.name}</p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2 text-sm">송금 증빙 업로드</label>
        <div className={`border-2 border-dashed rounded-lg p-4 text-center ${paymentImage ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
          {paymentImage ? (
            <div>
              <div className="mb-2 text-green-600 font-medium flex items-center justify-center">
                <Check size={18} className="mr-1" /> 업로드 완료
              </div>
              <p className="text-sm text-gray-600">{paymentImage.name}</p>
              <button onClick={() => setPaymentImage(null)} className="mt-2 text-sm text-blue-600 font-medium">다시 업로드</button>
            </div>
          ) : (
            <div>
              <Upload className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">송금 캡쳐 이미지를 첨부해주세요</p>
              <label className="mt-3 inline-flex items-center px-3 py-1.5 bg-blue-600 rounded-md font-medium text-sm text-white cursor-pointer">
                <span>이미지 선택</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          )}
        </div>
      </div>
      <button onClick={completeOrder} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-500 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!userInfo.name || !userInfo.phone || !userInfo.agrees || !paymentImage}>
        주문 체결하기
      </button>
    </div>
  );
};

export default OrderForm;
