import React, { useState } from 'react';

type Props = {
  tableNumber: string;
  customerName: string;
  songRequest: string;
  setTableNumber: (v: string) => void;
  setCustomerName: (v: string) => void;
  setSongRequest: (v: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  submitOrder: () => void;
  totalPrice: number;
  consent: boolean;
  setConsent: (v: boolean) => void;
};

export default function OrderForm({
  tableNumber, customerName, songRequest,
  setTableNumber, setCustomerName, setSongRequest,
  handleImageChange, previewUrl, submitOrder, totalPrice,
  consent, setConsent
}: Props) {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    if (!consent) {
      alert('개인정보 수집·이용에 동의해주세요.');
      return;
    }
    if (!previewUrl) {
      alert('송금 내역 이미지를 첨부해주세요.');
      return;
    }
    submitOrder();
  };

  return (
    <div className="menu-section">
      <h2 className="section-title">주문 정보</h2>

      <div style={{ marginBottom: 15 }}>
        <label className="font-bold block mb-1">테이블 번호</label>
        <input
          type="number"
          min="1"
          value={tableNumber}
          onChange={e => setTableNumber(e.target.value)}
          placeholder="테이블 번호 입력"
          className="input"
          required
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label className="font-bold block mb-1">입금자명</label>
        <input
          type="text"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          placeholder="입금자명을 입력해주세요"
          className="input"
          required
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label className="font-bold block mb-1">신청곡</label>
        <input
          type="text"
          value={songRequest}
          onChange={e => setSongRequest(e.target.value)}
          placeholder="듣고 싶은 노래를 적어주세요"
          className="input"
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label className="font-bold block mb-1">송금 내역 캡쳐</label>
        <label className="upload-label">
          📷 사진 업로드
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
        </label>
        <div className="upload-preview">
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="h-full object-contain" />
          ) : (
            <p className="text-gray-500">이미지가 없습니다</p>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-start gap-2">
        <input
          type="checkbox"
          id="agree"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <label htmlFor="agree" className="text-sm text-gray-700">
          <span onClick={() => setShowModal(true)} className="text-blue-600 underline cursor-pointer">
            개인정보 수집·이용에 동의합니다
          </span>
        </label>
      </div>

      <button className="order-button" onClick={handleSubmit}>
        {totalPrice > 0 ? `${totalPrice.toLocaleString()}원 주문하기` : '주문하기'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-2 text-indigo-600">개인정보 수집·이용 동의서</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {`[수집하는 개인정보 항목]
- 성명, 전화번호, 송금내역 이미지

[수집 및 이용 목적]
- 주문 확인, 주문 내역 관리 및 응대

[보유 및 이용 기간]
- 행사 종료 후 즉시 파기됨

※ 귀하는 이에 대한 동의를 거부할 수 있으며, 동의하지 않을 경우 주문이 제한됩니다.`}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
