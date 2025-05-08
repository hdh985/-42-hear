import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function WaitingPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [agreed, setAgreed] = useState(false); // ✅ 동의 여부
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('이름과 전화번호를 입력해주세요');
      return;
    }
    if (!agreed) {
      alert('개인정보 수집 및 이용에 동의해주세요');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('tableSize', partySize.toString());
    formData.append('consent', 'true'); // ✅ 누락된 부분 추가

    try {
      await axios.post('http://localhost:8000/api/waiting', formData);
      alert('등록 완료! 조금만 기다려주세요 😊');
      setName('');
      setPhone('');
      setPartySize(1);
      setAgreed(false);
      navigate('/waiting');
    } catch (err) {
      console.error(err);
      alert('등록 실패');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-indigo-700 text-center mb-2 tracking-wide">
          외국어대학 학생회 <span className="text-black">HEAR</span> Waiting hear
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          ❗️ 5분 이내 입장 불가 시 다음 순번으로 넘어갑니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">예약자 성함</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="대표자 한 분만"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">전화번호</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">인원 수</label>
            <input
              type="number"
              min={1}
              max={20}
              required
              value={partySize}
              onChange={e => setPartySize(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mr-2"
              id="agree"
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              <span onClick={() => setShowModal(true)} className="text-blue-600 underline cursor-pointer">
                개인정보 수집·이용에 동의합니다
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            입장 등록
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-2 text-indigo-600">개인정보 수집·이용 동의서</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {`[수집하는 개인정보 항목]
- 성명, 전화번호

[수집 및 이용 목적]
- 입장 확인, 연락 및 호출

[보유 및 이용 기간]
- 행사 종료 후 즉시 파기됨

※ 귀하는 이에 대한 동의를 거부할 수 있으며, 동의하지 않을 경우 등록이 제한됩니다.`}
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
