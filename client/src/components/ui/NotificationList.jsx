export default function NotificationList() {
  // Placeholder — real notifications need backend notification tracking
  const notifications = [
    { id: 1, type: 'like', text: 'Someone liked your post', time: '2m ago', icon: '♥' },
    { id: 2, type: 'follow', text: 'Someone started following you', time: '1h ago', icon: '👤' },
    { id: 3, type: 'collab', text: 'New collab request on your post', time: '3h ago', icon: '🤝' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {notifications.map(n => (
        <div key={n.id} className="flex items-center gap-4 bg-white border border-black/10 rounded-xl p-4 hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-lg flex-shrink-0">
            {n.icon}
          </div>
          <div className="flex-1">
            <div className="text-sm font-dm text-ink">{n.text}</div>
            <div className="text-xs text-muted mt-0.5">{n.time}</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0"></div>
        </div>
      ))}
    </div>
  );
}