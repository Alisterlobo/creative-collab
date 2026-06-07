import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function CollabRequestCard({ collab }) {
  const navigate = useNavigate();

  const handleApply = async () => {
    try {
      await api.put(`/collabs/${collab._id}/apply`);
      toast.success('Application sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
  };

  const typeColors = {
    Developer: 'bg-purple-100 text-purple-700',
    Designer: 'bg-orange-100 text-orange-700',
    Both: 'bg-green-100 text-green-700',
    Other: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="bg-white border border-black/10 rounded-xl p-4 mb-3 hover:shadow-sm transition-shadow">
      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ${typeColors[collab.lookingFor]}`}>
        {collab.lookingFor} Needed
      </span>
      <h3 className="font-semibold text-sm text-ink mt-2 mb-1">{collab.title}</h3>
      <p className="text-xs text-muted font-dm line-clamp-2 mb-3">{collab.description}</p>
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-full bg-ink flex items-center justify-center text-white text-[9px] font-bold cursor-pointer"
          onClick={() => navigate(`/profile/${collab.owner?._id}`)}
        >
          {collab.owner?.name?.[0]}
        </div>
        <span className="text-xs text-muted flex-1">{collab.owner?.name}</span>
        <button
          onClick={handleApply}
          className="text-[11px] font-bold bg-ink text-white px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
        >
          Apply
        </button>
      </div>
    </div>
  );
}