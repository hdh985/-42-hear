// src/components/TermsModal.tsx
import React, { useState } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 text-sm relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl">×</button>

        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-semibold ${activeTab === 'terms' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('terms')}
          >
            이용약관
          </button>
          <button
            className={`px-4 py-2 text-sm font-semibold ml-4 ${activeTab === 'privacy' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('privacy')}
          >
            개인정보처리방침
          </button>
        </div>

        {activeTab === 'terms' && (
          <div className="whitespace-pre-wrap leading-relaxed text-gray-800 text-xs">
{`🎯 [히어스턴스] 이용약관 (축제 부스 웹 주문 서비스)
본 이용약관은 외국어대학 학생회(히어스턴스) 부스(이하 '운영자')가 제공하는 주문/결제 서비스(이하 '서비스')의 이용조건 및 절차, 운영자와 이용자의 권리·의무·책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제1조 (목적)
이 약관은 경희대학교 축제 부스 운영자인 [운영자]가 제공하는 온라인 주문 서비스의 이용조건 및 절차, 권리·의무 및 책임사항을 명확히 하여 원활한 거래를 도모함을 목적으로 합니다.

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
개인정보는 행사 종료 후 즉시 파기됩니다.
개인정보 처리에 대한 자세한 사항은 별도의 [개인정보 수집·이용 동의서]를 따릅니다.

제8조 (지적재산권)
서비스와 관련된 모든 자료(디자인, 상표, 콘텐츠 등)의 지적재산권은 운영자에게 있으며, 무단 복제, 배포, 도용을 금지합니다.

제9조 (분쟁 해결 및 관할)
서비스 이용과 관련하여 분쟁이 발생할 경우, 운영자와 이용자는 성실히 협의하여 해결합니다.
협의가 이루어지지 않을 경우, [운영자 소재지 관할 법원]을 제1심 전속 관할로 합니다.

부칙
본 약관은 2025년 05월 26일부터 시행됩니다.
본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.`}
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="whitespace-pre-wrap leading-relaxed text-gray-800 text-xs">
{`🎯 [히어스턴스] 개인정보처리방침 (축제 부스 웹 주문 서비스)

히어스턴스는 이용자의 개인정보를 매우 소중히 여기며, 관련 법령에 따라 다음과 같은 방침을 따릅니다.

1. 수집 항목
- 필수 항목: 이름, 전화번호, 송금내역(이미지), 테이블 번호

2. 수집 목적
- 주문 처리 및 결제 확인
- 대기자 확인 및 합석 매칭
- 고객 응대 및 행사 운영

3. 보유 및 이용 기간
- 수집된 개인정보는 행사 종료 후 7일 이내에 송금내역 확인 후 안전하게 폐기됩니다.
- 법적 분쟁 등의 사유가 없는 한 별도 저장하지 않습니다.

4. 개인정보 제3자 제공
- 운영자 외 제3자에게 절대 제공되지 않으며, 단순 주문 처리에 한정해 사용됩니다.

5. 개인정보 파기 절차
- 서비스 종료 후 DB 및 파일 형태의 모든 개인정보는 복구 불가능한 방식으로 즉시 파기됩니다.

6. 이용자의 권리
- 본인 요청 시 개인정보 열람, 정정, 삭제가 가능합니다.
- 문의: khuhear@gmail.com

7. 문의처
- 히어스턴스 운영팀 (경희대학교 외국어대학 학생회)
- 이메일: khuhear@gmail.com / 전화: 010-6276-0281

부칙
본 방침은 2025년 5월 26일부터 시행됩니다.`}
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsModal;
