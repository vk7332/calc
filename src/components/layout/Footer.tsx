import { Upload, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#000d1a] text-gray-300 border-t border-blue-900/30 transition-colors duration-300 relative overflow-hidden">
      {/* Glowing background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 text-2xl font-bold text-white mb-8 group cursor-pointer">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all">
                <span className="text-white text-base italic">VK</span>
              </div>
              <span className="tracking-tight hover:text-amber-500 transition-colors">VKCalc.in</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-xs font-medium">
              Your trusted hub for financial mathematics and tax compliance. Built with precision for the taxpayers of India.
            </p>
            <div className="flex gap-4">
              {['Facebook', 'Twitter', 'LinkedIn', 'YouTube'].map((social) => (
                <div key={social} className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-amber-500 hover:border-amber-500 group transition-all duration-500 shadow-lg">
                  <div className="w-5 h-5 bg-gray-400 group-hover:bg-white transition-colors rounded-sm opacity-40 group-hover:opacity-100"></div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-[10px] mb-10 uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Quick Links</h3>
            <ul className="space-y-5">
              {['Home', 'Calculators', 'Blog', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-amber-400 transition-all flex items-center gap-3 group font-bold tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)] opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-[10px] mb-10 uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Legal Hub</h3>
            <ul className="space-y-5">
              {['Privacy Policy', 'Terms of Service', 'Disclaimer', 'Contact Us'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-amber-400 transition-all flex items-center gap-3 group font-bold tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)] opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-white font-bold text-[10px] mb-8 uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Support</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Us</div>
                    <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors tracking-tight">support@vkcalc.in</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Call Support</div>
                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">+91 70180 64385</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-amber-500/30 transition-all duration-500 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500 animate-pulse">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Secure Upload</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Fast & encrypted tax document review service.</p>
            </div>
          </div>
        </div>

        {/* AdSense Placeholder in Footer */}
        <div className="mb-16 p-8 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-amber-500/30 transition-all duration-500 shadow-2xl">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] group-hover:text-amber-500 transition-colors">Sponsored Content</div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-lg font-bold text-white/40 group-hover:text-white transition-colors">AdSense Placeholder</div>
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Leaderboard 728 × 90 or Large Rectangle 336 × 280</div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></span>
            © 2026 VKCalc.in • Built for Indian Taxpayers
          </div>
          <div className="flex items-center gap-10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#000d1a] bg-gradient-to-br from-gray-700 to-gray-900 shadow-xl"></div>
              ))}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">
              Trusted by <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">10,000+ Users</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
