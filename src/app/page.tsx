"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Shield, LayoutDashboard, Database, CreditCard, MessageSquare, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CRMLanding() {
  const { user, signIn, loginWithCode, loading } = useAuth();
  const router = useRouter();
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentCreds, setStudentCreds] = useState({ email: "", code: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await loginWithCode(studentCreds.email, studentCreds.code);
    } catch (err) {
      toast.error("Invalid email or access code");
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 px-8 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Shield className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black italic tracking-tighter">CRM<span className="text-blue-500">PRO</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] uppercase font-black tracking-[0.2em] italic text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Infrastructure</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <a href="#roadmap" className="hover:text-white transition-colors">Performance</a>
        </div>
        <div>
          {user ? (
            <Button onClick={() => router.push("/dashboard")} className="rounded-2xl italic px-8">Return to Console</Button>
          ) : (
            <Button onClick={signIn} className="rounded-2xl italic px-8 bg-white text-gray-900 hover:bg-gray-200">System Login</Button>
          )}
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-400 italic">Centralized Management System V4.0</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black italic leading-[1] tracking-tighter mb-10 max-w-5xl">
          The Architecture of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Modern Education.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 font-medium italic mb-12 max-w-2xl leading-relaxed">
          A professional-grade CRM designed for modern learning centers.
          Real-time analytics, student tracking, and financial intelligence in one unified interface.
        </p>

        {!user && (
          <div className="flex flex-col sm:flex-row gap-6">
            <Button onClick={signIn} size="lg" className="px-12 py-8 rounded-3xl text-lg font-black italic flex items-center gap-3 bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/20">
              Authenticate via Google <ArrowRight size={20} />
            </Button>
            <Button onClick={() => setIsStudentModalOpen(true)} variant="outline" size="lg" className="px-12 py-8 rounded-3xl text-lg font-black italic border-white/10 hover:bg-white/5">
              Student Portal (Access Code)
            </Button>
          </div>
        )}
      </section>

      {/* Student Login Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="bg-[#121214] border border-white/10 rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <button
              onClick={() => setIsStudentModalOpen(false)}
              className="absolute top-6 right-8 text-gray-500 hover:text-white text-2xl"
            >
              &times;
            </button>

            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
                <Shield size={32} />
              </div>
              <h2 className="text-3xl font-black italic text-white tracking-tight">Student Login</h2>
              <p className="text-gray-500 italic text-sm mt-2">Enter credentials provided by your center.</p>
            </div>

            <form onSubmit={handleStudentLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic ml-1">Official Email</label>
                <input
                  required
                  type="email"
                  value={studentCreds.email}
                  onChange={(e) => setStudentCreds({ ...studentCreds, email: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white italic outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                  placeholder="name@university.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic ml-1">Access Code</label>
                <input
                  required
                  type="password"
                  value={studentCreds.code}
                  onChange={(e) => setStudentCreds({ ...studentCreds, code: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white italic outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium tracking-wide"
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full py-8 rounded-2xl text-lg font-black italic bg-white text-gray-900 hover:bg-gray-200 transition-all shadow-xl shadow-white/5 mt-4"
              >
                {loginLoading ? "Verifying..." : "Initialize Portal Session"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Feature Grid */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Database size={32} />, title: "Data Integrity", desc: "Enterprise Firestore integration ensuring your student records are immutable and scalable." },
            { icon: <BarChart3 size={32} />, title: "Intelligence", desc: "Deep analytics and financial reporting using advanced Recharts visualization." },
            { icon: <CreditCard size={32} />, title: "Audit Trail", desc: "Full payment history tracking with partial payment support and real-time statuses." },
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
              <div className="text-blue-500 mb-8 p-4 bg-blue-500/10 w-fit rounded-2xl group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-2xl font-black italic mb-4">{feature.title}</h3>
              <p className="text-gray-400 italic text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] italic text-gray-500">
        <div className="flex items-center gap-2 text-white">
          <Shield size={16} /> <span>CRM PRO 2026. ALL RIGHTS RESERVED.</span>
        </div>
        <div className="flex gap-12">
          <a href="#" className="hover:text-white transition-colors">Privacy Infrastructure</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Legal Compliance</a>
        </div>
      </footer>
    </main>
  );
}
