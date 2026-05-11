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

const BANK = { bank: '토스뱅크', account: '1001-9279-2832', name: '이수연' };

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

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: '8px' }}>
    <p style={{
      margin: '0 0 10px', padding: '0 20px',
      fontSize: '13px', fontWeight: 700,
      color: 'var(--text-muted)', letterSpacing: '-0.01em',
    }}>{title}</p>
    <div style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', margin: '0 16px' }}>
      {children}
    </div>
  </div>
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
    navigator.clipboard.writeText(BANK.account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
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

  /* ─── Complete screen ─── */
  if (done) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div className="animate-scale-in" style={{
          width: '80px', height: '80px', margin: '0 auto 20px',
          borderRadius: '50%',
          background: 'var(--success-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={36} color="var(--success)" strokeWidth={2.5} />
        </div>
        <h2 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.04em' }}>
          주문 완료!
        </h2>
        {orderNum && (
          <p style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--text-muted)', letterSpacing: '-0.01em' }}>
            주문번호 <strong style={{ color: 'var(--primary)' }}>{orderNum}</strong>
          </p>
        )}
        <p style={{ margin: '0 0 32px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          입금 확인 후 서빙을 시작합니다.
        </p>

        {/* Summary */}
        <div style={{ background: 'var(--surface3)', borderRadius: '16px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
          {cartItems.map(i => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{i.title} × {i.quantity}</span>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                {(i.price * i.quantity).toLocaleString()}원
              </span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: '10px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700 }}>합계</span>
            <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '17px', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>
              {cartTotal.toLocaleString()}원
            </span>
          </div>
        </div>

        <button
          onClick={toggleOrder}
          style={{
            width: '100%', padding: '16px',
            borderRadius: '14px', border: 'none',
            background: 'var(--surface3)',
            color: 'var(--text)',
            fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            letterSpacing: '-0.02em',
          }}
        >
          닫기
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '16px 18px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text)',
    fontSize: '16px',   /* must be ≥ 16px to prevent iOS Safari auto-zoom on focus */
    outline: 'none',
    fontFamily: 'inherit',
    letterSpacing: '-0.02em',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center',
    borderBottom: '1px solid var(--border)',
    padding: '0',
  };

  /* ─── Main form ─── */
  return (
    <div style={{ paddingBottom: '12px', background: 'var(--surface2)' }}>

      {/* Notice */}
      <div style={{
        display: 'flex', gap: '10px', alignItems: 'flex-start',
        padding: '14px 20px',
        background: '#FFF8ED',
        borderBottom: '1px solid #FFE0A0',
        marginBottom: '16px',
      }}>
        <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
        <p style={{ margin: 0, fontSize: '13px', color: '#996600', lineHeight: 1.6 }}>
          주문 완료 후 변경·취소·환불이 <strong>불가</strong>합니다. 테이블 번호와 입금자명을 정확히 입력해주세요.
        </p>
      </div>

      {/* Cart */}
      <Section title="장바구니">
        {cartItems.map((item, idx) => (
          <div key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 18px',
            borderBottom: idx < cartItems.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: 'var(--text)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
              {item.title}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => updateCartItem(item.id, item.quantity - 1)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                    background: item.quantity <= 1 ? 'var(--danger-bg)' : 'var(--surface3)',
                    color: item.quantity <= 1 ? 'var(--danger)' : 'var(--text-muted)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {item.quantity <= 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                </button>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)', minWidth: '18px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateCartItem(item.id, item.quantity + 1)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Plus size={13} />
                </button>
              </div>
              <span style={{ minWidth: '72px', textAlign: 'right', fontSize: '14px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', color: 'var(--text)' }}>
                {(item.price * item.quantity).toLocaleString()}원
              </span>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>합계</span>
          <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em' }}>
            {cartTotal.toLocaleString()}원
          </span>
        </div>
      </Section>

      {/* Info */}
      <Section title="주문자 정보">
        <div style={rowStyle}>
          <span style={{ padding: '0 0 0 18px', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0, width: '90px' }}>입금자 성함</span>
          <input name="name" value={info.name} onChange={handleChange} placeholder="홍길동" style={inputStyle}
            onFocus={e => e.target.parentElement!.style.background = 'var(--primary-light)'}
            onBlur={e => e.target.parentElement!.style.background = 'transparent'}
          />
        </div>
        <div style={rowStyle}>
          <span style={{ padding: '0 0 0 18px', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0, width: '90px' }}>테이블 번호</span>
          <input name="phone" value={info.phone} onChange={handleChange} placeholder="예) 12" style={inputStyle}
            onFocus={e => e.target.parentElement!.style.background = 'var(--primary-light)'}
            onBlur={e => e.target.parentElement!.style.background = 'transparent'}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>인원</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button type="button" onClick={() => setPeople(p => Math.max(1, p - 1))}
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--surface3)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Minus size={14} />
            </button>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', minWidth: '32px', textAlign: 'center', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>
              {people}명
            </span>
            <button type="button" onClick={() => setPeople(p => p + 1)}
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--primary-light)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={14} />
            </button>
          </div>
        </div>
      </Section>

      {/* Bank */}
      <Section title="계좌 송금">
        {[{ label: '은행', value: BANK.bank }, { label: '예금주', value: BANK.name }].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>{r.label}</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>{r.value}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>계좌번호</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', color: 'var(--text)' }}>
              {BANK.account}
            </span>
            <button onClick={copyAccount} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '6px 12px', borderRadius: '100px', border: 'none',
              background: copied ? 'var(--success-bg)' : 'var(--primary-light)',
              color: copied ? 'var(--success)' : 'var(--primary)',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '-0.01em',
            }}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
        </div>
      </Section>

      {/* Image upload */}
      <div style={{ marginBottom: '8px', padding: '0 16px' }}>
        <p style={{ margin: '0 0 10px 4px', fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>송금 증빙</p>
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '8px', padding: '28px 20px',
          borderRadius: '16px',
          border: `2px dashed ${image ? 'var(--success)' : 'var(--border)'}`,
          background: image ? 'var(--success-bg)' : 'var(--surface)',
          cursor: 'pointer', textAlign: 'center',
          transition: 'all 0.2s ease',
        }}>
          {image ? (
            <>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={24} color="var(--success)" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--success)', letterSpacing: '-0.01em' }}>업로드 완료</span>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{image.name}</span>
            </>
          ) : (
            <>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={22} color="var(--text-dim)" />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '-0.01em' }}>이미지를 탭해서 첨부하세요</span>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>JPG, PNG 지원</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
        </label>
        {image && (
          <button onClick={() => setImage(null)} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            marginTop: '8px', background: 'none', border: 'none',
            color: 'var(--text-dim)', fontSize: '12px', cursor: 'pointer', padding: 0,
          }}>
            <X size={12} /> 다시 선택
          </button>
        )}
      </div>

      {/* Consent */}
      <Section title="이용 동의">
        {[
          { name: 'privacyAgree', checked: info.privacyAgree, label: '개인정보 처리방침', onClick: () => setShowPrivacy(true) },
          { name: 'termsAgree',   checked: info.termsAgree,   label: '이용약관',          onClick: () => setShowTerms(true) },
        ].map((cb, idx) => (
          <label key={cb.name} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '16px 18px',
            borderBottom: idx === 0 ? '1px solid var(--border)' : 'none',
            cursor: 'pointer',
          }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
              border: `2px solid ${cb.checked ? 'var(--primary)' : 'var(--border)'}`,
              background: cb.checked ? 'var(--primary)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}>
              {cb.checked && <Check size={13} color="#fff" strokeWidth={3} />}
            </div>
            <input type="checkbox" name={cb.name} checked={cb.checked} onChange={handleChange} style={{ display: 'none' }} />
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', flex: 1, letterSpacing: '-0.01em' }}>
              <span
                onClick={e => { e.preventDefault(); cb.onClick(); }}
                style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px', cursor: 'pointer' }}
              >
                {cb.label}
              </span>에 동의합니다
            </span>
          </label>
        ))}
      </Section>

      {/* CTA */}
      <div style={{
        position: 'sticky', bottom: 0,
        background: 'linear-gradient(to bottom, transparent, var(--surface2) 28%)',
        padding: '16px 16px calc(20px + env(safe-area-inset-bottom, 0px))',
      }}>
        <button
          onClick={submit}
          disabled={!isValid || submitting}
          style={{
            position: 'relative', overflow: 'hidden',
            width: '100%', padding: '17px',
            borderRadius: '16px', border: 'none',
            background: isValid ? 'var(--primary)' : 'var(--surface3)',
            color: isValid ? '#fff' : 'var(--text-dim)',
            fontSize: '16px', fontWeight: 800,
            cursor: isValid ? 'pointer' : 'not-allowed',
            boxShadow: isValid ? '0 4px 20px rgba(49,130,246,0.35)' : 'none',
            transition: 'all 0.2s ease',
            letterSpacing: '-0.03em',
          }}
        >
          {isValid && !submitting && (
            <span className="shimmer-overlay" style={{ animation: 'shimmer 2.4s ease-in-out infinite' }} />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>
            {submitting ? '처리 중...' : isValid ? `${cartTotal.toLocaleString()}원 주문하기` : '정보를 모두 입력해주세요'}
          </span>
        </button>
      </div>

      <PolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} type="privacy" />
      <PolicyModal isOpen={showTerms}   onClose={() => setShowTerms(false)}   type="terms" />
    </div>
  );
};

export default OrderForm;
