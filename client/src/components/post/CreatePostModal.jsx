import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['UI/UX', 'Branding', 'MERN', 'Motion', 'Illustration', 'Other'];

export default function CreatePostModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', description: '', category: 'UI/UX',
    tags: '', openToCollab: false
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append('image', image);
      const res = await api.post('/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onCreated(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-black/10">
          <div>
            <h2 className="font-syne font-black text-xl text-ink">Share Your Work</h2>
            <p className="text-xs text-muted font-dm mt-0.5">Post to the CreativeCollab feed</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink text-xl transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-2">Project Title *</label>
            <input
              name="title" value={form.title} onChange={handleChange} required
              placeholder="e.g. Finance Dashboard — Dark UI Kit"
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-2">Description *</label>
            <textarea
              name="description" value={form.description} onChange={handleChange} required
              rows={3} placeholder="Describe your project, tools used, process..."
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Category</label>
              <select
                name="category" value={form.category} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink transition-colors"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Tags (comma separated)</label>
              <input
                name="tags" value={form.tags} onChange={handleChange}
                placeholder="react, figma, ui"
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink transition-colors"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-2">Project Image</label>
            {preview ? (
              <div className="relative">
                <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-xl" />
                <button
                  type="button" onClick={() => { setImage(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black transition-colors"
                >✕</button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-black/15 rounded-xl h-32 cursor-pointer hover:border-ink transition-colors">
                <span className="text-2xl mb-1">🖼️</span>
                <span className="text-xs text-muted font-dm">Click to upload image</span>
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            )}
          </div>

          {/* Open to Collab */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox" name="openToCollab"
              checked={form.openToCollab} onChange={handleChange}
              className="w-4 h-4 accent-ink"
            />
            <span className="text-sm font-dm text-ink">I'm open to collaborators on this project</span>
          </label>

          <div className="flex gap-3 mt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-black/10 text-sm font-dm text-muted hover:text-ink hover:border-ink transition-all"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-[2] py-3 rounded-xl bg-ink text-white text-sm font-dm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}