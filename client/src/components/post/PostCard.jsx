import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [saved, setSaved] = useState(post.savedBy?.includes(user?._id));

  const handleLike = async () => {
    try {
      const res = await api.put(`/posts/${post._id}/like`);
      setLiked(res.data.liked);
      setLikeCount(prev => res.data.liked ? prev + 1 : prev - 1);
    } catch {
      toast.error('Failed to like');
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/posts/${post._id}/save`);
      setSaved(res.data.saved);
      toast.success(res.data.saved ? 'Saved!' : 'Removed from saved');
    } catch {
      toast.error('Failed to save');
    }
  };

  const initials = post.author?.name
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const categoryColors = {
    'UI/UX': 'bg-purple-100 text-purple-700',
    'Branding': 'bg-orange-100 text-orange-700',
    'MERN': 'bg-green-100 text-green-700',
    'Motion': 'bg-blue-100 text-blue-700',
    'Illustration': 'bg-pink-100 text-pink-700',
    'Other': 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #5B3BCC, #9B6EF0)' }}
          onClick={() => navigate(`/profile/${post.author?._id}`)}
        >
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-sm text-ink cursor-pointer hover:text-accent transition-colors"
              onClick={() => navigate(`/profile/${post.author?._id}`)}
            >
              {post.author?.name}
            </span>
            {post.author?.openToCollab && (
              <span className="text-[10px] text-green-700 font-semibold bg-green-100 px-2 py-0.5 rounded-full">
                ✓ Open to Collab
              </span>
            )}
          </div>
          <div className="text-xs text-muted font-dm">{timeAgo}</div>
        </div>
        <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${categoryColors[post.category] || categoryColors['Other']}`}>
          {post.category}
        </span>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full object-cover max-h-72"
        />
      )}

      {/* Body */}
      <div className="px-4 py-3">
        <h3 className="font-syne font-bold text-base text-ink mb-1">{post.title}</h3>
        <p className="text-sm text-muted font-dm leading-relaxed line-clamp-2">{post.description}</p>
        {post.tags?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-[11px] text-muted border border-black/10 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-3 border-t border-black/10">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-surface ${liked ? 'text-accent' : 'text-muted'}`}
        >
          {liked ? '♥' : '♡'} <span>{likeCount}</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted hover:bg-surface transition-all">
          💬 <span>{post.comments?.length || 0}</span>
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-surface ${saved ? 'text-ink font-semibold' : 'text-muted'}`}
        >
          {saved ? '🔖' : '📌'}
        </button>
        {post.openToCollab && (
          <button
            onClick={() => toast.success('Collab request sent!')}
            className="ml-auto bg-purple-100 text-purple-700 text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-purple-700 hover:text-white transition-all"
          >
            Request Collab →
          </button>
        )}
      </div>
    </div>
  );
}