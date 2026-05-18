import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const termsContent = `제1조 (목적)
이 약관은 경희대학교 축제 부스 운영자인 제28대 한국어학과 학생회 윤슬이 제공하는 온라인 주문 서비스의 이용조건 및 절차, 권리·의무 및 책임사항을 명확히 하여 원활한 거래를 도모함을 목적으로 합니다.

제2조 (용어의 정의)
운영자: 축제 부스를 운영하며 본 서비스를 제공하는 자.
이용자: 본 약관에 동의하고 서비스를 이용하는 자.
서비스: 메뉴 선택, 결제 정보 입력, 송금 후 주문 접수까지의 온라인 주문 처리 절차.
주문완료: 이용자가 주문 및 결제를 완료하고 운영자가 이를 확인한 상태.
송금증빙: 결제 완료를 증명하는 이미지(캡쳐 등) 파일.

제3조 (이용계약 성립)
이용자는 본 약관 및 개인정보 수집·이용 동의서에 동의함으로써 서비스 이용계약이 성립됩니다.
이용자는 주문 시 정확한 정보를 기재해야 하며, 허위 정보 기재 시 발생하는 책임은 이용자에게 있습니다.

제4조 (서비스 이용절차)
이용자는 메뉴를 선택하고 주문서를 작성한 후, 운영자가 안내한 계좌로 송금 후 증빙 이미지를 업로드하여 주문을 완료합니다.
주문 완료 후에는 원칙적으로 메뉴 변경, 취소, 환불이 불가합니다.
운영자는 송금 증빙과 주문 정보를 확인 후 제공 절차를 진행합니다.

제5조 (책임의 범위 및 한계)
이용자가 잘못 입력한 정보(테이블 번호, 메뉴 선택, 금액 등)에 대한 책임은 이용자 본인에게 있습니다.
입금자명과 송금 증빙 이미지의 명의 불일치로 발생하는 혼선은 이용자의 책임입니다.
서버 오류, 네트워크 장애 등 불가항력적 사유로 인한 서비스 중단 시 운영자는 책임을 지지 않습니다.
행사장 상황(품절, 안전사고 등)에 따라 주문이 제한될 수 있으며, 이에 대한 사전 공지는 최선을 다해 이루어집니다.

제6조 (환불 및 취소 규정)
이용자의 단순 변심에 의한 환불은 불가합니다.
주문 오류(운영자의 명백한 실수) 발생 시 현장 운영자의 재량으로 환불 여부를 결정합니다.
환불 요청 시 결제 증빙 및 주문 정보를 반드시 제시해야 합니다.

제7조 (개인정보 보호)
이용자가 제공한 개인정보는 축제 부스 운영 및 송금 확인 목적으로만 사용됩니다.
개인정보는 행사 종료 후 7일 이내에 파기됩니다.
개인정보 처리에 대한 자세한 사항은 별도의 개인정보처리방침을 따릅니다.

제8조 (지적재산권)
서비스와 관련된 모든 자료(디자인, 상표, 콘텐츠 등)의 지적재산권은 운영자에게 있으며, 무단 복제, 배포, 도용을 금지합니다.

제9조 (분쟁 해결 및 관할)
서비스 이용과 관련하여 분쟁이 발생할 경우, 운영자와 이용자는 성실히 협의하여 해결합니다.
협의가 이루어지지 않을 경우, 운영자 소재지 관할 법원을 제1심 전속 관할로 합니다.

부칙
본 약관은 2026년 5월 28일부터 시행됩니다.
본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.`;

  const privacyContent = `제1조 (개인정보의 수집 항목)
서비스 제공을 위해 다음의 개인정보를 수집합니다.
- 필수 수집 항목: 이름, 전화번호, 테이블 인원수, 송금 증빙 이미지

제2조 (개인정보의 이용 목적)
수집된 개인정보는 다음의 목적을 위해 사용됩니다.
- 주문 확인 및 고객 식별
- 입금 확인 및 송금자 일치 여부 확인
- 축제 부스 내 서비스 운영 및 사후 대응

제3조 (개인정보의 보유 및 이용 기간)
개인정보는 해당 행사 종료 후 입금자 확인 후 즉시 파기됩니다.
이미지 포함 모든 자료는 입금자 확인 후 삭제 처리됩니다.

제4조 (개인정보의 제3자 제공)
외부에 제공하지 않으며 운영자(한국어학과 학생회 윤슬)만 열람 가능합니다.

제5조 (개인정보의 파기 절차 및 방법)
행사 종료 즉시 수집된 정보는 전자적 파일 형태로 안전하게 삭제됩니다.
물리적 보관 자료는 존재하지 않으며 서버에만 일시 보관됩니다.

제6조 (이용자의 권리)
이용자는 본인의 개인정보 수집 및 이용에 동의하지 않을 수 있으며, 이 경우 서비스 이용이 제한됩니다.
본인 요청 시 개인정보 열람, 정정, 삭제가 가능합니다.

문의처
한국어학과 학생회 윤슬 운영팀
전화: 010-8921-9358

부칙
본 방침은 2026년 5월 28일부터 시행됩니다.`;

  return createPortal(
    <>
      {/* 배경 */}
      <div
        aria-hidden
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'fade-in 0.18s ease both',
        }}
      />

      {/* 모달 */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 210,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '0',
          pointerEvents: 'none',
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeTab === 'terms' ? '이용약관' : '개인정보처리방침'}
          onClick={e => e.stopPropagation()}
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90dvh',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '20px 20px 0 0',
            background: '#FFFFFF',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            animation: 'slide-up-sheet 0.3s cubic-bezier(.32,.72,0,1) both',
          }}
        >
          {/* 헤더 */}
          <div style={{
            flexShrink: 0,
            borderBottom: '1px solid #E5E8EB',
          }}>
            {/* 핸들 */}
            <div style={{ padding: '12px 0 0', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '100px', background: '#E5E8EB' }} />
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 20px 16px',
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#191F28', letterSpacing: '-0.03em' }}>
                  {activeTab === 'terms' ? '이용약관' : '개인정보처리방침'}
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6B7684', letterSpacing: '-0.01em' }}>
                  2026년 5월 28일 시행
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="닫기"
                style={{
                  width: '32px', height: '32px',
                  borderRadius: '100px',
                  border: 'none',
                  background: '#F2F4F6',
                  color: '#6B7684',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '16px',
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* 탭 */}
            <div style={{ display: 'flex', padding: '0 20px 0', gap: '0' }}>
              {(['terms', 'privacy'] as const).map(tab => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: '12px 8px 11px',
                      border: 'none',
                      borderBottom: isActive ? '2px solid #3182F6' : '2px solid transparent',
                      marginBottom: '-1px',
                      background: 'transparent',
                      color: isActive ? '#3182F6' : '#B0B8C1',
                      fontSize: '14px',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      letterSpacing: '-0.02em',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tab === 'terms' ? '이용약관' : '개인정보처리방침'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 안내 배너 */}
          <div style={{ flexShrink: 0, padding: '16px 20px 0' }}>
            <div style={{
              background: '#EBF3FE',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#3182F6',
              lineHeight: 1.6,
              letterSpacing: '-0.01em',
            }}>
              {activeTab === 'terms'
                ? '💡 제28대 한국어학과 학생회 윤슬이 제공하는 주문 서비스 이용약관입니다.'
                : '💡 수집된 개인정보는 행사 운영 목적으로만 사용되며 행사 종료 후 즉시 파기됩니다.'}
            </div>
          </div>

          {/* 본문 */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px 20px',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties}>
            <pre style={{
              margin: 0,
              fontFamily: 'inherit',
              fontSize: '13px',
              lineHeight: 1.9,
              color: '#191F28',
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all',
              letterSpacing: '-0.01em',
            }}>
              {activeTab === 'terms' ? termsContent : privacyContent}
            </pre>
          </div>

          {/* 확인 버튼 */}
          <div style={{
            flexShrink: 0,
            padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 0px))',
            borderTop: '1px solid #F2F4F6',
          }}>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                border: 'none',
                background: '#3182F6',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '-0.02em',
                boxShadow: '0 4px 16px rgba(49,130,246,0.3)',
              }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default TermsModal;
