import React, { useState } from 'react';
import axios from 'axios';

export default function WaitingForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tableSize, setTableSize] = useState(2);
  const [consent, setConsent] = useState(false); // ✅ 동의 여부 상태

  const handleSubmit = async () => {
    if (!name || !phone) return alert('이름과 전화번호를 입력해주세요');
    if (!consent) return alert('개인정보 수집 및 이용에 동의해주세요.');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone.replace(/\D/g, '')); // ✅ 하이픈 제거 후 전송



    formData.append('tableSize', tableSize.toString());
    formData.append('consent', 'true'); // ✅ 서버에 동의 여부 전달

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/waiting`, formData);
      alert('대기 등록 완료!');
      setName('');
      setPhone('');
      setTableSize(2);
      setConsent(false);
    } catch (err) {
      console.error(err);
      alert('등록 실패');
    }
  };

  return (
    <div className="container">
      <h2 className="text-xl font-bold mb-4">⏳ 대기 등록</h2>

      <input
        type="text"
        placeholder="이름을 입력하세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input mb-2"
      />

      <input
        type="tel"
        placeholder="전화번호를 입력하세요"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="input mb-2"
      />

      <select
        value={tableSize}
        onChange={(e) => setTableSize(Number(e.target.value))}
        className="input mb-2"
      >
        <option value={2}>2인</option>
        <option value={3}>3인</option>
        <option value={4}>4인</option>
      </select>

      {/* ✅ 개인정보 수집 동의 체크박스 */}
      <label className="block mb-2 text-sm">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mr-2"
        />
        개인정보 수집 및 이용에 동의합니다.
      </label>

      <button className="order-button" onClick={handleSubmit}>등록</button>
    </div>
  );
}
