import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ onFilterChange, activeFilter }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-[calc(100vh-60px)] p-4 gap-1 sticky top-[60px] self-start">

      <SideItem icon="🏠" label="Discover" active={activeFilter === 'all'} onClick={() => onFilterChange('all')} />
      <SideItem icon="👥" label="Following" active={activeFilter === 'following'} onClick={() => onFilterChange('following')} />
      <SideItem icon="🔔" label="Notifications" active={activeFilter === 'notifications'} onClick={() => onFilterChange('notifications')} badge="3" />

      <div className="text-[10px] font-semibold text-muted uppercase tracking-widest px-2 mt-4 mb-1">Skills</div>
      <SideItem icon="💻" label="MERN Stack" active={activeFilter === 'MERN'} onClick={() => onFilterChange('MERN')} />
      <SideItem icon="🎨" label="UI/UX Design" active={activeFilter === 'UI/UX'} onClick={() => onFilterChange('UI/UX')} />
      <SideItem icon="✦"  label="Branding" active={activeFilter === 'Branding'} onClick={() => onFilterChange('Branding')} />

      {/* Profile Mini */}
      <div className="mt-auto bg-surface rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #E8531A, #CC3B9A)' }}
            onClick={() => navigate(`/profile/${user?._id}`)}
          >
            {initials}
          </div>
          <div>
            <div className="font-syne font-bold text-sm text-ink">{user?.name}</div>
            <div className="text-xs text-muted">MERN Dev · Designer</div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-center cursor-pointer" onClick={() => navigate(`/profile/${user?._id}`)}>
            <div className="font-syne font-black text-sm">40+</div>
            <div className="text-[10px] text-muted">Projects</div>
          </div>
          <div className="text-center">
            <div className="font-syne font-black text-sm">{user?.followers?.length || 0}</div>
            <div className="text-[10px] text-muted">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-syne font-black text-sm">0</div>
            <div className="text-[10px] text-muted">Collabs</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SideItem({ icon, label, active, onClick, badge }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
        active ? 'bg-ink text-white font-semibold' : 'text-muted hover:bg-surface hover:text-ink'
      }`}
    >
      <span className="text-base">{icon}</span>
      <span className="font-dm">{label}</span>
      {badge && (
        <span className="ml-auto bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}


// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// export default function Sidebar() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const initials = user?.name
//     ?.split(' ')
//     .map(n => n[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <aside className="hidden lg:flex flex-col w-60 min-h-[calc(100vh-60px)] p-4 gap-1 sticky top-[60px] self-start">

//       <SideItem icon="🏠" label="Discover" to="/" active />
//       <SideItem icon="👥" label="Following" to="/explore" />
//       <SideItem icon="🔔" label="Notifications" to="/" badge="3" />

//       <div className="text-[10px] font-semibold text-muted uppercase tracking-widest px-2 mt-4 mb-1">Skills</div>
//       <SideItem icon="💻" label="MERN Stack" to="/explore" />
//       <SideItem icon="🎨" label="UI/UX Design" to="/explore" />
//       <SideItem icon="✦" label="Branding" to="/explore" />

//       {/* Profile Mini */}
//       <div className="mt-auto bg-surface rounded-xl p-4">
//         <div className="flex items-center gap-2 mb-3">
//           <div
//             className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 cursor-pointer"
//             style={{ background: 'linear-gradient(135deg, #E8531A, #CC3B9A)' }}
//             onClick={() => navigate(`/profile/${user?._id}`)}
//           >
//             {initials}
//           </div>
//           <div>
//             <div className="font-syne font-bold text-sm text-ink">{user?.name}</div>
//             <div className="text-xs text-muted">MERN Dev · Designer</div>
//           </div>
//         </div>
//         <div className="flex gap-4">
//           <div className="text-center">
//             <div className="font-syne font-black text-sm">40+</div>
//             <div className="text-[10px] text-muted">Projects</div>
//           </div>
//           <div className="text-center">
//             <div className="font-syne font-black text-sm">{user?.followers?.length || 0}</div>
//             <div className="text-[10px] text-muted">Followers</div>
//           </div>
//           <div className="text-center">
//             <div className="font-syne font-black text-sm">0</div>
//             <div className="text-[10px] text-muted">Collabs</div>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }

// function SideItem({ icon, label, to, active, badge }) {
//   return (
//     <Link
//       to={to}
//       className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
//         active
//           ? 'bg-ink text-white font-semibold'
//           : 'text-muted hover:bg-surface hover:text-ink'
//       }`}
//     >
//       <span className="text-base">{icon}</span>
//       <span className="font-dm">{label}</span>
//       {badge && (
//         <span className="ml-auto bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
//           {badge}
//         </span>
//       )}
//     </Link>
//   );
// }

