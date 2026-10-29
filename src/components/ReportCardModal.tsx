import React from 'react';
import { X, Printer, Download, Share2, CheckCircle2, ChevronLeft, ChevronRight, School } from 'lucide-react';
import { Student, SubjectInfo } from '../types/academic';
import { SCHOOL_INFO } from '../data/mockData';
import { soundEffects } from '../utils/soundEffects';

interface ReportCardModalProps {
  student: Student | null;
  students: Student[];
  subjects: SubjectInfo[];
  onClose: () => void;
  onSelectStudent: (student: Student) => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  student,
  students,
  subjects,
  onClose,
  onSelectStudent,
}) => {
  if (!student) return null;

  const currentIndex = students.findIndex((s) => s.id === student.id);

  const handlePrev = () => {
    soundEffects.playPop();
    const prevIdx = (currentIndex - 1 + students.length) % students.length;
    onSelectStudent(students[prevIdx]);
  };

  const handleNext = () => {
    soundEffects.playPop();
    const nextIdx = (currentIndex + 1) % students.length;
    onSelectStudent(students[nextIdx]);
  };

  const handlePrint = () => {
    soundEffects.playStarChime();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1F1B2E]/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-academic-lg border border-[#C4B5FD]/40 my-auto overflow-hidden">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="no-print bg-[#4C1D95] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-[#EDE9FE] text-[#4C1D95] px-2.5 py-1 rounded-xl">
              Rapor Kurikulum Merdeka
            </span>
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={handlePrev}
                className="p-1 rounded-lg hover:bg-white/20 transition-all text-white/90"
                title="Siswa Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold px-2">
                {currentIndex + 1} / {students.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1 rounded-lg hover:bg-white/20 transition-all text-white/90"
                title="Siswa Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-[#4C1D95] hover:bg-[#EDE9FE] shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Dokumen</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Printable Report Card Document Body */}
        <div className="p-6 sm:p-10 max-h-[85vh] overflow-y-auto space-y-6 text-[#1F1B2E]">
          {/* Official Letterhead (Kop Satuan Pendidikan) */}
          <div className="border-b-2 border-double border-[#1F1B2E] pb-4 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#4C1D95] flex items-center justify-center text-white font-extrabold text-2xl shadow-sm">
                <School className="w-9 h-9 text-[#7DD3FC]" />
              </div>
              <div className="text-center">
                <h2 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#1F1B2E]">
                  Pemerintah Kabupaten Boalemo
                </h2>
                <h3 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#1F1B2E]">
                  Dinas Pendidikan Kepemudaan dan Olahraga
                </h3>
                <h1 className="text-base sm:text-lg font-extrabold uppercase text-[#4C1D95] tracking-tight">
                  UPTD Satuan Pendidikan Formal SD Negeri 01 Tilamuta
                </h1>
                <p className="text-[11px] text-[#6B6880] mt-0.5">
                  {SCHOOL_INFO.address} · NPSN: {SCHOOL_INFO.npsn}
                </p>
              </div>
            </div>
          </div>

          {/* Title of Document */}
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold uppercase tracking-wide text-[#1F1B2E]">
              Laporan Hasil Belajar Peserta Didik
            </h2>
            <p className="text-xs text-[#6B6880] font-medium">
              (Rapor Kurikulum Merdeka - Fase B)
            </p>
          </div>

          {/* Student Dossier Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs bg-[#FAF9FF] p-4 rounded-2xl border border-[#EDE9FE]">
            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-36 text-[#6B6880]">Nama Peserta Didik</span>
                <span className="font-bold text-[#1F1B2E]">: {student.name}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-[#6B6880]">Nomor Induk / NISN</span>
                <span className="font-semibold text-[#1F1B2E]">: {student.nipd} / {student.nisn}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-[#6B6880]">Tempat, Tgl Lahir</span>
                <span className="text-[#1F1B2E]">: {student.birthPlace}, {student.birthDate}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-[#6B6880]">Nama Orang Tua / Wali</span>
                <span className="text-[#1F1B2E]">: {student.parentName}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-32 text-[#6B6880]">Kelas / Fase</span>
                <span className="font-bold text-[#4C1D95]">: {SCHOOL_INFO.className} / {SCHOOL_INFO.phase}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-[#6B6880]">Semester</span>
                <span className="font-semibold text-[#1F1B2E]">: {SCHOOL_INFO.semester}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-[#6B6880]">Tahun Ajaran</span>
                <span className="text-[#1F1B2E]">: {SCHOOL_INFO.academicYear}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-[#6B6880]">Wali Kelas</span>
                <span className="text-[#1F1B2E]">: {SCHOOL_INFO.homeroomTeacher}</span>
              </div>
            </div>
          </div>

          {/* Competency Achievement Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4C1D95]">
              A. Capaian Kompetensi Mata Pelajaran
            </h3>

            <div className="border border-[#EDE9FE] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#EDE9FE] text-[#1F1B2E]">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-[#C4B5FD] font-bold text-center w-10">
                      No
                    </th>
                    <th className="py-2.5 px-3 border-r border-[#C4B5FD] font-bold w-48">
                      Mata Pelajaran
                    </th>
                    <th className="py-2.5 px-3 border-r border-[#C4B5FD] font-bold text-center w-20">
                      Nilai Akhir
                    </th>
                    <th className="py-2.5 px-3 font-bold">
                      Capaian Kompetensi & Deskripsi Pembelajaran
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE9FE]">
                  {subjects.map((sub, index) => {
                    const grade = student.grades[sub.key];
                    return (
                      <tr key={sub.key} className="align-top">
                        <td className="py-2.5 px-3 border-r border-[#EDE9FE] text-center font-medium text-[#6B6880]">
                          {index + 1}
                        </td>
                        <td className="py-2.5 px-3 border-r border-[#EDE9FE] font-bold text-[#1F1B2E]">
                          {sub.name}
                          {sub.category === 'Muatan Lokal' && (
                            <span className="block text-[10px] font-normal text-[#6B6880]">
                              (Muatan Lokal Gorontalo)
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border-r border-[#EDE9FE] text-center font-extrabold text-sm text-[#4C1D95]">
                          {grade.finalScore}
                        </td>
                        <td className="py-2.5 px-3 space-y-1.5 leading-relaxed text-[11px]">
                          <div>
                            <span className="font-semibold text-[#15803D]">
                              Capaian Tertinggi:
                            </span>{' '}
                            <span className="text-[#1F1B2E]">{grade.achievedDescription}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#0369A1]">
                              Perlu Ditingkatkan:
                            </span>{' '}
                            <span className="text-[#6B6880]">{grade.growthDescription}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B & C: Ekstrakurikuler & Kehadiran */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ekstrakurikuler */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4C1D95]">
                B. Kegiatan Ekstrakurikuler
              </h3>
              <div className="border border-[#EDE9FE] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#FAF9FF] text-[#1F1B2E] border-b border-[#EDE9FE]">
                    <tr>
                      <th className="py-2 px-3 font-semibold w-10 text-center">No</th>
                      <th className="py-2 px-3 font-semibold">Nama Kegiatan</th>
                      <th className="py-2 px-3 font-semibold text-center w-24">Predikat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE9FE]">
                    {student.extracurricular.map((ekskul, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 text-center text-[#6B6880]">{idx + 1}</td>
                        <td className="py-2 px-3 font-medium text-[#1F1B2E]">{ekskul}</td>
                        <td className="py-2 px-3 text-center font-bold text-[#15803D]">
                          Sangat Baik
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rekapitulasi Presensi */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4C1D95]">
                C. Ketidakhadiran Semester Ini
              </h3>
              <div className="border border-[#EDE9FE] rounded-xl p-3 bg-[#FAF9FF] space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#EDE9FE]">
                  <span className="text-[#6B6880]">1. Sakit (S)</span>
                  <span className="font-bold text-[#1F1B2E]">{student.attendanceHistory.sakit} hari</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EDE9FE]">
                  <span className="text-[#6B6880]">2. Izin (I)</span>
                  <span className="font-bold text-[#1F1B2E]">{student.attendanceHistory.izin} hari</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#6B6880]">3. Tanpa Keterangan (Alpa)</span>
                  <span className="font-bold text-[#22C55E]">
                    {student.attendanceHistory.alpa === 0 ? 'Nihil (0 hari)' : `${student.attendanceHistory.alpa} hari`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan Karakter & Catatan Guru */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4C1D95]">
              D. Catatan Wali Kelas & Karakter Profil Pelajar Pancasila
            </h3>
            <div className="p-3.5 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE] text-xs leading-relaxed space-y-2">
              <p>
                <strong>Catatan Wali Kelas:</strong> Ananda {student.name} {student.teacherNotes}
              </p>
              <p>
                <strong>Proyek P5 Sulaman Karawo:</strong> {student.p5ProjectNotes}
              </p>
            </div>
          </div>

          {/* Legal Signatures Block */}
          <div className="pt-6 border-t border-[#EDE9FE] grid grid-cols-3 text-center text-xs gap-4">
            <div>
              <p className="text-[#6B6880]">Mengetahui,</p>
              <p className="font-semibold text-[#1F1B2E] mt-0.5">Orang Tua / Wali</p>
              <div className="h-16"></div>
              <p className="font-bold text-[#1F1B2E] underline underline-offset-4">
                ( {student.parentName} )
              </p>
            </div>

            <div>
              <p className="text-[#6B6880]">Tilamuta, 20 Juni 2026</p>
              <p className="font-semibold text-[#1F1B2E] mt-0.5">Guru Kelas IV-B</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] text-[#4C1D95] font-semibold italic border border-dashed border-[#C4B5FD] px-2 py-1 rounded">
                  [Tanda Tangan Digital]
                </span>
              </div>
              <p className="font-bold text-[#1F1B2E] underline underline-offset-4">
                {SCHOOL_INFO.homeroomTeacher}
              </p>
              <p className="text-[10px] text-[#6B6880]">NIP. {SCHOOL_INFO.teacherNip}</p>
            </div>

            <div>
              <p className="text-[#6B6880]">Mengetahui,</p>
              <p className="font-semibold text-[#1F1B2E] mt-0.5">Kepala Sekolah</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] text-[#4C1D95] font-semibold italic border border-dashed border-[#C4B5FD] px-2 py-1 rounded">
                  [Tanda Tangan & Cap Resmi]
                </span>
              </div>
              <p className="font-bold text-[#1F1B2E] underline underline-offset-4">
                {SCHOOL_INFO.headmaster}
              </p>
              <p className="text-[10px] text-[#6B6880]">NIP. {SCHOOL_INFO.headmasterNip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
