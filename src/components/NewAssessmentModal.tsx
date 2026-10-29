import React, { useState } from 'react';
import { X, Sparkles, Check, BookOpen, Layers } from 'lucide-react';
import { Student, SubjectInfo, SubjectKey, StudentGrade } from '../types/academic';
import { soundEffects } from '../utils/soundEffects';

interface NewAssessmentModalProps {
  students: Student[];
  subjects: SubjectInfo[];
  onClose: () => void;
  onSaveAssessmentBatch: (
    subjectKey: SubjectKey,
    assessmentField: 'tp1' | 'tp2' | 'formatif' | 'sumatifMateri' | 'sumatifAkhir',
    studentScores: Record<string, number>
  ) => void;
}

export const NewAssessmentModal: React.FC<NewAssessmentModalProps> = ({
  students,
  subjects,
  onClose,
  onSaveAssessmentBatch,
}) => {
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<SubjectKey>('matematika');
  const [assessmentField, setAssessmentField] = useState<
    'tp1' | 'tp2' | 'formatif' | 'sumatifMateri' | 'sumatifAkhir'
  >('sumatifMateri');
  const [topicName, setTopicName] = useState('Asesmen Sumatif Lingkup Materi - Pecahan Senilai');

  // Local map of scores for all students
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    students.forEach((s) => {
      initial[s.id] = s.grades[selectedSubjectKey][assessmentField] || 85;
    });
    return initial;
  });

  const handleApplyPreset = (value: number) => {
    soundEffects.playPop();
    const updated: Record<string, number> = {};
    students.forEach((s) => {
      updated[s.id] = value;
    });
    setScores(updated);
  };

  const handleScoreChange = (studentId: string, val: string) => {
    let num = parseInt(val, 10);
    if (isNaN(num)) num = 0;
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    setScores((prev) => ({ ...prev, [studentId]: num }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playStarChime();
    onSaveAssessmentBatch(selectedSubjectKey, assessmentField, scores);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1B2E]/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-academic-lg border border-[#C4B5FD]/40 space-y-5 animate-scaleUp max-h-[90vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#4C1D95]">
              <Sparkles className="w-5 h-5 text-[#4C1D95]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F1B2E]">
                Input Asesmen Kelas IV-B
              </h3>
              <p className="text-xs text-[#6B6880]">
                Rekam nilai formatif atau sumatif Kurikulum Merdeka secara serentak
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#6B6880] hover:text-[#1F1B2E] hover:bg-[#FAF9FF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
          {/* Select Subject & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1F1B2E] mb-1">
                Mata Pelajaran:
              </label>
              <select
                value={selectedSubjectKey}
                onChange={(e) => {
                  const newKey = e.target.value as SubjectKey;
                  setSelectedSubjectKey(newKey);
                  // refresh local scores
                  const updated: Record<string, number> = {};
                  students.forEach((s) => {
                    updated[s.id] = s.grades[newKey][assessmentField] || 85;
                  });
                  setScores(updated);
                }}
                className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF9FF] focus:border-[#4C1D95] font-semibold"
              >
                {subjects.map((sub) => (
                  <option key={sub.key} value={sub.key}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1F1B2E] mb-1">
                Kategori Asesmen:
              </label>
              <select
                value={assessmentField}
                onChange={(e) => {
                  const newField = e.target.value as typeof assessmentField;
                  setAssessmentField(newField);
                  const updated: Record<string, number> = {};
                  students.forEach((s) => {
                    updated[s.id] = s.grades[selectedSubjectKey][newField] || 85;
                  });
                  setScores(updated);
                }}
                className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF9FF] focus:border-[#4C1D95] font-semibold"
              >
                <option value="tp1">Tujuan Pembelajaran 1 (TP 1)</option>
                <option value="tp2">Tujuan Pembelajaran 2 (TP 2)</option>
                <option value="formatif">Asesmen Formatif Harian</option>
                <option value="sumatifMateri">Sumatif Lingkup Materi</option>
                <option value="sumatifAkhir">Sumatif Akhir Semester (SAS)</option>
              </select>
            </div>
          </div>

          {/* Topic Name */}
          <div>
            <label className="block font-bold text-[#1F1B2E] mb-1">
              Topik / Keterangan Lingkup Materi:
            </label>
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF9FF] focus:border-[#4C1D95] font-medium"
              placeholder="Misal: Menyelesaikan soal cerita pecahan senilai..."
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center justify-between gap-2 p-2.5 bg-[#FAF9FF] rounded-xl border border-[#EDE9FE]">
            <span className="font-bold text-[#6B6880]">Isi Cepat Semua Siswa:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyPreset(75)}
                className="px-2.5 py-1 rounded-lg font-bold bg-[#EDE9FE] text-[#4C1D95] hover:bg-[#C4B5FD] transition-all"
              >
                KKTP 75
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(85)}
                className="px-2.5 py-1 rounded-lg font-bold bg-[#EDE9FE] text-[#4C1D95] hover:bg-[#C4B5FD] transition-all"
              >
                Rata-rata 85
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(90)}
                className="px-2.5 py-1 rounded-lg font-bold bg-[#EDE9FE] text-[#4C1D95] hover:bg-[#C4B5FD] transition-all"
              >
                Unggul 90
              </button>
            </div>
          </div>

          {/* Student Scores Roster */}
          <div className="border border-[#EDE9FE] rounded-2xl overflow-hidden divide-y divide-[#EDE9FE] max-h-60 overflow-y-auto">
            {students.map((student, idx) => (
              <div
                key={student.id}
                className="p-2.5 px-3 flex items-center justify-between hover:bg-[#FAF9FF] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[#6B6880] w-5 text-center font-bold">
                    {idx + 1}.
                  </span>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="font-bold text-[#1F1B2E]">{student.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#6B6880]">Nilai:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scores[student.id] ?? 85}
                    onChange={(e) => handleScoreChange(student.id, e.target.value)}
                    className="w-16 text-center py-1 font-bold text-xs rounded-lg border border-[#EDE9FE] focus:border-[#4C1D95] bg-white text-[#4C1D95]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#EDE9FE] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold text-[#6B6880] hover:bg-[#FAF9FF]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold bg-[#4C1D95] text-white hover:bg-[#340075] shadow-md transition-all active:scale-98"
            >
              Simpan Semua Nilai Asesmen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
