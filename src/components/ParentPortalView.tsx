import React, { useState } from 'react';
import {
  HeartHandshake,
  CheckCircle,
  Calendar,
  Send,
  FileText,
  Star,
  Sparkles,
  Phone,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Student } from '../types/academic';
import { soundEffects } from '../utils/soundEffects';

interface ParentPortalViewProps {
  students: Student[];
  onOpenReportCard: (student: Student) => void;
  onSubmitParentPermit: (studentId: string, type: 'sakit' | 'izin', note: string) => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  students,
  onOpenReportCard,
  onSubmitParentPermit,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [permitType, setPermitType] = useState<'sakit' | 'izin'>('sakit');
  const [permitDate, setPermitDate] = useState('2026-10-29');
  const [permitReason, setPermitReason] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const activeStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  const handleSubmitPermit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permitReason.trim()) return;

    soundEffects.playStarChime();
    onSubmitParentPermit(selectedStudentId, permitType, permitReason);
    setSubmittedMessage(
      `Pemberitahuan ${permitType === 'sakit' ? 'Sakit' : 'Izin'} untuk Ananda ${activeStudent.nickname} berhasil dikirim ke Wali Kelas (Pak Khoyum Supardi)!`
    );
    setPermitReason('');
    setTimeout(() => setSubmittedMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Parent Portal Header */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#6B21A8] to-[#9333EA] text-white p-6 rounded-2xl shadow-academic-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-[#E0F2FE]">
              <HeartHandshake className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>Portal Komunikasi Wali Murid</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ruang Informasi & Tumbuh Kembang Ananda
            </h2>
            <p className="text-xs sm:text-sm text-[#E0F2FE] max-w-xl">
              Memudahkan orang tua memantau capaian belajar, kebiasaan karakter positif, serta agenda harian di SD Negeri 01 Tilamuta.
            </p>
          </div>

          {/* Child Selector */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 space-y-1">
            <label className="text-[11px] font-bold text-white block">
              Pilih Profil Siswa:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                soundEffects.playPop();
                setSelectedStudentId(e.target.value);
              }}
              className="w-full sm:w-60 bg-white text-[#1F1B2E] text-xs font-bold rounded-xl py-2 px-3 focus:outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  Ananda {s.name} ({s.nickname})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Student Card for Parents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Highlights */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-[#C4B5FD]/30 shadow-academic-sm space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeStudent.avatar}
                  alt={activeStudent.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-3 ring-[#EDE9FE] shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#1F1B2E]">
                    {activeStudent.name}
                  </h3>
                  <p className="text-xs text-[#6B6880]">
                    Kelas IV-B · Wali Kelas: <strong>Khoyum Supardi, S.Pd.</strong>
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="font-semibold text-[#4C1D95]">
                      NISN: {activeStudent.nisn}
                    </span>
                    <span>·</span>
                    <span className="text-[#22C55E] font-bold">
                      Presensi: {activeStudent.todayAttendance.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenReportCard(activeStudent)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#4C1D95] text-white hover:bg-[#340075] shadow-xs transition-all"
              >
                <FileText className="w-4 h-4 text-[#7DD3FC]" />
                <span>Lihat Rapor</span>
              </button>
            </div>

            {/* Quick Metrics for Parents */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE]">
                <span className="block text-2xl font-extrabold text-[#4C1D95]">
                  {activeStudent.attendanceHistory.hadir}
                </span>
                <span className="text-[11px] text-[#6B6880]">Hari Masuk Sekolah</span>
              </div>

              <div className="p-3 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE]">
                <span className="block text-2xl font-extrabold text-[#EC4899]">
                  {activeStudent.p5Stars}
                </span>
                <span className="text-[11px] text-[#6B6880]">Bintang Karakter P5</span>
              </div>

              <div className="p-3 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE]">
                <span className="block text-2xl font-extrabold text-[#22C55E]">
                  {activeStudent.physicalGrowth.heightCm} cm
                </span>
                <span className="text-[11px] text-[#6B6880]">Tinggi Badan Terkini</span>
              </div>
            </div>

            {/* Catatan Hangat dari Guru Kelas */}
            <div className="p-4 bg-[#EDE9FE]/50 rounded-2xl border border-[#C4B5FD]/40 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4C1D95]">
                <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                <span>Pesan & Catatan Perkembangan dari Wali Kelas:</span>
              </div>
              <p className="text-xs text-[#1F1B2E] leading-relaxed italic">
                "{activeStudent.teacherNotes}"
              </p>
            </div>

            {/* Lencana Kebanggaan Terkini */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#1F1B2E] uppercase tracking-wider">
                Lencana Karakter yang Diraih Ananda:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeStudent.badges.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-[#FAF9FF] border border-[#EDE9FE] flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] flex items-center justify-center text-[#EC4899] shrink-0">
                      <Star className="w-5 h-5 fill-[#EC4899]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#1F1B2E]">{b.title}</h5>
                      <p className="text-[10px] text-[#6B6880]">{b.dimension}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Permit Submission & Schedule */}
        <div className="lg:col-span-5 space-y-5">
          {/* Form Izin / Sakit Orang Tua */}
          <div className="bg-white rounded-2xl p-6 border border-[#C4B5FD]/30 shadow-academic-sm space-y-4">
            <div className="border-b border-[#EDE9FE] pb-3">
              <h3 className="text-sm font-bold text-[#1F1B2E]">
                Formulir Pemberitahuan Izin / Sakit
              </h3>
              <p className="text-xs text-[#6B6880]">
                Sampaikan keterangan ketidakhadiran ananda langsung ke guru kelas
              </p>
            </div>

            {submittedMessage && (
              <div className="p-3 bg-[#22C55E]/15 border border-[#22C55E]/30 rounded-xl text-xs font-bold text-[#15803D] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-[#22C55E]" />
                <span>{submittedMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPermit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#1F1B2E] mb-1">
                  Jenis Keterangan:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPermitType('sakit')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      permitType === 'sakit'
                        ? 'bg-[#F59E0B] text-white shadow-xs'
                        : 'bg-[#FAF9FF] text-[#6B6880] border border-[#EDE9FE]'
                    }`}
                  >
                    Sakit (S)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermitType('izin')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      permitType === 'izin'
                        ? 'bg-[#0284C7] text-white shadow-xs'
                        : 'bg-[#FAF9FF] text-[#6B6880] border border-[#EDE9FE]'
                    }`}
                  >
                    Izin Keluarga (I)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1F1B2E] mb-1">
                  Tanggal Tidak Masuk:
                </label>
                <input
                  type="date"
                  value={permitDate}
                  onChange={(e) => setPermitDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF9FF] focus:border-[#4C1D95] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#1F1B2E] mb-1">
                  Alasan / Keterangan untuk Guru:
                </label>
                <textarea
                  rows={3}
                  value={permitReason}
                  onChange={(e) => setPermitReason(e.target.value)}
                  placeholder="Contoh: Ananda mengalami demam sejak tadi malam dan sedang istirahat di rumah..."
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF9FF] focus:border-[#4C1D95] focus:outline-none leading-relaxed"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-[#4C1D95] text-white hover:bg-[#340075] transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Surat Keterangan ke Guru</span>
              </button>
            </form>
          </div>

          {/* Jadwal Pelajaran Kelas IV-B */}
          <div className="bg-white rounded-2xl p-5 border border-[#C4B5FD]/30 shadow-academic-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4C1D95]">
              <Calendar className="w-4 h-4" />
              <span>Jadwal Pelajaran & Perlengkapan Kelas IV-B</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE] flex justify-between">
                <div>
                  <strong className="text-[#1F1B2E]">Senin:</strong> Upacara Bendera, Pendidikan Pancasila, Bahasa Indonesia
                </div>
                <span className="text-[#6B6880] text-[10px]">Seragam Merah Putih</span>
              </div>

              <div className="p-2.5 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE] flex justify-between">
                <div>
                  <strong className="text-[#1F1B2E]">Selasa:</strong> Matematika, IPAS (Eksperimen Mangrove)
                </div>
                <span className="text-[#6B6880] text-[10px]">Buku Latihan</span>
              </div>

              <div className="p-2.5 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE] flex justify-between">
                <div>
                  <strong className="text-[#1F1B2E]">Rabu:</strong> Proyek P5 Sulaman Karawo, Bahasa Inggris
                </div>
                <span className="text-[#6B6880] text-[10px]">Benang & Pola</span>
              </div>

              <div className="p-2.5 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE] flex justify-between">
                <div>
                  <strong className="text-[#1F1B2E]">Kamis:</strong> PJOK Olahraga Bola Kecil, Mulok Gorontalo
                </div>
                <span className="text-[#6B6880] text-[10px]">Kaos Olahraga</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
