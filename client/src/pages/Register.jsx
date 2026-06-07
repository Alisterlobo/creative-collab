import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-ink flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          <span className="font-syne font-black text-white text-lg">CreativeCollab</span>
        </div>
        <div>
          <p className="font-syne font-black text-white text-5xl leading-tight mb-6">
            Join 2,400+<br />Creators<br />
            <span className="text-accent">Building Things.</span>
          </p>
          <p className="text-white/40 font-dm text-sm leading-relaxed max-w-sm">
            Post your work, find your collab partner, ship real products together.
          </p>
        </div>
        <div className="bg-white/5 rounded-2xl p-6">
          <p className="text-white/60 font-dm text-sm italic mb-3">
            "Found my dev partner in 2 days. We shipped our SaaS in 6 weeks."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">SR</div>
            <div>
              <div className="text-white text-sm font-semibold">Sneha Rao</div>
              <div className="text-white/40 text-xs">UI/UX Designer · Bengaluru</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <span className="font-syne font-black text-ink text-lg">CreativeCollab</span>
          </div>

          <h1 className="font-syne font-black text-3xl text-ink mb-2">Create account</h1>
          <p className="text-muted font-dm text-sm mb-8">Start collaborating today</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Full Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Alister Lobo"
                required
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="alister@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-white font-dm font-semibold py-3 rounded-xl mt-2 hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-muted font-dm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-ink font-semibold hover:text-accent transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}