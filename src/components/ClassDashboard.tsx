import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  TrendingUp,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  FileText,
  Star,
  Award,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Student, AttendanceStatus, Announcement } from '../types/academic';
import { soundEffects } from '../utils/soundEffects';
import { fireStarCelebration } from '../utils/confetti';

interface ClassDashboardProps {
  students: Student[];
  onUpdateAttendance: (studentId: string, status: AttendanceStatus) => void;
  onMarkAllPresent: () => void;
  onOpenReportCard: (student: Student) => void;
  onOpenStudentDetail: (student: Student) => void;
  onQuickAwardStar: (student: Student) => void;
  announcements: Announcement[];
  onNavigateToGradebook: (studentId?: string) => void;
}

export const ClassDashboard: React.FC<ClassDashboardProps> = ({
  students,
  onUpdateAttendance,
  onMarkAllPresent,
  onOpenReportCard,
  onOpenStudentDetail,
  onQuickAwardStar,
  announcements,
  onNavigateToGradebook,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'high' | 'guidance' | 'absent'>('all');

  // Compute live statistics
  const totalStudents = students.length;
  const presentCount = students.filter((s) => s.todayAttendance === 'hadir').length;
  const sickCount = students.filter((s) => s.todayAttendance === 'sakit').length;
  const permissionCount = students.filter((s) => s.todayAttendance === 'izin').length;
  const alphaCount = students.filter((s) => s.todayAttendance === 'alpa').length;

  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 100;

  // Calculate average class score across all subjects
  const allFinalScores: number[] = [];
  students.forEach((s) => {
    Object.values(s.grades).forEach((g) => allFinalScores.push(g.finalScore));
  });
  const classAverage =
    allFinalScores.length > 0
      ? (allFinalScores.reduce((acc, v) => acc + v, 0) / allFinalScores.length).toFixed(1)
      : '0';

  const totalStars = students.reduce((acc, s) => acc + s.p5Stars, 0);

  // Filter students based on search and selected filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nisn.includes(searchQuery);

    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    if (filterType === 'absent') return student.todayAttendance !== 'hadir';

    // Average score for this student
    const studentScores = Object.values(student.grades).map((g) => g.finalScore);
    const studentAvg =
      studentScores.reduce((acc, curr) => acc + curr, 0) / studentScores.length;

    if (filterType === 'high') return studentAvg >= 90;
    if (filterType === 'guidance') return studentAvg < 82;

    return true;
  });

  const handleAttendanceClick = (
    e: React.MouseEvent,
    studentId: string,
    status: AttendanceStatus
  ) => {
    e.stopPropagation();
    soundEffects.playPop();
    onUpdateAttendance(studentId, status);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Class Overview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#7C3AED] text-white p-6 shadow-academic-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-[#EC4899]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 translate-y-12 w-48 h-48 bg-[#7DD3FC]/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#E0F2FE]">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>Semangat Pagi · Tahun Ajaran 2025/2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Bertugas, Pak Khoyum Supardi!
            </h2>
            <p className="text-sm text-[#E0F2FE] max-w-2xl leading-relaxed">
              Pantau perkembangan akademik, ketercapaian Tujuan Pembelajaran (TP) Kurikulum Merdeka, serta pembiasaan Profil Pelajar Pancasila siswa Kelas IV-B Tilamuta hari ini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onMarkAllPresent}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#22C55E] text-white hover:bg-[#16A34A] shadow-md transition-all active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tandai Semua Hadir</span>
            </button>
            <button
              onClick={() => onNavigateToGradebook()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/15 backdrop-blur-md text-white hover:bg-white/25 border border-white/20 transition-all"
            >
              <FileText className="w-4 h-4 text-[#7DD3FC]" />
              <span>Rapor Semester</span>
            </button>
          </div>
        </div>

        {/* Dual-Color Energetic Progress Track */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white/90">Kesiapan Rapor Kurikulum Merdeka:</span>
            <div className="w-48 sm:w-64 bg-white/20 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7DD3FC] via-[#FBBF24] to-[#EC4899] transition-all duration-700"
                style={{ width: '100%' }}
              ></div>
            </div>
            <span className="font-bold text-[#86EFAC]">100% Lengkap (8/8 Siswa)</span>
          </div>

          <span className="text-[#E0F2FE]/80">
            Terakhir disinkronkan: Hari ini, pukul 07.45 WITA
          </span>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div className="bg-white rounded-2xl p-5 border border-[#C4B5FD]/30 shadow-academic-sm hover:shadow-academic-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B6880]">
              Total Siswa Kelas IV-B
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#4C1D95]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1F1B2E]">{totalStudents}</span>
            <span className="text-xs text-[#6B6880]">Siswa Terdata</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#6B6880]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#4C1D95]"></span>
            <span>Laki-laki: 4</span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#EC4899] ml-1"></span>
            <span>Perempuan: 4</span>
          </div>
        </div>

        {/* Kehadiran Hari Ini */}
        <div className="bg-white rounded-2xl p-5 border border-[#C4B5FD]/30 shadow-academic-sm hover:shadow-academic-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B6880]">
              Presensi Hari Ini
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0369A1]">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1F1B2E]">{attendanceRate}%</span>
            <span className="text-xs font-semibold text-[#22C55E]">
              {presentCount} Hadir
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#6B6880]">
            <span>Sakit: <strong className="text-[#F59E0B]">{sickCount}</strong></span>
            <span>·</span>
            <span>Izin: <strong className="text-[#0284C7]">{permissionCount}</strong></span>
            <span>·</span>
            <span>Alpa: <strong className="text-[#EF4444]">{alphaCount}</strong></span>
          </div>
        </div>

        {/* Rata-rata Capaian Kelas */}
        <div className="bg-white rounded-2xl p-5 border border-[#C4B5FD]/30 shadow-academic-sm hover:shadow-academic-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B6880]">
              Rata-rata Capaian TP
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1F1B2E]">{classAverage}</span>
            <span className="text-xs font-bold text-[#4C1D95] bg-[#EDE9FE] px-2 py-0.5 rounded-full">
              Sangat Baik
            </span>
          </div>
          <p className="mt-2 text-xs text-[#6B6880]">
            Kriteria Ketercapaian (KKTP): 75.0
          </p>
        </div>

        {/* Total Bintang Karakter P5 */}
        <div className="bg-white rounded-2xl p-5 border border-[#C4B5FD]/30 shadow-academic-sm hover:shadow-academic-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B6880]">
              Bintang Karakter P5
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] flex items-center justify-center text-[#EC4899]">
              <Star className="w-5 h-5 fill-[#EC4899]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1F1B2E]">{totalStars}</span>
            <span className="text-xs font-semibold text-[#EC4899]">Bintang Diraih</span>
          </div>
          <p className="mt-2 text-xs text-[#6B6880]">
            Gotong royong & kreasi sulam Karawo aktif
          </p>
        </div>
      </div>

      {/* Main Grid: Student Roster Cards & Sidebar Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Main Column: Student Roster */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls: Search & Segmented Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#C4B5FD]/30 shadow-academic-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6880]" />
              <input
                type="text"
                placeholder="Cari nama siswa, panggilan, atau NISN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#EDE9FE] focus:outline-none focus:border-[#4C1D95] focus:ring-3 focus:ring-[#7DD3FC]/30 bg-[#FAF9FF] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6B6880] hover:text-[#1F1B2E]"
                >
                  Batal
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filterType === 'all'
                    ? 'bg-[#4C1D95] text-white shadow-xs'
                    : 'text-[#6B6880] hover:text-[#1F1B2E]'
                }`}
              >
                Semua ({students.length})
              </button>
              <button
                onClick={() => setFilterType('high')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filterType === 'high'
                    ? 'bg-[#4C1D95] text-white shadow-xs'
                    : 'text-[#6B6880] hover:text-[#1F1B2E]'
                }`}
              >
                Unggul (≥90)
              </button>
              <button
                onClick={() => setFilterType('guidance')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filterType === 'guidance'
                    ? 'bg-[#4C1D95] text-white shadow-xs'
                    : 'text-[#6B6880] hover:text-[#1F1B2E]'
                }`}
              >
                Perlu Bimbingan
              </button>
              <button
                onClick={() => setFilterType('absent')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filterType === 'absent'
                    ? 'bg-[#4C1D95] text-white shadow-xs'
                    : 'text-[#6B6880] hover:text-[#1F1B2E]'
                }`}
              >
                Tidak Hadir ({sickCount + permissionCount + alphaCount})
              </button>
            </div>
          </div>

          {/* Student Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl p-8 text-center border border-[#EDE9FE]">
                <p className="text-sm font-semibold text-[#6B6880]">
                  Tidak ada data siswa yang cocok dengan filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                  }}
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-[#4C1D95] bg-[#EDE9FE] hover:bg-[#C4B5FD] transition-all"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const studentScores = Object.values(student.grades).map((g) => g.finalScore);
                const avgScore = (
                  studentScores.reduce((a, b) => a + b, 0) / studentScores.length
                ).toFixed(1);

                return (
                  <div
                    key={student.id}
                    className="bg-white rounded-2xl p-5 border border-[#C4B5FD]/30 shadow-academic-sm hover:shadow-academic-md hover:border-[#4C1D95]/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header: Avatar & Info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-13 h-13 rounded-2xl object-cover ring-3 ring-[#EDE9FE] group-hover:ring-[#4C1D95]/50 transition-all shadow-sm"
                            />
                            <span
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white ${
                                student.gender === 'L' ? 'bg-[#0284C7]' : 'bg-[#EC4899]'
                              }`}
                            >
                              {student.gender}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-[#1F1B2E] group-hover:text-[#4C1D95] transition-colors leading-tight">
                              {student.name}
                            </h3>
                            <div className="flex items-center gap-2 text-[11px] text-[#6B6880] mt-0.5">
                              <span>NISN: {student.nisn}</span>
                              <span>·</span>
                              <span className="font-medium text-[#4C1D95]">
                                {student.nickname}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Average Score Badge */}
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#EDE9FE] text-[#4C1D95] font-extrabold text-xs">
                            <TrendingUp className="w-3 h-3 text-[#7C3AED]" />
                            <span>{avgScore}</span>
                          </div>
                          <span className="block text-[10px] text-[#6B6880] mt-0.5">
                            Rata-rata TP
                          </span>
                        </div>
                      </div>

                      {/* Interactive Presensi Quick Bar */}
                      <div className="mt-4 pt-3 border-t border-[#EDE9FE] flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#6B6880]">
                          Presensi Hari Ini:
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleAttendanceClick(e, student.id, 'hadir')}
                            title="Hadir"
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                              student.todayAttendance === 'hadir'
                                ? 'bg-[#22C55E] text-white shadow-xs'
                                : 'bg-[#F2EBFF] text-[#6B6880] hover:text-[#22C55E]'
                            }`}
                          >
                            H
                          </button>
                          <button
                            onClick={(e) => handleAttendanceClick(e, student.id, 'sakit')}
                            title="Sakit"
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                              student.todayAttendance === 'sakit'
                                ? 'bg-[#F59E0B] text-white shadow-xs'
                                : 'bg-[#F2EBFF] text-[#6B6880] hover:text-[#F59E0B]'
                            }`}
                          >
                            S
                          </button>
                          <button
                            onClick={(e) => handleAttendanceClick(e, student.id, 'izin')}
                            title="Izin"
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                              student.todayAttendance === 'izin'
                                ? 'bg-[#0284C7] text-white shadow-xs'
                                : 'bg-[#F2EBFF] text-[#6B6880] hover:text-[#0284C7]'
                            }`}
                          >
                            I
                          </button>
                          <button
                            onClick={(e) => handleAttendanceClick(e, student.id, 'alpa')}
                            title="Alpa / Tanpa Keterangan"
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                              student.todayAttendance === 'alpa'
                                ? 'bg-[#EF4444] text-white shadow-xs'
                                : 'bg-[#F2EBFF] text-[#6B6880] hover:text-[#EF4444]'
                            }`}
                          >
                            A
                          </button>
                        </div>
                      </div>

                      {/* Teacher Note Snippet */}
                      <p className="mt-2.5 text-xs text-[#6B6880] line-clamp-2 leading-relaxed bg-[#FAF9FF] p-2.5 rounded-xl border border-[#EDE9FE]">
                        {student.teacherNotes}
                      </p>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="mt-4 pt-3 border-t border-[#EDE9FE] flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEffects.playStarChime();
                          fireStarCelebration(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
                          onQuickAwardStar(student);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FCE7F3] text-[#BE185D] hover:bg-[#F9A8D4]/40 active:scale-95 transition-all"
                      >
                        <Star className="w-3.5 h-3.5 fill-[#EC4899] text-[#EC4899]" />
                        <span>+{student.p5Stars} Bintang</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenStudentDetail(student)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#4C1D95] hover:bg-[#EDE9FE] transition-all"
                        >
                          Profil
                        </button>
                        <button
                          onClick={() => onOpenReportCard(student)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#4C1D95] text-white hover:bg-[#340075] transition-all"
                        >
                          <span>Rapor</span>
                          <ArrowUpRight className="w-3 h-3 text-[#7DD3FC]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right / Sidebar: Announcements & P5 Focus */}
        <div className="lg:col-span-4 space-y-4">
          {/* Focus Proyek P5 Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#C4B5FD]/30 shadow-academic-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#4C1D95]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#1F1B2E]">
                    Fokus Proyek P5 Semester Ini
                  </h3>
                  <span className="text-[11px] text-[#6B6880]">Kearifan Lokal Boalemo</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCE7F3] text-[#BE185D]">
                Aktif
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5">
              <h4 className="text-sm font-bold text-[#4C1D95]">
                "Pesona Sulam Karawo Gorontalo di Tangan Generasi Cilik"
              </h4>
              <p className="text-xs text-[#6B6880] leading-relaxed">
                Peserta didik belajar mengenal keunikan serat kain, makna geometris mahkota (Makuta), serta mempraktikkan gotong royong dan kemandirian berkarya.
              </p>

              <div className="p-3 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1F1B2E]">Progres Karya Miniatur:</span>
                  <span className="font-bold text-[#22C55E]">85%</span>
                </div>
                <div className="w-full bg-[#EDE9FE] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#4C1D95] to-[#EC4899] h-full rounded-full"
                    style={{ width: '85%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pengumuman & Agenda Terkini */}
          <div className="bg-white rounded-2xl p-5 border border-[#C4B5FD]/30 shadow-academic-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#4C1D95]" />
                <h3 className="text-xs font-bold text-[#1F1B2E]">
                  Agenda & Pengumuman Sekolah
                </h3>
              </div>
              <span className="text-[11px] text-[#4C1D95] font-semibold">
                Tilamuta
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 rounded-xl bg-[#FAF9FF] hover:bg-[#F2EBFF]/60 border border-[#EDE9FE] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#4C1D95]">
                      {ann.category}
                    </span>
                    <span className="text-[10px] text-[#6B6880]">{ann.date}</span>
                  </div>
                  <h4 className="mt-1.5 text-xs font-bold text-[#1F1B2E] leading-snug">
                    {ann.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-[#6B6880] line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
