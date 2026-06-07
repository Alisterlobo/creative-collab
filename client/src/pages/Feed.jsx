import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/post/PostCard';
import CreatePostModal from '../components/post/CreatePostModal';
import CollabRequestCard from '../components/collab/CollabRequestCard';
import NotificationList from '../components/ui/NotificationList';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'UI/UX', 'Branding', 'MERN', 'Motion', 'Illustration'];

export default function Feed({ activeFilter = 'all', setActiveFilter }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [collabs, setCollabs] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    if (activeFilter === 'notifications') return;
    fetchPosts();
  }, [activeFilter, category]);

  useEffect(() => { fetchCollabs(); }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let res;

      if (activeFilter === 'following') {
        res = await api.get('/posts/following');
      } else if (['MERN', 'UI/UX', 'Branding'].includes(activeFilter)) {
        res = await api.get('/posts', { params: { category: activeFilter } });
      } else {
        res = await api.get('/posts', {
          params: category !== 'All' ? { category } : {}
        });
      }

      setPosts(res.data);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCollabs = async () => {
    try {
      const res = await api.get('/collabs');
      setCollabs(res.data.slice(0, 3));
    } catch {}
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setShowPostModal(false);
    toast.success('Post published! 🎉');
  };

  // NOTIFICATIONS VIEW
  if (activeFilter === 'notifications') {
    return (
      <div className="flex">
        <div className="flex-1 p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveFilter('all')} className="text-muted hover:text-ink transition-colors">←</button>
            <h1 className="font-syne font-black text-xl text-ink">Notifications</h1>
          </div>
          <NotificationList />
        </div>
      </div>
    );
  }

  // FOLLOWING VIEW
  const isFollowingView = activeFilter === 'following';

  return (
    <div className="flex">
      <div className="flex-1 p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-syne font-black text-xl text-ink">
            {isFollowingView ? 'Following' : activeFilter !== 'all' ? activeFilter : 'Discover'}
          </h1>
          <button
            onClick={() => setShowPostModal(true)}
            className="bg-ink text-white text-sm font-dm font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition-opacity lg:hidden"
          >
            + Post
          </button>
        </div>

        {/* Category chips — only show on Discover */}
        {activeFilter === 'all' && (
          <div className="flex gap-2 flex-wrap mb-5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  category === cat
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-muted border-black/10 hover:border-ink hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-black/10 h-64 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">{isFollowingView ? '👥' : '🎨'}</div>
            <div className="font-syne font-bold text-lg text-ink mb-2">
              {isFollowingView ? 'No posts from people you follow' : 'No posts yet'}
            </div>
            <div className="text-muted text-sm font-dm mb-4">
              {isFollowingView ? 'Follow some creators to see their work here!' : 'Be the first to share your work!'}
            </div>
            {!isFollowingView && (
              <button
                onClick={() => setShowPostModal(true)}
                className="bg-ink text-white font-dm font-semibold px-6 py-2.5 rounded-xl hover:opacity-80 transition-opacity"
              >
                Post Your Work →
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map(post => (
              <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
            ))}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <aside className="hidden xl:flex flex-col w-72 p-4 sticky top-[60px] self-start gap-6">
        <div>
          <h2 className="font-syne font-bold text-sm text-ink mb-3">🔥 Collab Requests</h2>
          {collabs.length === 0 ? (
            <div className="text-xs text-muted font-dm">No open collabs yet.</div>
          ) : (
            collabs.map(collab => (
              <CollabRequestCard key={collab._id} collab={collab} />
            ))
          )}
        </div>
        <div className="bg-ink rounded-2xl p-5">
          <div className="font-syne font-black text-white text-base mb-1">Share your work</div>
          <div className="text-white/50 text-xs font-dm mb-4">Post to the feed and find collaborators</div>
          <button
            onClick={() => setShowPostModal(true)}
            className="w-full bg-accent text-white font-dm font-semibold py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            + Post Work
          </button>
        </div>
      </aside>

      {showPostModal && (
        <CreatePostModal
          onClose={() => setShowPostModal(false)}
          onCreated={handlePostCreated}
        />
      )}
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import api from '../services/api';
// import PostCard from '../components/post/PostCard';
// import CreatePostModal from '../components/post/CreatePostModal';
// import CollabRequestCard from '../components/collab/CollabRequestCard';
// import toast from 'react-hot-toast';

// const CATEGORIES = ['All', 'UI/UX', 'Branding', 'MERN', 'Motion', 'Illustration'];

// export default function Feed() {
//   const [posts, setPosts] = useState([]);
//   const [collabs, setCollabs] = useState([]);
//   const [category, setCategory] = useState('All');
//   const [loading, setLoading] = useState(true);
//   const [showPostModal, setShowPostModal] = useState(false);

//   useEffect(() => { fetchPosts(); fetchCollabs(); }, [category]);

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get('/posts', {
//         params: category !== 'All' ? { category } : {}
//       });
//       setPosts(res.data);
//     } catch {
//       toast.error('Failed to load posts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCollabs = async () => {
//     try {
//       const res = await api.get('/collabs');
//       setCollabs(res.data.slice(0, 3));
//     } catch {}
//   };

//   const handlePostCreated = (newPost) => {
//     setPosts(prev => [newPost, ...prev]);
//     setShowPostModal(false);
//     toast.success('Post published! 🎉');
//   };

//   return (
//     <div className="flex">
//       {/* Main Feed */}
//       <div className="flex-1 p-6 max-w-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-5">
//           <h1 className="font-syne font-black text-xl text-ink">Discover</h1>
//           <button
//             onClick={() => setShowPostModal(true)}
//             className="bg-ink text-white text-sm font-dm font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition-opacity lg:hidden"
//           >
//             + Post
//           </button>
//         </div>

//         {/* Filter Chips */}
//         <div className="flex gap-2 flex-wrap mb-5">
//           {CATEGORIES.map(cat => (
//             <button
//               key={cat}
//               onClick={() => setCategory(cat)}
//               className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
//                 category === cat
//                   ? 'bg-ink text-white border-ink'
//                   : 'bg-white text-muted border-black/10 hover:border-ink hover:text-ink'
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* Posts */}
//         {loading ? (
//           <div className="flex flex-col gap-4">
//             {[1,2,3].map(i => (
//               <div key={i} className="bg-white rounded-2xl border border-black/10 h-64 animate-pulse" />
//             ))}
//           </div>
//         ) : posts.length === 0 ? (
//           <div className="text-center py-20">
//             <div className="text-4xl mb-3">🎨</div>
//             <div className="font-syne font-bold text-lg text-ink mb-2">No posts yet</div>
//             <div className="text-muted text-sm font-dm mb-4">Be the first to share your work!</div>
//             <button
//               onClick={() => setShowPostModal(true)}
//               className="bg-ink text-white font-dm font-semibold px-6 py-2.5 rounded-xl hover:opacity-80 transition-opacity"
//             >
//               Post Your Work →
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-4">
//             {posts.map(post => (
//               <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Right Panel */}
//       <aside className="hidden xl:flex flex-col w-72 p-4 sticky top-[60px] self-start gap-6">
//         {/* Collab Requests */}
//         <div>
//           <h2 className="font-syne font-bold text-sm text-ink mb-3">🔥 Collab Requests</h2>
//           {collabs.length === 0 ? (
//             <div className="text-xs text-muted font-dm">No open collabs yet.</div>
//           ) : (
//             collabs.map(collab => (
//               <CollabRequestCard key={collab._id} collab={collab} />
//             ))
//           )}
//         </div>

//         {/* Post CTA */}
//         <div className="bg-ink rounded-2xl p-5">
//           <div className="font-syne font-black text-white text-base mb-1">Share your work</div>
//           <div className="text-white/50 text-xs font-dm mb-4">Post to the feed and find collaborators</div>
//           <button
//             onClick={() => setShowPostModal(true)}
//             className="w-full bg-accent text-white font-dm font-semibold py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
//           >
//             + Post Work
//           </button>
//         </div>
//       </aside>

//       {/* Create Post Modal */}
//       {showPostModal && (
//         <CreatePostModal
//           onClose={() => setShowPostModal(false)}
//           onCreated={handlePostCreated}
//         />
//       )}
//     </div>
//   );
// }