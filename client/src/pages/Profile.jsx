import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PostCard from '../components/post/PostCard';
import toast from 'react-hot-toast';

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const isOwn = user?._id === id;

  useEffect(() => { fetchProfile(); }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${id}`);
      setProfile(res.data.user);
      setPosts(res.data.posts);
      setFollowing(res.data.user.followers?.some(f => f._id === user?._id));
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await api.put(`/users/${id}/follow`);
      setFollowing(prev => !prev);
      setProfile(prev => ({
        ...prev,
        followers: following
          ? prev.followers.filter(f => f._id !== user._id)
          : [...prev.followers, { _id: user._id }]
      }));
    } catch {
      toast.error('Failed to follow');
    }
  };

  const initials = profile?.name
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-muted font-dm animate-pulse">Loading profile...</div>
    </div>
  );

  if (!profile) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-muted font-dm">Profile not found.</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-white border border-black/10 rounded-2xl overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-32 w-full" style={{ background: 'linear-gradient(135deg, #111110, #5B3BCC)' }} />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div
              className="w-20 h-20 rounded-2xl border-4 border-white flex items-center justify-center text-white text-2xl font-black"
              style={{ background: 'linear-gradient(135deg, #E8531A, #CC3B9A)' }}
            >
              {initials}
            </div>
            <div className="flex gap-2 mt-12">
              {isOwn ? (
                <button className="px-5 py-2 rounded-xl border border-black/15 text-sm font-dm font-semibold text-ink hover:bg-surface transition-colors">
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`px-5 py-2 rounded-xl text-sm font-dm font-semibold transition-all ${
                    following
                      ? 'border border-black/15 text-ink hover:bg-surface'
                      : 'bg-ink text-white hover:opacity-80'
                  }`}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <h1 className="font-syne font-black text-2xl text-ink mb-1">{profile.name}</h1>
          {profile.bio && <p className="text-sm text-muted font-dm mb-3">{profile.bio}</p>}

          <div className="flex flex-wrap gap-2 mb-4">
            {profile.location && (
              <span className="text-xs text-muted font-dm flex items-center gap-1">
                📍 {profile.location}
              </span>
            )}
            {profile.openToCollab && (
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                ✓ Open to Collab
              </span>
            )}
          </div>

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map(skill => (
                <span key={skill} className="text-xs font-semibold border border-black/10 px-3 py-1 rounded-full text-ink">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-6 pt-4 border-t border-black/10">
            <div className="text-center">
              <div className="font-syne font-black text-lg text-ink">{posts.length}</div>
              <div className="text-xs text-muted font-dm">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-syne font-black text-lg text-ink">{profile.followers?.length || 0}</div>
              <div className="text-xs text-muted font-dm">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-syne font-black text-lg text-ink">{profile.following?.length || 0}</div>
              <div className="text-xs text-muted font-dm">Following</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 mb-6 w-fit">
        {['posts', 'saved'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-dm font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-white text-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🎨</div>
          <div className="font-syne font-bold text-lg text-ink mb-1">No posts yet</div>
          <div className="text-muted text-sm font-dm">
            {isOwn ? 'Share your first project!' : 'This creator hasn\'t posted yet.'}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map(post => (
            <PostCard key={post._id} post={post} onUpdate={fetchProfile} />
          ))}
        </div>
      )}
    </div>
  );
}