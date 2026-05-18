interface Member {
  name: string;
  isLeader?: boolean;
}
interface Group {
  emoji: string;
  title: string;
  members: Member[];
}

const GROUPS: Group[] = [
  {
    emoji: '🏛️',
    title: '회장단',
    members: [
      { name: '김경민' },
      { name: '이지은' },
      { name: '문자영' },
    ],
  },
  {
    emoji: '💡',
    title: '기획국',
    members: [
      { name: '이용훈', isLeader: true },
      { name: '최수빈' },
      { name: '심재현' },
      { name: '김창성' },
    ],
  },
  {
    emoji: '👩🏻‍💼',
    title: '대외국',
    members: [
      { name: '황유빈', isLeader: true },
      { name: '오채현' },
      { name: '임아진' },
      { name: '김채율' },
    ],
  },
  {
    emoji: '🎨',
    title: '디자인미디어국',
    members: [
      { name: '김민서', isLeader: true },
      { name: '김지후' },
      { name: '양지서' },
      { name: '김은교' },
    ],
  },
  {
    emoji: '💶',
    title: '운영복지국',
    members: [
      { name: '김지원', isLeader: true },
      { name: '윤성민' },
      { name: '최승완' },
      { name: '주지원' },
    ],
  },
];

interface Props { onLogin: (name: string) => void; }

export default function AdminLogin({ onLogin }: Props) {
  const handleSelect = (name: string) => {
    localStorage.setItem('adminName', name);
    onLogin(name);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F2F4F6', fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', -apple-system, sans-serif" }}>

      {/* 헤더 */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #E5E8EB',
        padding: '0 20px', height: '56px',
        display: 'flex', alignItems: 'center', gap: '10px',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <img src="/yunsul.jpg" alt="윤슬" style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }} />
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '28px 16px 40px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 900, color: '#191F28', letterSpacing: '-0.04em' }}>
          안녕하세요 👋
        </h2>
        <p style={{ margin: '0 0 28px', fontSize: '15px', color: '#6B7684', fontWeight: 500 }}>
          본인 이름을 선택해주세요
        </p>

        {GROUPS.map(group => (
          <div key={group.title} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span style={{ fontSize: '15px' }}>{group.emoji}</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B7684', letterSpacing: '-0.01em' }}>{group.title}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {group.members.map(member => (
                <button
                  key={member.name}
                  onClick={() => handleSelect(member.name)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '1.5px solid #E5E8EB',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.12s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                  onMouseDown={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
                    (e.currentTarget as HTMLButtonElement).style.background = '#EBF3FE';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#3182F6';
                  }}
                  onMouseUp={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = '';
                  }}
                  onTouchStart={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
                    (e.currentTarget as HTMLButtonElement).style.background = '#EBF3FE';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#3182F6';
                  }}
                  onTouchEnd={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = '';
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#191F28', letterSpacing: '-0.02em' }}>
                    {member.name}
                  </span>
                  {member.isLeader && (
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#FF9500', background: '#FFF8ED', borderRadius: '100px', padding: '2px 8px', whiteSpace: 'nowrap' }}>
                      국장
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
