import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CreateCollabModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', description: '',
    lookingFor: 'Developer', compensation: 'Credit Exchange'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/collabs', form);
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create collab');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-black/10">
          <div>
            <h2 className="font-syne font-black text-xl text-ink">Post Collab Request</h2>
            <p className="text-xs text-muted font-dm mt-0.5">Find your creative partner</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-2">Project Title *</label>
            <input
              name="title" value={form.title} onChange={handleChange} required
              placeholder="e.g. SaaS landing page redesign"
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink mb-2">Description *</label>
            <textarea
              name="description" value={form.description} onChange={handleChange} required
              rows={3} placeholder="What are you building? What do you need help with?"
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink transition-colors resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Looking for</label>
              <select name="lookingFor" value={form.lookingFor} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink">
                <option>Developer</option>
                <option>Designer</option>
                <option>Both</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Compensation</label>
              <select name="compensation" value={form.compensation} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink">
                <option>Credit Exchange</option>
                <option>Revenue Share</option>
                <option>Equity</option>
                <option>Paid</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-black/10 text-sm font-dm text-muted hover:text-ink hover:border-ink transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-[2] py-3 rounded-xl bg-ink text-white text-sm font-dm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50">
              {loading ? 'Posting...' : 'Post Request →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}