import React, { useState } from 'react';
import {
  X,
  Phone,
  Copy,
  Check,
  Star,
  Printer,
  TrendingUp,
  Activity,
  Heart,
  BookOpen,
  Award,
  Sparkles,
  Share2,
} from 'lucide-react';
import { Student, SubjectInfo } from '../types/academic';
import { soundEffects } from '../utils/soundEffects';

interface StudentProfileDrawerProps {
  student: Student | null;
  subjects: SubjectInfo[];
  onClose: () => void;
  onOpenReportCard: (student: Student) => void;
  onUpdateTeacherNotes: (studentId: string, notes: string) => void;
  onQuickAwardStar: (student: Student) => void;
}

export const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({
  student,
  subjects,
  onClose,
  onOpenReportCard,
  onUpdateTeacherNotes,
  onQuickAwardStar,
}) => {
  if (!student) return null;

  const [activeTab, setActiveTab] = useState<'grades' | 'health' | 'notes'>('grades');
  const [editedNotes, setEditedNotes] = useState(student.teacherNotes);
  const [isCopied, setIsCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute student overall average score
  const studentScores = Object.values(student.grades).map((g) => g.finalScore);
  const averageScore = (
    studentScores.reduce((a, b) => a + b, 0) / studentScores.length
  ).toFixed(1);

  // Calculate BMI / IMT
  const heightM = student.physicalGrowth.heightCm / 100;
  const bmi = (student.physicalGrowth.weightKg / (heightM * heightM)).toFixed(1);

  // Formatted polite Indonesian WhatsApp draft for parents
  const whatsappDraft = `*LAPORAN PERKEMBANGAN SISWA - SD NEGERI 01 TILAMUTA*
Tahun Ajaran 2025/2026 · Kelas IV-B

Assalamu’alaikum Warahmatullahi Wabarakatuh,
Yth. Bapak/Ibu ${student.parentName} (Orang Tua Ananda *${student.name}*).

Kami sampaikan rekap capaian belajar dan pembiasaan ananda:
• Rata-rata Nilai Asesmen: *${averageScore}* (Predikat: Sangat Baik)
• Kehadiran: *${student.attendanceHistory.hadir} hari Hadir*, Sakit: ${student.attendanceHistory.sakit}, Izin: ${student.attendanceHistory.izin}
• Total Bintang Karakter P5: *${student.p5Stars} Bintang*
• Catatan Wali Kelas: "${student.teacherNotes}"

Terima kasih atas kerja sama dan pendampingan bimbingan di rumah.

Hormat kami,
*Khoyum Supardi, S.Pd.*
Wali Kelas IV-B SD Negeri 01 Tilamuta`;

  const handleCopyWhatsapp = () => {
    soundEffects.playPop();
    navigator.clipboard.writeText(whatsappDraft);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playStarChime();
    onUpdateTeacherNotes(student.id, editedNotes);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#1F1B2E]/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-full bg-white shadow-academic-lg flex flex-col justify-between overflow-hidden animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-6 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-[#E0F2FE]">
              Dossier & Rekam Perkembangan Siswa
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex items-start gap-4">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-18 h-18 rounded-2xl object-cover ring-4 ring-[#EDE9FE] shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#EC4899] text-white font-extrabold text-[10px]">
                {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold tracking-tight">
                {student.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#E0F2FE]">
                <span>Panggilan: <strong>{student.nickname}</strong></span>
                <span>·</span>
                <span>NISN: {student.nisn}</span>
                <span>·</span>
                <span>{student.birthPlace}, {student.birthDate}</span>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs">
                <span className="bg-white/20 px-2 py-0.5 rounded-lg font-bold">
                  Nilai Rata-rata: {averageScore}
                </span>
                <span className="bg-[#EC4899] text-white px-2 py-0.5 rounded-lg font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  {student.p5Stars} Bintang P5
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenReportCard(student)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-[#4C1D95] hover:bg-[#EDE9FE] transition-all shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rapor Kurikulum Merdeka</span>
            </button>

            <button
              onClick={handleCopyWhatsapp}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#22C55E] text-white hover:bg-[#16A34A] transition-all shadow-xs flex items-center gap-1.5"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Tersalin!' : 'Salin Laporan WhatsApp'}</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playStarChime();
                onQuickAwardStar(student);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#EC4899] text-white hover:bg-[#DB2777] transition-all flex items-center gap-1"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              <span>+ Bintang</span>
            </button>
          </div>
        </div>

        {/* Drawer Tabs */}
        <div className="px-6 border-b border-[#EDE9FE] flex items-center gap-2 pt-3 bg-[#FAF9FF]">
          <button
            onClick={() => {
              soundEffects.playPop();
              setActiveTab('grades');
            }}
            className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'grades'
                ? 'border-[#4C1D95] text-[#4C1D95]'
                : 'border-transparent text-[#6B6880] hover:text-[#1F1B2E]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Capaian Mata Pelajaran</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playPop();
              setActiveTab('health');
            }}
            className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'health'
                ? 'border-[#4C1D95] text-[#4C1D95]'
                : 'border-transparent text-[#6B6880] hover:text-[#1F1B2E]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Fisik & Presensi</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playPop();
              setActiveTab('notes');
            }}
            className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-[#4C1D95] text-[#4C1D95]'
                : 'border-transparent text-[#6B6880] hover:text-[#1F1B2E]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Catatan Guru & Rekomendasi</span>
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs text-[#1F1B2E]">
          {/* TAB 1: GRADES COMPARISON */}
          {activeTab === 'grades' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#6B6880]">
                <span>Mata Pelajaran & Ketercapaian (KKTP: 75)</span>
                <span>Nilai Akhir Siswa</span>
              </div>

              <div className="space-y-3">
                {subjects.map((sub) => {
                  const grade = student.grades[sub.key];
                  const percentage = Math.min(100, grade.finalScore);

                  return (
                    <div
                      key={sub.key}
                      className="p-3 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1F1B2E]">{sub.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EDE9FE] text-[#4C1D95]">
                            {grade.predicate}
                          </span>
                          <span className="font-extrabold text-sm text-[#4C1D95]">
                            {grade.finalScore}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar Track */}
                      <div className="w-full bg-[#EDE9FE] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#4C1D95] to-[#7DD3FC]"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>

                      <p className="text-[11px] text-[#6B6880] leading-snug line-clamp-2">
                        {grade.achievedDescription}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: HEALTH & ATTENDANCE */}
          {activeTab === 'health' && (
            <div className="space-y-5">
              {/* Presensi Breakdown */}
              <div className="p-4 bg-[#FAF9FF] rounded-2xl border border-[#EDE9FE] space-y-3">
                <h4 className="text-xs font-bold text-[#4C1D95] uppercase tracking-wider">
                  Rekapitulasi Presensi Semester Genap
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-3 bg-white rounded-xl border border-[#EDE9FE]">
                    <span className="block text-xl font-extrabold text-[#22C55E]">
                      {student.attendanceHistory.hadir}
                    </span>
                    <span className="text-[11px] text-[#6B6880]">Hadir</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#EDE9FE]">
                    <span className="block text-xl font-extrabold text-[#F59E0B]">
                      {student.attendanceHistory.sakit}
                    </span>
                    <span className="text-[11px] text-[#6B6880]">Sakit</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#EDE9FE]">
                    <span className="block text-xl font-extrabold text-[#0284C7]">
                      {student.attendanceHistory.izin}
                    </span>
                    <span className="text-[11px] text-[#6B6880]">Izin</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#EDE9FE]">
                    <span className="block text-xl font-extrabold text-[#EF4444]">
                      {student.attendanceHistory.alpa}
                    </span>
                    <span className="text-[11px] text-[#6B6880]">Alpa</span>
                  </div>
                </div>
              </div>

              {/* Antropometri & Pertumbuhan Fisik */}
              <div className="p-4 bg-[#FAF9FF] rounded-2xl border border-[#EDE9FE] space-y-3">
                <h4 className="text-xs font-bold text-[#4C1D95] uppercase tracking-wider">
                  Data Antropometri & Pemeriksaan Berkala
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-[#EDE9FE]">
                    <span className="text-[11px] text-[#6B6880] block">Tinggi Badan</span>
                    <span className="text-lg font-extrabold text-[#1F1B2E]">
                      {student.physicalGrowth.heightCm} cm
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#EDE9FE]">
                    <span className="text-[11px] text-[#6B6880] block">Berat Badan</span>
                    <span className="text-lg font-extrabold text-[#1F1B2E]">
                      {student.physicalGrowth.weightKg} kg
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#EDE9FE]">
                    <span className="text-[11px] text-[#6B6880] block">Status IMT (BMI)</span>
                    <span className="text-xs font-bold text-[#22C55E] block mt-1">
                      {bmi} (Gizi Baik)
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#EDE9FE]">
                    <span className="text-[11px] text-[#6B6880] block">Penglihatan</span>
                    <span className="text-xs font-semibold text-[#1F1B2E] block mt-1">
                      {student.physicalGrowth.vision}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#EDE9FE]">
                    <span className="text-[11px] text-[#6B6880] block">Pendengaran</span>
                    <span className="text-xs font-semibold text-[#1F1B2E] block mt-1">
                      {student.physicalGrowth.hearing}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#EDE9FE]">
                    <span className="text-[11px] text-[#6B6880] block">Kesehatan Gigi</span>
                    <span className="text-xs font-semibold text-[#1F1B2E] block mt-1">
                      {student.physicalGrowth.dental}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Wali Murid & Kontak */}
              <div className="p-4 bg-[#FAF9FF] rounded-2xl border border-[#EDE9FE] space-y-2">
                <h4 className="text-xs font-bold text-[#4C1D95] uppercase tracking-wider">
                  Informasi Orang Tua & Tempat Tinggal
                </h4>
                <div className="space-y-1 text-xs">
                  <p><strong>Nama Orang Tua:</strong> {student.parentName}</p>
                  <p><strong>Kontak / WA:</strong> {student.parentPhone}</p>
                  <p><strong>Alamat:</strong> {student.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEACHER NOTES & PORTFOLIO */}
          {activeTab === 'notes' && (
            <form onSubmit={handleSaveNotes} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1F1B2E]">
                  Catatan Naratif Wali Kelas (Dicetak pada Rapor Semester):
                </label>
                <textarea
                  rows={4}
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] focus:border-[#4C1D95] focus:outline-none bg-[#FAF9FF] text-xs leading-relaxed"
                  placeholder="Tuliskan catatan perkembangan dan saran motivasi untuk ananda..."
                ></textarea>
              </div>

              <div className="p-3 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE] space-y-1">
                <span className="font-bold text-[#4C1D95] block">
                  Proyek P5 Sulaman Karawo Gorontalo:
                </span>
                <p className="text-xs text-[#6B6880] leading-relaxed">
                  {student.p5ProjectNotes}
                </p>
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#15803D] font-bold text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22C55E]" />
                  <span>Catatan perkembangan berhasil diperbarui!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-[#4C1D95] text-white hover:bg-[#340075] transition-all"
              >
                Simpan Perubahan Catatan
              </button>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-[#FAF9FF] border-t border-[#EDE9FE] flex items-center justify-between">
          <span className="text-[11px] text-[#6B6880]">
            ID Siswa: {student.id} · Tilamuta, Boalemo
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#4C1D95] bg-[#EDE9FE] hover:bg-[#C4B5FD] transition-all"
          >
            Tutup Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
