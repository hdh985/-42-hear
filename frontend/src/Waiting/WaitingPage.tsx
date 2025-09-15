import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function WaitingPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    formData.append('phone', phone.replace(/\D/g, ''));
    formData.append('tableSize', partySize.toString());
    formData.append('consent', 'true');

    try {
      setIsSubmitting(true);
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/waiting`, formData);

      alert('등록 완료! 대기 명단에 추가되었습니다.');
      setName('');
      setPhone('');
      setPartySize(1);
      setAgreed(false);
      navigate('/waiting');
    } catch (err) {
      console.error(err);
      alert('등록 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length >= 4 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length >= 8) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2f1a16] via-[#3a1f1b] to-[#2f1a16] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-amber-50 rounded-2xl shadow-2xl border-[3px] border-[#76231c] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5a1a16] via-[#76231c] to-[#5a1a16] text-white text-center py-6 px-4 border-b-4 border-yellow-600">
          <div className="text-[10px] tracking-widest text-yellow-200 uppercase">2025 가을 아델란테 : 경희의 울림으로</div>
          <h1 className="text-3xl font-extrabold tracking-[0.25em] mt-1">HERAT SHOT</h1>
          <div className="mt-2 text-xs text-yellow-200">제42대 외국어대학 학생회 hear</div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="text-center text-xs text-[#76231c] font-medium bg-yellow-100/70 border border-yellow-300 rounded-lg px-3 py-2">
            📢 문자 발송 후 <span className="font-bold">5분</span> 내 미입장 시 자동 취소됩니다.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {/* Name */}
            <div>
              <label className="font-semibold text-[#76231c] uppercase tracking-wide text-[11px]">예약자명</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="대표자 한 분만 입력"
                className="w-full mt-1 px-3 py-2 rounded-lg border-[1.5px] border-[#76231c]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#76231c]/30 focus:border-[#76231c] placeholder-gray-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="font-semibold text-[#76231c] uppercase tracking-wide text-[11px]">전화번호</label>
              <input
                type="text"
                inputMode="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="010-1234-5678"
                className="w-full mt-1 px-3 py-2 rounded-lg border-[1.5px] border-[#76231c]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#76231c]/30 focus:border-[#76231c] placeholder-gray-400"
              />
            </div>

            {/* Party Size (Western stepper) */}
            <div>
              <label className="font-semibold text-[#76231c] uppercase tracking-wide text-[11px]">인원 수</label>
              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPartySize(v => Math.max(1, v - 1))}
                  className="h-10 w-10 rounded-lg border-[1.5px] border-[#76231c] text-[#76231c] font-bold hover:bg-[#76231c]/10 active:scale-95 transition"
                  aria-label="decrease"
                >
                  −
                </button>
                <input
                  readOnly
                  value={partySize}
                  className="w-full text-center px-3 py-2 rounded-lg border-[1.5px] border-[#76231c]/40 bg-white font-semibold tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setPartySize(v => Math.min(20, v + 1))}
                  className="h-10 w-10 rounded-lg border-[1.5px] border-[#76231c] text-[#76231c] font-bold hover:bg-[#76231c]/10 active:scale-95 transition"
                  aria-label="increase"
                >
                  +
                </button>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">최대 20명까지 등록 가능합니다.</p>
            </div>

            {/* Consent */}
            <div className="flex items-start text-xs text-gray-700">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-[3px] mr-2 h-4 w-4 rounded border-[#76231c]/60 text-[#76231c] focus:ring-[#76231c]"
              />
              <span>
                <button type="button" onClick={() => setShowModal(true)} className="text-[#76231c] underline font-medium">
                  개인정보 수집·이용 동의서 보기
                </button>
              </span>
            </div>

            {/* Actions */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#76231c] text-white font-extrabold rounded-xl tracking-widest shadow hover:bg-[#5a1a16] disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? '등록 중…' : '✅ 대기 등록하기'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/waiting')}
              className="w-full py-3 border-2 border-[#76231c] text-[#76231c] font-extrabold rounded-xl tracking-widest hover:bg-[#76231c]/5 transition"
            >
              📋 대기 명단 보기
            </button>
          </form>
        </div>

        {/* Footer Ribbon */}
        <div className="bg-[#76231c] text-yellow-200 text-center text-[11px] py-2 tracking-widest uppercase">
          ★ 행사간 발생한 수익금은 모두 학생회비로 귀속됩니다 ★
        </div>
      </div>

      {/* Consent Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex justify-center items-center z-50 p-4">
          <div className="bg-amber-50 p-6 rounded-2xl shadow-2xl w-full max-w-sm border-[3px] border-[#76231c]">
            <h3 className="text-base font-extrabold tracking-widest text-[#76231c] mb-3 uppercase">개인정보 수집·이용 동의서</h3>
            <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed bg-white border border-[#76231c]/20 rounded-lg p-3">
              {[`[수집하는 개인정보 항목]\n- 성명, 전화번호\n\n[수집 및 이용 목적]\n- 입장 확인, 연락 및 호출\n\n[보유 및 이용 기간]\n- 행사 종료 후 즉시 파기됨\n\n※ 귀하는 이에 대한 동의를 거부할 수 있으며, 동의하지 않을 경우 등록이 제한됩니다.`]}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-[#76231c] text-white text-sm py-2.5 rounded-xl font-bold tracking-widest hover:bg-[#5a1a16] transition"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
