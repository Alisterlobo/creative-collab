import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import CollabRequestCard from '../components/collab/CollabRequestCard';
import CreateCollabModal from '../components/collab/CreateCollabModal';
import toast from 'react-hot-toast';

export default function Explore() {
  const [collabs, setCollabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchCollabs(); }, []);

  const fetchCollabs = async () => {
    try {
      const res = await api.get('/collabs');
      setCollabs(res.data);
    } catch {
      toast.error('Failed to load collabs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne font-black text-2xl text-ink">Explore Collabs</h1>
          <p className="text-sm text-muted font-dm mt-1">Find your perfect creative partner</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-ink text-white font-dm font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-80 transition-opacity"
        >
          + Post Collab Request
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-black/10 h-40 animate-pulse" />
          ))}
        </div>
      ) : collabs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🤝</div>
          <div className="font-syne font-bold text-lg text-ink mb-2">No collab requests yet</div>
          <div className="text-muted text-sm font-dm mb-4">Be the first to post one!</div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-ink text-white font-dm font-semibold px-6 py-2.5 rounded-xl hover:opacity-80 transition-opacity"
          >
            Post Collab Request →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collabs.map(collab => (
            <div
              key={collab._id}
              onClick={() => navigate(`/collab/${collab._id}`)}
              className="cursor-pointer"
            >
              <CollabRequestCard collab={collab} />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CreateCollabModal
          onClose={() => setShowModal(false)}
          onCreated={() => { fetchCollabs(); setShowModal(false); toast.success('Collab posted!'); }}
        />
      )}
    </div>
  );
}