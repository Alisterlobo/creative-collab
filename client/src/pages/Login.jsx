import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
            Where Devs<br />& Designers<br />
            <span className="text-accent">Build Together.</span>
          </p>
          <p className="text-white/40 font-dm text-sm leading-relaxed max-w-sm">
            Share your work, find collaborators, build real projects. The platform for creative professionals.
          </p>
        </div>
        <div className="flex gap-6">
          <div>
            <div className="font-syne font-black text-white text-2xl">2,400+</div>
            <div className="text-white/40 text-xs font-dm">Active Creators</div>
          </div>
          <div>
            <div className="font-syne font-black text-white text-2xl">840+</div>
            <div className="text-white/40 text-xs font-dm">Collabs Launched</div>
          </div>
          <div>
            <div className="font-syne font-black text-white text-2xl">98%</div>
            <div className="text-white/40 text-xs font-dm">Satisfaction</div>
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

          <h1 className="font-syne font-black text-3xl text-ink mb-2">Welcome back</h1>
          <p className="text-muted font-dm text-sm mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alister@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-surface font-dm text-sm outline-none focus:border-ink transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-white font-dm font-semibold py-3 rounded-xl mt-2 hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-muted font-dm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-ink font-semibold hover:text-accent transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}