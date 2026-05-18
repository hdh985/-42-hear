import React, { useState } from 'react';
import axios from 'axios';
import { Check, Copy, Minus, Plus, Trash2, Upload, X } from 'lucide-react';
import PolicyModal from './PolicyModal';

export interface CartItem { id: string; title: string; price: number; quantity: number; }

interface OrderFormProps {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  toggleOrder: () => void;
  updateCartItem: (id: string, qty: number) => void;
  scrollToBottomOnMount?: boolean;
}

const BANK = { bank: '우리은행', account: '1002-557-614259', name: '김경민' };

function resizeImage(file: File, maxSide = 800, q = 0.9): Promise<File> {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const r = Math.min(maxSide / Math.max(img.width, img.height), 1);
      const w = Math.round(img.width * r), h = Math.round(img.height * r);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d')?.drawImage(img, 0, 0, w, h);
      const isPNG = file.type === 'image/png';
      const mime = isPNG ? 'image/png' : 'image/jpeg';
      c.toBlob(blob => {
        URL.revokeObjectURL(url);
        if (!blob) return resolve(file);
        resolve(new File([blob], file.name.replace(/\.[^.]+$/i, isPNG ? '.png' : '.jpg'), { type: mime }));
      }, mime, isPNG ? undefined : q);
    };
  });
}

/* 섹션 카드 */
const Card: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ marginBottom: '8px' }}>
    <p style={{
      margin: '0 0 8px 4px',
      fontSize: '13px', fontWeight: 700,
      color: '#6B7684', letterSpacing: '-0.01em',
    }}>{label}</p>
    <div style={{
      background: '#FFFFFF',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  </div>
);

/* 구분선 */
const Divider = () => (
  <div style={{ height: '1px', background: '#F2F4F6', margin: '0 16px' }} />
);

const OrderForm: React.FC<OrderFormProps> = ({
  cartItems, cartTotal, toggleOrder, updateCartItem,
}) => {
  const [done, setDone] = useState(false);
  const [info, setInfo] = useState({ name: '', phone: '', privacyAgree: false, termsAgree: false });
  const [image, setImage] = useState<File | null>(null);
  const [orderNum, setOrderNum] = useState('');
  const [people, setPeople] = useState(2);
  const [copied, setCopied] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setInfo(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setImage(await resizeImage(f, 300, 0.9));
  };

  const copyAccount = () => {
    const text = BANK.account;
    const markCopied = () => { setCopied(true); setTimeout(() => setCopied(false), 1800); };
    const fallback = () => {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(el);
      el.focus();
      el.select();
      try { if (document.execCommand('copy')) markCopied(); } catch {}
      document.body.removeChild(el);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(markCopied).catch(fallback);
    } else {
      fallback();
    }
  };

  const submit = async () => {
    if (submitting) return;
    const { name, phone, privacyAgree, termsAgree } = info;
    if (!name || !phone || !privacyAgree || !termsAgree || !image) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    fd.append('table', phone);
    fd.append('name', name);
    fd.append('items', JSON.stringify(cartItems.map(i => `${i.title} x ${i.quantity}`)));
    fd.append('total', cartTotal.toString());
    fd.append('song', '');
    fd.append('payment_image', image);
    fd.append('table_size', people.toString());
    fd.append('seat_fee', '0');
    fd.append('consent_privacy', privacyAgree.toString());
    fd.append('consent_terms', termsAgree.toString());
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, fd);
      setOrderNum(`#${res.data.order_id}`);
      setDone(true);
    } catch {
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = !!(info.name && info.phone && info.privacyAgree && info.termsAgree && image);

  /* ─── 완료 화면 ─── */
  if (done) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center', background: '#F2F4F6' }}>
        {/* 완료 아이콘 */}
        <div className="animate-scale-in" style={{
          width: '80px', height: '80px', margin: '0 auto 20px',
          borderRadius: '50%',
          background: '#00C073',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={36} color="#FFFFFF" strokeWidth={2.5} />
        </div>

        <h2 style={{
          margin: '0 0 6px',
          fontSize: '24px', fontWeight: 800,
          color: '#191F28', letterSpacing: '-0.03em',
        }}>
          주문 완료!
        </h2>
        {orderNum && (
          <p style={{ margin: '0 0 6px', fontSize: '14px', color: '#6B7684' }}>
            주문번호 <strong style={{ color: '#3182F6' }}>{orderNum}</strong>
          </p>
        )}
        <p style={{ margin: '0 0 28px', fontSize: '14px', color: '#6B7684', lineHeight: 1.6 }}>
          입금 확인 후 서빙을 시작합니다.
        </p>

        {/* 주문 요약 */}
        <div style={{
          background: '#FFFFFF', borderRadius: '16px', padding: '16px',
          marginBottom: '20px', textAlign: 'left',
        }}>
          {cartItems.map((i, idx) => (
            <div key={i.id} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: idx < cartItems.length - 1 ? '1px solid #F2F4F6' : 'none',
            }}>
              <span style={{ color: '#6B7684', fontSize: '14px' }}>{i.title} × {i.quantity}</span>
              <span style={{ fontWeight: 700, color: '#191F28', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>
                {(i.price * i.quantity).toLocaleString()}원
              </span>
            </div>
          ))}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '12px', paddingTop: '12px',
            borderTop: '1px solid #F2F4F6',
          }}>
            <span style={{ fontWeight: 700, color: '#191F28' }}>합계</span>
            <span style={{ fontWeight: 800, fontSize: '18px', color: '#3182F6', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>
              {cartTotal.toLocaleString()}원
            </span>
          </div>
        </div>

        <button onClick={toggleOrder} style={{
          width: '100%', padding: '16px',
          borderRadius: '12px', border: 'none',
          background: '#F2F4F6', color: '#6B7684',
          fontSize: '15px', fontWeight: 700, cursor: 'pointer',
          letterSpacing: '-0.02em',
        }}>
          닫기
        </button>
      </div>
    );
  }

  /* ─── 주문 폼 ─── */
  return (
    <div style={{ padding: '16px', background: '#F2F4F6', paddingBottom: '12px' }}>

      {/* 안내 */}
      <div style={{
        display: 'flex', gap: '10px', alignItems: 'flex-start',
        padding: '14px 16px',
        background: '#EBF3FE',
        borderRadius: '12px',
        marginBottom: '16px',
      }}>
        <span style={{ fontSize: '15px', flexShrink: 0 }}>💡</span>
        <p style={{ margin: 0, fontSize: '13px', color: '#3182F6', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          주문 완료 후 변경·취소·환불이 <strong>불가</strong>합니다.
          테이블 번호와 입금자명을 정확히 입력해주세요.
        </p>
      </div>

      {/* 장바구니 */}
      <Card label="장바구니">
        {cartItems.map((item, idx) => (
          <React.Fragment key={item.id}>
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '14px 16px', gap: '10px',
            }}>
              <span style={{
                flex: 1, fontSize: '14px', fontWeight: 600,
                color: '#191F28', letterSpacing: '-0.01em',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {item.title}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                {/* 수량 조절 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateCartItem(item.id, item.quantity - 1)} style={{
                    width: '26px', height: '26px', borderRadius: '100px', border: 'none',
                    background: item.quantity <= 1 ? '#FEF0F2' : '#F2F4F6',
                    color: item.quantity <= 1 ? '#F04452' : '#6B7684',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.quantity <= 1 ? <Trash2 size={11} /> : <Minus size={11} />}
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#191F28', minWidth: '16px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                    {item.quantity}
                  </span>
                  <button onClick={() => updateCartItem(item.id, item.quantity + 1)} style={{
                    width: '26px', height: '26px', borderRadius: '100px', border: 'none',
                    background: '#EBF3FE', color: '#3182F6',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Plus size={11} />
                  </button>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#191F28', minWidth: '72px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {(item.price * item.quantity).toLocaleString()}원
                </span>
              </div>
            </div>
            {idx < cartItems.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        {/* 합계 */}
        <div style={{ borderTop: '1px solid #F2F4F6', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#6B7684' }}>합계</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#3182F6', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>
            {cartTotal.toLocaleString()}원
          </span>
        </div>
      </Card>

      {/* 주문자 정보 */}
      <Card label="주문자 정보">
        {/* 입금자 */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7684', flexShrink: 0, width: '80px' }}>입금자 성함</span>
          <input name="name" value={info.name} onChange={handleChange}
            placeholder="홍길동"
            style={{
              flex: 1, padding: '14px 0',
              background: 'transparent', border: 'none',
              color: '#191F28', fontSize: '15px', outline: 'none',
              fontFamily: 'inherit', letterSpacing: '-0.01em',
            }}
          />
        </div>
        <Divider />
        {/* 테이블 번호 */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7684', flexShrink: 0, width: '80px' }}>테이블 번호</span>
          <input name="phone" value={info.phone} onChange={handleChange}
            placeholder="예) 12"
            style={{
              flex: 1, padding: '14px 0',
              background: 'transparent', border: 'none',
              color: '#191F28', fontSize: '15px', outline: 'none',
              fontFamily: 'inherit', letterSpacing: '-0.01em',
            }}
          />
        </div>
        <Divider />
        {/* 인원 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7684' }}>인원</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button type="button" onClick={() => setPeople(p => Math.max(1, p - 1))} style={{
              width: '30px', height: '30px', borderRadius: '100px', border: 'none',
              background: '#F2F4F6', color: '#6B7684',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Minus size={12} />
            </button>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#191F28', minWidth: '30px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
              {people}명
            </span>
            <button type="button" onClick={() => setPeople(p => p + 1)} style={{
              width: '30px', height: '30px', borderRadius: '100px', border: 'none',
              background: '#3182F6', color: '#FFFFFF',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Plus size={12} />
            </button>
          </div>
        </div>
      </Card>

      {/* 계좌 송금 */}
      <Card label="계좌 송금">
        {[{ label: '은행', value: BANK.bank }, { label: '예금주', value: BANK.name }].map((r, idx) => (
          <React.Fragment key={r.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
              <span style={{ fontSize: '13px', color: '#6B7684', fontWeight: 600 }}>{r.label}</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#191F28' }}>{r.value}</span>
            </div>
            {idx === 0 && <Divider />}
          </React.Fragment>
        ))}
        <Divider />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
          <span style={{ fontSize: '13px', color: '#6B7684', fontWeight: 600 }}>계좌번호</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#191F28', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
              {BANK.account}
            </span>
            <button onClick={copyAccount} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '6px 12px',
              borderRadius: '100px', border: 'none',
              background: copied ? '#E5FBF2' : '#EBF3FE',
              color: copied ? '#00C073' : '#3182F6',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}>
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
        </div>
      </Card>

      {/* 송금 증빙 */}
      <div style={{ marginBottom: '8px' }}>
        <p style={{ margin: '0 0 8px 4px', fontSize: '13px', fontWeight: 700, color: '#6B7684' }}>송금 증빙</p>
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '8px', padding: '24px 20px',
          borderRadius: '12px',
          border: `2px dashed ${image ? '#00C073' : '#E5E8EB'}`,
          background: image ? '#E5FBF2' : '#FFFFFF',
          cursor: 'pointer', textAlign: 'center',
          transition: 'all 0.2s ease',
        }}>
          {image ? (
            <>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#00C073', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={22} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#00C073' }}>업로드 완료</span>
              <span style={{ fontSize: '12px', color: '#6B7684' }}>{image.name}</span>
            </>
          ) : (
            <>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#EBF3FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={20} color="#3182F6" />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#6B7684' }}>이미지를 탭해서 첨부하세요</span>
              <span style={{ fontSize: '12px', color: '#B0B8C1' }}>JPG, PNG 지원</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
        </label>
        {image && (
          <button onClick={() => setImage(null)} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            marginTop: '6px', background: 'none', border: 'none',
            color: '#B0B8C1', fontSize: '12px', cursor: 'pointer', padding: '0 4px',
          }}>
            <X size={11} /> 다시 선택
          </button>
        )}
      </div>

      {/* 이용 동의 */}
      <Card label="이용 동의">
        {[
          { name: 'privacyAgree', checked: info.privacyAgree, label: '개인정보 처리방침', onClick: () => setShowPrivacy(true) },
          { name: 'termsAgree',   checked: info.termsAgree,   label: '이용약관',          onClick: () => setShowTerms(true) },
        ].map((cb, idx) => (
          <React.Fragment key={cb.name}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px', cursor: 'pointer',
            }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                border: `2px solid ${cb.checked ? '#3182F6' : '#E5E8EB'}`,
                background: cb.checked ? '#3182F6' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}>
                {cb.checked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </div>
              <input type="checkbox" name={cb.name} checked={cb.checked} onChange={handleChange} style={{ display: 'none' }} />
              <span style={{ fontSize: '13px', color: '#6B7684', flex: 1, letterSpacing: '-0.01em' }}>
                <span
                  onClick={e => { e.preventDefault(); cb.onClick(); }}
                  style={{ color: '#3182F6', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px', cursor: 'pointer' }}
                >
                  {cb.label}
                </span>에 동의합니다
              </span>
            </label>
            {idx === 0 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      {/* 주문 버튼 */}
      <div style={{
        position: 'sticky', bottom: 0,
        background: 'linear-gradient(to bottom, transparent, #F2F4F6 28%)',
        padding: '16px 0 calc(16px + env(safe-area-inset-bottom, 0px))',
      }}>
        <button
          onClick={submit}
          disabled={!isValid || submitting}
          style={{
            width: '100%', padding: '17px',
            borderRadius: '14px', border: 'none',
            background: isValid ? '#3182F6' : '#E5E8EB',
            color: isValid ? '#FFFFFF' : '#B0B8C1',
            fontSize: '16px', fontWeight: 800,
            cursor: isValid ? 'pointer' : 'not-allowed',
            letterSpacing: '-0.02em',
            boxShadow: isValid ? '0 8px 24px rgba(49,130,246,0.28)' : 'none',
            transition: 'all 0.18s ease',
          }}
        >
          {submitting ? '처리 중...' : isValid ? `${cartTotal.toLocaleString()}원 주문하기` : '정보를 모두 입력해주세요'}
        </button>
      </div>

      <PolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} type="privacy" />
      <PolicyModal isOpen={showTerms}   onClose={() => setShowTerms(false)}   type="terms" />
    </div>
  );
};

export default OrderForm;
