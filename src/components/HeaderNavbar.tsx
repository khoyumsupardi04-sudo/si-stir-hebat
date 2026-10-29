import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  FileSpreadsheet,
  Award,
  Users,
  HeartHandshake,
  Volume2,
  VolumeX,
  PlusCircle,
  Printer,
  Sparkles,
  School,
  BellRing,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface HeaderNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onOpenNewAssessment: () => void;
  onOpenBatchPrint: () => void;
  unreadAnnouncementsCount: number;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
  onOpenNewAssessment,
  onOpenBatchPrint,
  unreadAnnouncementsCount,
}) => {
  const handleTabChange = (tabId: string) => {
    soundEffects.playPop();
    setActiveTab(tabId);
  };

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundEffects.setMuted(nextState);
    if (!nextState) {
      soundEffects.playStarChime();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#C4B5FD]/35 shadow-academic-sm">
      {/* Top Identity Ribbon */}
      <div className="bg-[#4C1D95] text-white px-4 py-1.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-semibold">
              <School className="w-3 h-3 text-[#7DD3FC]" />
              SD Negeri 01 Tilamuta
            </span>
            <span className="text-white/80">Kab. Boalemo, Gorontalo</span>
            <span className="hidden sm:inline text-white/50">·</span>
            <span className="hidden sm:inline text-white/90">Fase B · Kelas IV-B · Semester II (Genap) 2025/2026</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-white/90">
              Wali Kelas: <strong className="font-semibold text-white">Khoyum Supardi, S.Pd.</strong>
            </span>
            <span className="inline-flex items-center gap-1 bg-[#22C55E]/20 text-[#86EFAC] px-2 py-0.5 rounded-full text-[11px] font-medium border border-[#22C55E]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
              Sistem Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4C1D95] to-[#EC4899] flex items-center justify-center text-white shadow-md shadow-[#4C1D95]/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold tracking-tight text-[#1F1B2E]">
                  Vibrant Academic Pulse
                </h1>
                <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#EDE9FE] text-[#4C1D95] rounded-md">
                  Kurikulum Merdeka
                </span>
              </div>
              <p className="text-xs text-[#6B6880]">
                Portal Siswa, Rapor Cepat & Bintang P5 Boalemo
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              title={isMuted ? 'Nyalakan Efek Audio' : 'Matikan Efek Audio'}
              className="p-2 rounded-xl border border-[#EDE9FE] text-[#6B6880] hover:text-[#4C1D95] hover:bg-[#F2EBFF] transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#4C1D95]" />}
            </button>

            <button
              onClick={onOpenBatchPrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#C4B5FD] text-[#4C1D95] hover:bg-[#EDE9FE] transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rapor</span>
            </button>

            <button
              onClick={onOpenNewAssessment}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#4C1D95] text-white hover:bg-[#340075] shadow-sm shadow-[#4C1D95]/25 active:scale-98 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-[#7DD3FC]" />
              <span>Input Nilai</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Segmented Bar */}
        <nav className="flex items-center gap-1 mt-3 overflow-x-auto no-scrollbar pb-1 border-t border-[#EDE9FE] pt-2">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#4C1D95] text-white shadow-sm'
                : 'text-[#6B6880] hover:text-[#1F1B2E] hover:bg-[#F2EBFF]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dasbor & Presensi</span>
          </button>

          <button
            onClick={() => handleTabChange('gradebook')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'gradebook'
                ? 'bg-[#4C1D95] text-white shadow-sm'
                : 'text-[#6B6880] hover:text-[#1F1B2E] hover:bg-[#F2EBFF]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Buku Nilai & Rapor</span>
          </button>

          <button
            onClick={() => handleTabChange('achievements')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'achievements'
                ? 'bg-[#4C1D95] text-white shadow-sm'
                : 'text-[#6B6880] hover:text-[#1F1B2E] hover:bg-[#F2EBFF]'
            }`}
          >
            <Award className="w-4 h-4 text-[#FBBF24]" />
            <span>Papan Prestasi P5</span>
            <span className="px-1.5 py-0.2 bg-[#EC4899] text-white text-[10px] rounded-full">
              Ceria
            </span>
          </button>

          <button
            onClick={() => handleTabChange('growth')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'growth'
                ? 'bg-[#4C1D95] text-white shadow-sm'
                : 'text-[#6B6880] hover:text-[#1F1B2E] hover:bg-[#F2EBFF]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Profil Siswa & Tumbuh Kembang</span>
          </button>

          <button
            onClick={() => handleTabChange('parent')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'parent'
                ? 'bg-[#4C1D95] text-white shadow-sm'
                : 'text-[#6B6880] hover:text-[#1F1B2E] hover:bg-[#F2EBFF]'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-[#EC4899]" />
            <span>Portal Wali Murid</span>
          </button>

          <button
            onClick={() => handleTabChange('announcements')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'announcements'
                ? 'bg-[#4C1D95] text-white shadow-sm'
                : 'text-[#6B6880] hover:text-[#1F1B2E] hover:bg-[#F2EBFF]'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>Agenda & Pengumuman</span>
            {unreadAnnouncementsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#EC4899]"></span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
