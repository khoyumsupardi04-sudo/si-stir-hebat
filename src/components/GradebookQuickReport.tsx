import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Sparkles,
  BookOpen,
  Info,
  CheckCircle,
  HelpCircle,
  Edit3,
  Search,
} from 'lucide-react';
import { Student, SubjectInfo, SubjectKey, StudentGrade } from '../types/academic';
import { soundEffects } from '../utils/soundEffects';

interface GradebookQuickReportProps {
  students: Student[];
  subjects: SubjectInfo[];
  onUpdateScore: (
    studentId: string,
    subjectKey: SubjectKey,
    field: keyof Omit<StudentGrade, 'predicate' | 'achievedDescription' | 'growthDescription'>,
    value: number
  ) => void;
  onOpenReportCard: (student: Student) => void;
  onOpenNewAssessment: () => void;
}

export const GradebookQuickReport: React.FC<GradebookQuickReportProps> = ({
  students,
  subjects,
  onUpdateScore,
  onOpenReportCard,
  onOpenNewAssessment,
}) => {
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<SubjectKey>('matematika');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingNotice, setIsEditingNotice] = useState<string | null>(null);

  const currentSubject =
    subjects.find((s) => s.key === selectedSubjectKey) || subjects[0];

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm)
  );

  const handleScoreChange = (
    studentId: string,
    field: 'tp1' | 'tp2' | 'formatif' | 'sumatifMateri' | 'sumatifAkhir',
    valStr: string
  ) => {
    let num = parseInt(valStr, 10);
    if (isNaN(num)) num = 0;
    if (num > 100) num = 100;
    if (num < 0) num = 0;

    onUpdateScore(studentId, selectedSubjectKey, field, num);
    setIsEditingNotice('Nilai berhasil diperbarui dan tersimpan');
    setTimeout(() => setIsEditingNotice(null), 2500);
  };

  const handleQuickBump = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    const currentGrade = student.grades[selectedSubjectKey];
    const newSumatif = Math.min(100, currentGrade.sumatifMateri + 2);
    soundEffects.playStarChime();
    onUpdateScore(studentId, selectedSubjectKey, 'sumatifMateri', newSumatif);
  };

  const exportCSV = () => {
    soundEffects.playPop();
    const headers = [
      'NISN',
      'Nama Siswa',
      'Mata Pelajaran',
      'TP 1',
      'TP 2',
      'Formatif',
      'Sumatif Materi',
      'Sumatif Akhir',
      'Nilai Akhir',
      'Predikat',
      'Deskripsi Capaian',
    ];

    const rows = students.map((s) => {
      const g = s.grades[selectedSubjectKey];
      return [
        `"${s.nisn}"`,
        `"${s.name}"`,
        `"${currentSubject.name}"`,
        g.tp1,
        g.tp2,
        g.formatif,
        g.sumatifMateri,
        g.sumatifAkhir,
        g.finalScore,
        `"${g.predicate}"`,
        `"${g.achievedDescription}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_${currentSubject.name}_Kelas_IVB.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Subject Selector Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-[#C4B5FD]/30 shadow-academic-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#EDE9FE]">
          <div>
            <h2 className="text-base font-bold text-[#1F1B2E]">
              Buku Nilai & Asesmen Kurikulum Merdeka
            </h2>
            <p className="text-xs text-[#6B6880]">
              Pilih mata pelajaran untuk melihat ketercapaian Tujuan Pembelajaran (TP) dan mengedit nilai formatif/sumatif secara langsung.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#C4B5FD] text-[#4C1D95] hover:bg-[#EDE9FE] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>

            <button
              onClick={onOpenNewAssessment}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#4C1D95] text-white hover:bg-[#340075] transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7DD3FC]" />
              <span>+ Input Asesmen</span>
            </button>
          </div>
        </div>

        {/* Horizontal Subject Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3">
          {subjects.map((sub) => {
            const isSelected = sub.key === selectedSubjectKey;
            return (
              <button
                key={sub.key}
                onClick={() => {
                  soundEffects.playPop();
                  setSelectedSubjectKey(sub.key);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#4C1D95] text-white shadow-sm'
                    : 'bg-[#FAF9FF] text-[#6B6880] hover:text-[#4C1D95] hover:bg-[#EDE9FE]/50 border border-[#EDE9FE]'
                }`}
              >
                <span>{sub.name}</span>
                {sub.category === 'Muatan Lokal' && (
                  <span className="ml-1.5 text-[9px] px-1 py-0.2 rounded bg-[#EC4899] text-white">
                    Mulok
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Subject Information Banner */}
      <div className="bg-[#FAF9FF] p-4 rounded-2xl border border-[#EDE9FE] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#4C1D95]">{currentSubject.name}</span>
            <span className="px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#4C1D95] text-[10px] font-bold">
              {currentSubject.code}
            </span>
            <span className="text-[#6B6880]">·</span>
            <span className="text-[#6B6880]">
              Pengampu: <strong>{currentSubject.teacher}</strong>
            </span>
          </div>
          <p className="text-[#6B6880]">
            <strong>TP 1:</strong> {currentSubject.tpDescriptions.tp1} <br />
            <strong>TP 2:</strong> {currentSubject.tpDescriptions.tp2}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-white p-2.5 rounded-xl border border-[#EDE9FE]">
          <span className="text-[#6B6880]">Kriteria Ketercapaian (KKTP):</span>
          <span className="font-extrabold text-[#4C1D95] text-sm">{currentSubject.kkm}</span>
        </div>
      </div>

      {/* Feedback Toast if edited */}
      {isEditingNotice && (
        <div className="p-2.5 bg-[#22C55E]/15 border border-[#22C55E]/30 rounded-xl text-xs font-semibold text-[#15803D] flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-[#22C55E]" />
          <span>{isEditingNotice}</span>
        </div>
      )}

      {/* Gradebook Table */}
      <div className="bg-white rounded-2xl border border-[#C4B5FD]/30 shadow-academic-sm overflow-hidden">
        {/* Table Filter & Search Header */}
        <div className="p-4 border-b border-[#EDE9FE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6880]" />
            <input
              type="text"
              placeholder="Cari siswa dalam buku nilai..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#EDE9FE] focus:outline-none focus:border-[#4C1D95] bg-[#FAF9FF]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6B6880]">
            <Edit3 className="w-3.5 h-3.5 text-[#4C1D95]" />
            <span>Klik pada angka untuk mengubah nilai secara langsung</span>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EBFF]/60 text-[#1F1B2E] border-b border-[#EDE9FE]">
              <tr>
                <th className="py-3 px-4 font-bold text-center w-12">No</th>
                <th className="py-3 px-4 font-bold min-w-[180px]">Nama Peserta Didik</th>
                <th className="py-3 px-3 font-bold text-center w-16" title="Tujuan Pembelajaran 1">
                  TP 1
                </th>
                <th className="py-3 px-3 font-bold text-center w-16" title="Tujuan Pembelajaran 2">
                  TP 2
                </th>
                <th className="py-3 px-3 font-bold text-center w-16">Formatif</th>
                <th className="py-3 px-3 font-bold text-center w-20">Sumatif Materi</th>
                <th className="py-3 px-3 font-bold text-center w-20">Sumatif Akhir</th>
                <th className="py-3 px-3 font-bold text-center w-16 text-[#4C1D95]">
                  Nilai Akhir
                </th>
                <th className="py-3 px-3 font-bold text-center min-w-[110px]">Predikat</th>
                <th className="py-3 px-4 font-bold min-w-[240px]">Deskripsi Capaian Kompetensi</th>
                <th className="py-3 px-4 font-bold text-right min-w-[110px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE9FE]">
              {filteredStudents.map((student, idx) => {
                const grade = student.grades[selectedSubjectKey];
                const isPassing = grade.finalScore >= currentSubject.kkm;

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-[#FAF9FF] transition-colors group"
                  >
                    <td className="py-3 px-4 text-center text-[#6B6880] font-medium">
                      {idx + 1}
                    </td>

                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#EDE9FE]"
                        />
                        <div>
                          <span className="font-bold text-[#1F1B2E] block">
                            {student.name}
                          </span>
                          <span className="text-[10px] text-[#6B6880]">
                            NISN: {student.nisn}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* TP 1 Editable */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grade.tp1}
                        onChange={(e) =>
                          handleScoreChange(student.id, 'tp1', e.target.value)
                        }
                        className="w-13 text-center py-1 text-xs font-semibold rounded-lg border border-[#EDE9FE] focus:border-[#4C1D95] focus:outline-none bg-white hover:bg-[#FAF9FF]"
                      />
                    </td>

                    {/* TP 2 Editable */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grade.tp2}
                        onChange={(e) =>
                          handleScoreChange(student.id, 'tp2', e.target.value)
                        }
                        className="w-13 text-center py-1 text-xs font-semibold rounded-lg border border-[#EDE9FE] focus:border-[#4C1D95] focus:outline-none bg-white hover:bg-[#FAF9FF]"
                      />
                    </td>

                    {/* Formatif Editable */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grade.formatif}
                        onChange={(e) =>
                          handleScoreChange(student.id, 'formatif', e.target.value)
                        }
                        className="w-13 text-center py-1 text-xs font-semibold rounded-lg border border-[#EDE9FE] focus:border-[#4C1D95] focus:outline-none bg-white hover:bg-[#FAF9FF]"
                      />
                    </td>

                    {/* Sumatif Materi Editable */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grade.sumatifMateri}
                        onChange={(e) =>
                          handleScoreChange(student.id, 'sumatifMateri', e.target.value)
                        }
                        className="w-13 text-center py-1 text-xs font-semibold rounded-lg border border-[#EDE9FE] focus:border-[#4C1D95] focus:outline-none bg-white hover:bg-[#FAF9FF]"
                      />
                    </td>

                    {/* Sumatif Akhir Editable */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grade.sumatifAkhir}
                        onChange={(e) =>
                          handleScoreChange(student.id, 'sumatifAkhir', e.target.value)
                        }
                        className="w-13 text-center py-1 text-xs font-semibold rounded-lg border border-[#EDE9FE] focus:border-[#4C1D95] focus:outline-none bg-white hover:bg-[#FAF9FF]"
                      />
                    </td>

                    {/* Final Score (Calculated) */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-sm font-extrabold ${
                          isPassing ? 'text-[#4C1D95]' : 'text-[#EF4444]'
                        }`}
                      >
                        {grade.finalScore}
                      </span>
                    </td>

                    {/* Predicate */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          grade.predicate === 'Sangat Baik'
                            ? 'bg-[#22C55E]/15 text-[#15803D]'
                            : grade.predicate === 'Baik'
                            ? 'bg-[#E0F2FE] text-[#0369A1]'
                            : grade.predicate === 'Cukup'
                            ? 'bg-[#FEF3C7] text-[#B45309]'
                            : 'bg-[#FEE2E2] text-[#B91C1C]'
                        }`}
                      >
                        {grade.predicate}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-xs text-[#6B6880] leading-relaxed">
                      <p className="line-clamp-2" title={grade.achievedDescription}>
                        {grade.achievedDescription}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleQuickBump(student.id)}
                          title="+2 Poin Apresiasi"
                          className="p-1 rounded-lg text-xs font-bold bg-[#FCE7F3] text-[#BE185D] hover:bg-[#F9A8D4] transition-all"
                        >
                          +2
                        </button>
                        <button
                          onClick={() => onOpenReportCard(student)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#4C1D95] text-white hover:bg-[#340075] transition-all"
                        >
                          Rapor
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
