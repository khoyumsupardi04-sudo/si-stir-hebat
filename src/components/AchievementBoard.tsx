import React, { useState } from 'react';
import {
  Award,
  Star,
  Sparkles,
  Users,
  Brain,
  UserCheck,
  Heart,
  Globe,
  PlusCircle,
  Trophy,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { Student, Badge } from '../types/academic';
import { P5_DIMENSIONS } from '../data/mockData';
import { soundEffects } from '../utils/soundEffects';
import { fireAchievementConfetti, fireStarCelebration } from '../utils/confetti';

interface AchievementBoardProps {
  students: Student[];
  onAwardBadge: (
    studentId: string,
    badge: Omit<Badge, 'id' | 'earnedDate'>
  ) => void;
  onQuickAwardStar: (student: Student) => void;
}

export const AchievementBoard: React.FC<AchievementBoardProps> = ({
  students,
  onAwardBadge,
  onQuickAwardStar,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<Badge['dimension']>('Kreatif');
  const [badgeTitle, setBadgeTitle] = useState('Bintang Kreasi Karawo');
  const [badgeDescription, setBadgeDescription] = useState('Menunjukkan ketelitian dan kerja keras dalam merajut pola sulaman tradisional');
  const [starPoints, setStarPoints] = useState(15);
  const [filterDimension, setFilterDimension] = useState<string>('all');

  // Sorted students by total P5 stars
  const sortedStudents = [...students].sort((a, b) => b.p5Stars - a.p5Stars);
  const topThree = sortedStudents.slice(0, 3);

  // All badges collection
  const allBadgesWithStudent = students.flatMap((s) =>
    s.badges.map((b) => ({
      ...b,
      studentName: s.name,
      studentNickname: s.nickname,
      studentAvatar: s.avatar,
      studentId: s.id,
    }))
  );

  const filteredBadges = allBadgesWithStudent.filter((b) => {
    if (filterDimension === 'all') return true;
    return b.dimension === filterDimension;
  });

  const handleOpenAwardModal = (studentId?: string) => {
    if (studentId) setSelectedStudentId(studentId);
    soundEffects.playPop();
    setIsAwardModalOpen(true);
  };

  const handleConfirmAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    onAwardBadge(selectedStudentId, {
      title: badgeTitle,
      dimension: selectedDimension,
      icon: 'Award',
      description: badgeDescription,
      points: starPoints,
    });

    soundEffects.playBadgeAward();
    fireAchievementConfetti();
    setIsAwardModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner: Papan Prestasi & Bintang Karakter */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4C1D95] via-[#701A75] to-[#BE185D] text-white p-6 shadow-academic-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-[#FCE7F3]">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>Apresiasi Karakter Positif Pelajar Pancasila</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Papan Bintang & Prestasi Ceria
            </h2>
            <p className="text-xs sm:text-sm text-[#FCE7F3] max-w-xl leading-relaxed">
              Rayakan setiap usaha kecil, gotong royong, keberanian bertanya, dan kreativitas siswa Kelas IV-B Tilamuta dengan lencana penghargaan digital.
            </p>
          </div>

          <button
            onClick={() => handleOpenAwardModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#EC4899] text-white hover:bg-[#DB2777] shadow-md shadow-[#EC4899]/30 active:scale-98 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Beri Lencana Apresiasi</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium: Duta Karakter Bulan Ini */}
      <div className="bg-white rounded-2xl p-6 border border-[#C4B5FD]/30 shadow-academic-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE9FE]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FCE7F3] flex items-center justify-center text-[#EC4899]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1F1B2E]">
                Duta Bintang Karakter P5 Tergiat
              </h3>
              <p className="text-xs text-[#6B6880]">
                Apresiasi atas keaktifan, kebaikan hati, dan karya mandiri
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#4C1D95] bg-[#EDE9FE] px-2.5 py-1 rounded-xl">
            Oktober 2026
          </span>
        </div>

        {/* 3 Cards Podium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {topThree.map((student, rankIdx) => {
            const rankStyles = [
              {
                ring: 'ring-4 ring-[#FBBF24] border-2 border-[#FBBF24]',
                badgeBg: 'bg-[#FBBF24] text-white',
                label: 'Juara 1 Bintang',
              },
              {
                ring: 'ring-4 ring-[#94A3B8] border-2 border-[#94A3B8]',
                badgeBg: 'bg-[#94A3B8] text-white',
                label: 'Juara 2 Bintang',
              },
              {
                ring: 'ring-4 ring-[#D97706] border-2 border-[#D97706]',
                badgeBg: 'bg-[#D97706] text-white',
                label: 'Juara 3 Bintang',
              },
            ][rankIdx];

            return (
              <div
                key={student.id}
                className="relative bg-[#FAF9FF] p-5 rounded-2xl border border-[#EDE9FE] hover:shadow-academic-md transition-all flex flex-col items-center text-center group"
              >
                <span
                  className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${rankStyles.badgeBg}`}
                >
                  #{rankIdx + 1}
                </span>

                <div className="relative mt-2">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className={`w-18 h-18 rounded-2xl object-cover ${rankStyles.ring} shadow-md`}
                  />
                  <div className="absolute -bottom-2 -right-1 bg-[#4C1D95] text-white p-1 rounded-full shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                  </div>
                </div>

                <h4 className="mt-3 text-sm font-bold text-[#1F1B2E] group-hover:text-[#4C1D95] transition-colors">
                  {student.name}
                </h4>
                <p className="text-xs text-[#6B6880] mt-0.5">{rankStyles.label}</p>

                <div className="mt-3 px-3 py-1 bg-white rounded-xl border border-[#EDE9FE] text-xs font-extrabold text-[#EC4899] flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{student.p5Stars} Total Bintang</span>
                </div>

                <button
                  onClick={() => handleOpenAwardModal(student.id)}
                  className="mt-3.5 w-full py-1.5 rounded-xl text-xs font-semibold bg-[#EDE9FE] text-[#4C1D95] hover:bg-[#C4B5FD] transition-all"
                >
                  + Tambah Lencana
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 Dimensi Profil Pelajar Pancasila Trackers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {P5_DIMENSIONS.map((dim) => {
          return (
            <div
              key={dim.name}
              className="bg-white p-3.5 rounded-2xl border border-[#C4B5FD]/30 shadow-academic-sm text-center flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-9 h-9 mx-auto rounded-xl flex items-center justify-center text-white mb-2 shadow-xs"
                  style={{ backgroundColor: dim.color }}
                >
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1F1B2E] leading-snug">
                  {dim.name}
                </h4>
                <p className="text-[10px] text-[#6B6880] mt-1 leading-tight">
                  {dim.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#EDE9FE] text-[11px] font-semibold text-[#4C1D95]">
                Aktif Dibiasakan
              </div>
            </div>
          );
        })}
      </div>

      {/* Lencana Galeri & Filter */}
      <div className="bg-white rounded-2xl p-6 border border-[#C4B5FD]/30 shadow-academic-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDE9FE]">
          <div>
            <h3 className="text-sm font-bold text-[#1F1B2E]">
              Galeri Lencana Apresiasi Siswa
            </h3>
            <p className="text-xs text-[#6B6880]">
              Daftar penghargaan karakter yang telah disematkan kepada peserta didik
            </p>
          </div>

          {/* Filter dimension pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE]">
            <button
              onClick={() => setFilterDimension('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterDimension === 'all'
                  ? 'bg-[#4C1D95] text-white shadow-xs'
                  : 'text-[#6B6880] hover:text-[#1F1B2E]'
              }`}
            >
              Semua
            </button>
            {P5_DIMENSIONS.map((d) => (
              <button
                key={d.name}
                onClick={() => setFilterDimension(d.name)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  filterDimension === 'd.name'
                    ? 'bg-[#4C1D95] text-white shadow-xs'
                    : 'text-[#6B6880] hover:text-[#1F1B2E]'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredBadges.map((badge, idx) => (
            <div
              key={`${badge.id}-${idx}`}
              className="bg-[#FAF9FF] rounded-2xl p-4 border border-[#EDE9FE] hover:border-[#4C1D95]/40 hover:shadow-academic-sm transition-all flex items-start gap-3.5"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4C1D95] to-[#EC4899] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Star className="w-6 h-6 fill-[#FBBF24] text-[#FBBF24]" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#4C1D95]">
                    {badge.dimension}
                  </span>
                  <span className="text-[10px] text-[#6B6880]">{badge.earnedDate}</span>
                </div>

                <h4 className="text-xs font-bold text-[#1F1B2E]">{badge.title}</h4>
                <p className="text-[11px] text-[#6B6880] leading-relaxed line-clamp-2">
                  {badge.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-[#EDE9FE]/70 text-[11px]">
                  <span className="font-semibold text-[#1F1B2E]">
                    Ananda {badge.studentNickname}
                  </span>
                  <span className="font-bold text-[#EC4899]">+{badge.points} Poin</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Beri Lencana Apresiasi Baru */}
      {isAwardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1B2E]/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-academic-lg border border-[#C4B5FD]/40 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] flex items-center justify-center text-[#EC4899]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1F1B2E]">
                    Beri Lencana & Bintang Karakter
                  </h3>
                  <p className="text-xs text-[#6B6880]">
                    Pilih siswa dan berikan apresiasi positif
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAwardModalOpen(false)}
                className="text-[#6B6880] hover:text-[#1F1B2E] p-1.5 rounded-xl hover:bg-[#FAF9FF]"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleConfirmAward} className="space-y-4 text-xs">
              {/* Select Student */}
              <div>
                <label className="block font-bold text-[#1F1B2E] mb-1">
                  Pilih Peserta Didik:
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] focus:border-[#4C1D95] focus:outline-none bg-[#FAF9FF] font-medium"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.nickname}) · Kelas IV-B
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Dimensi P5 */}
              <div>
                <label className="block font-bold text-[#1F1B2E] mb-1">
                  Dimensi Profil Pelajar Pancasila:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {P5_DIMENSIONS.map((d) => (
                    <button
                      key={d.name}
                      type="button"
                      onClick={() => setSelectedDimension(d.name as Badge['dimension'])}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        selectedDimension === d.name
                          ? 'border-[#4C1D95] bg-[#EDE9FE] font-bold text-[#4C1D95]'
                          : 'border-[#EDE9FE] bg-[#FAF9FF] text-[#6B6880]'
                      }`}
                    >
                      <span className="block text-[11px]">{d.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Judul Lencana */}
              <div>
                <label className="block font-bold text-[#1F1B2E] mb-1">
                  Nama Penghargaan / Lencana:
                </label>
                <input
                  type="text"
                  value={badgeTitle}
                  onChange={(e) => setBadgeTitle(e.target.value)}
                  placeholder="Contoh: Juara Gotong Royong Meja Piket"
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] focus:border-[#4C1D95] focus:outline-none bg-[#FAF9FF]"
                  required
                />
              </div>

              {/* Deskripsi Alasan Apresiasi */}
              <div>
                <label className="block font-bold text-[#1F1B2E] mb-1">
                  Catatan Apresiasi / Alasan Pemberian:
                </label>
                <textarea
                  rows={2}
                  value={badgeDescription}
                  onChange={(e) => setBadgeDescription(e.target.value)}
                  placeholder="Ceritakan perilaku positif yang ditunjukkan ananda..."
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] focus:border-[#4C1D95] focus:outline-none bg-[#FAF9FF]"
                  required
                ></textarea>
              </div>

              {/* Star points selector */}
              <div>
                <label className="block font-bold text-[#1F1B2E] mb-1">
                  Tambahan Bintang Apresiasi:
                </label>
                <div className="flex items-center gap-2">
                  {[5, 10, 15, 20].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => setStarPoints(pts)}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                        starPoints === pts
                          ? 'bg-[#EC4899] text-white shadow-xs'
                          : 'bg-[#FAF9FF] text-[#6B6880] border border-[#EDE9FE]'
                      }`}
                    >
                      +{pts} Bintang
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-[#EDE9FE] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAwardModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B6880] hover:bg-[#FAF9FF]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#4C1D95] text-white hover:bg-[#340075] shadow-md transition-all active:scale-98"
                >
                  Sematkan Lencana & Bintang!
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
