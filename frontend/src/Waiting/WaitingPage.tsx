import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function WaitingPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('닉네임과 전화번호를 입력해주세요');
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
    formData.append('consent', 'true');

    try {
      await axios.post('http://localhost:8000/api/waiting', formData);
      alert('등록 완료! 대기 명단에 추가되었습니다.');
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, ''); // 숫자만 남기기
    let formatted = raw;
    if (raw.length >= 4 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length >= 8) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-300 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white text-center py-6 px-4">
          <h1 className="text-2xl font-extrabold">hear: Company</h1>
          <p className="text-xs text-blue-200 mt-1">제42대 외국어대학 학생회 Hear</p>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-center text-sm text-gray-500">📢 문장 발송 부터 5분 내 미입장 시 자동 취소됩니다.</p>
        
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="font-medium">예약자명</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="대표자 한 분만 입력"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="font-medium">전화번호</label>
              <input
                type="text"
                inputMode="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="010-1234-5678"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="font-medium">인원 수</label>
              <input
                type="number"
                min={1}
                max={20}
                value={partySize}
                onChange={e => setPartySize(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

          
            <div className="flex items-start text-xs text-gray-700">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 mr-2"
              />
              <span>
                <button type="button" onClick={() => setShowModal(true)} className="text-blue-600 underline">
                  개인정보 수집·이용 동의서 보기
                </button>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition"
            >
              ✅ 대기 등록하기
            </button>

            <button
              type="button"
              onClick={() => navigate('/waiting')}
              className="w-full py-2 border border-blue-600 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              📋 대기 명단 보기
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full border border-blue-600">
            <h3 className="text-base font-bold text-blue-700 mb-3">개인정보 수집·이용 동의서</h3>
            <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">
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
              className="mt-4 w-full bg-blue-700 text-white text-sm py-2 rounded-lg hover:bg-blue-800 transition"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
