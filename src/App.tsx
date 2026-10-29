/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderNavbar } from './components/HeaderNavbar';
import { ClassDashboard } from './components/ClassDashboard';
import { GradebookQuickReport } from './components/GradebookQuickReport';
import { AchievementBoard } from './components/AchievementBoard';
import { StudentProfileDrawer } from './components/StudentProfileDrawer';
import { ReportCardModal } from './components/ReportCardModal';
import { ParentPortalView } from './components/ParentPortalView';
import { NewAssessmentModal } from './components/NewAssessmentModal';
import { AnnouncementsView } from './components/AnnouncementsView';

import {
  Student,
  SubjectInfo,
  SubjectKey,
  AttendanceStatus,
  Badge,
  Announcement,
  StudentGrade,
} from './types/academic';
import { INITIAL_STUDENTS, SUBJECTS, INITIAL_ANNOUNCEMENTS, SCHOOL_INFO } from './data/mockData';
import { soundEffects } from './utils/soundEffects';
import { fireStarCelebration } from './utils/confetti';
import { School, Heart, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Local storage persisted state
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('vap_students_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_STUDENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('vap_announcements_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [subjects] = useState<SubjectInfo[]>(SUBJECTS);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modal & Drawer State
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('vap_students_v1', JSON.stringify(students));
    } catch {
      // ignore
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('vap_announcements_v1', JSON.stringify(announcements));
    } catch {
      // ignore
    }
  }, [announcements]);

  // Attendance update
  const handleUpdateAttendance = (studentId: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const prevStatus = s.todayAttendance;
        const history = { ...s.attendanceHistory };

        // Adjust counts if changing from previous
        if (prevStatus !== status) {
          history[prevStatus] = Math.max(0, history[prevStatus] - 1);
          history[status] = history[status] + 1;
        }

        return {
          ...s,
          todayAttendance: status,
          attendanceHistory: history,
        };
      })
    );
  };

  const handleMarkAllPresent = () => {
    soundEffects.playStarChime();
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        todayAttendance: 'hadir',
      }))
    );
    showToast('Seluruh siswa Kelas IV-B berhasil ditandai Hadir!');
  };

  // Grade update helper
  const handleUpdateScore = (
    studentId: string,
    subjectKey: SubjectKey,
    field: keyof Omit<StudentGrade, 'predicate' | 'achievedDescription' | 'growthDescription'>,
    value: number
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const currentGrade = { ...s.grades[subjectKey] };
        currentGrade[field] = value;

        // Auto calculate Nilai Akhir Kurikulum Merdeka
        const formatif = currentGrade.formatif;
        const sumatifMateri = currentGrade.sumatifMateri;
        const sumatifAkhir = currentGrade.sumatifAkhir;

        const calculatedFinal = Math.round(
          formatif * 0.3 + sumatifMateri * 0.4 + sumatifAkhir * 0.3
        );
        currentGrade.finalScore = calculatedFinal;

        // Determine predicate
        if (calculatedFinal >= 90) {
          currentGrade.predicate = 'Sangat Baik';
        } else if (calculatedFinal >= 80) {
          currentGrade.predicate = 'Baik';
        } else if (calculatedFinal >= 70) {
          currentGrade.predicate = 'Cukup';
        } else {
          currentGrade.predicate = 'Perlu Bimbingan';
        }

        return {
          ...s,
          grades: {
            ...s.grades,
            [subjectKey]: currentGrade,
          },
        };
      })
    );
  };

  // Batch assessment update
  const handleSaveAssessmentBatch = (
    subjectKey: SubjectKey,
    assessmentField: 'tp1' | 'tp2' | 'formatif' | 'sumatifMateri' | 'sumatifAkhir',
    scoresMap: Record<string, number>
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        const val = scoresMap[s.id] ?? s.grades[subjectKey][assessmentField];
        const currentGrade = { ...s.grades[subjectKey] };
        currentGrade[assessmentField] = val;

        const formatif = currentGrade.formatif;
        const sumatifMateri = currentGrade.sumatifMateri;
        const sumatifAkhir = currentGrade.sumatifAkhir;

        const calculatedFinal = Math.round(
          formatif * 0.3 + sumatifMateri * 0.4 + sumatifAkhir * 0.3
        );
        currentGrade.finalScore = calculatedFinal;

        if (calculatedFinal >= 90) {
          currentGrade.predicate = 'Sangat Baik';
        } else if (calculatedFinal >= 80) {
          currentGrade.predicate = 'Baik';
        } else if (calculatedFinal >= 70) {
          currentGrade.predicate = 'Cukup';
        } else {
          currentGrade.predicate = 'Perlu Bimbingan';
        }

        return {
          ...s,
          grades: {
            ...s.grades,
            [subjectKey]: currentGrade,
          },
        };
      })
    );
    showToast('Nilai asesmen kelas berhasil disimpan dan disinkronkan!');
  };

  // Award P5 Badge
  const handleAwardBadge = (
    studentId: string,
    badgeData: Omit<Badge, 'id' | 'earnedDate'>
  ) => {
    const newBadge: Badge = {
      ...badgeData,
      id: `b-${Date.now()}`,
      earnedDate: 'Hari ini',
    };

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          p5Stars: s.p5Stars + badgeData.points,
          badges: [newBadge, ...s.badges],
        };
      })
    );
    showToast(`Lencana "${badgeData.title}" berhasil disematkan!`);
  };

  // Quick award star (+5)
  const handleQuickAwardStar = (student: Student) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== student.id) return s;
        return {
          ...s,
          p5Stars: s.p5Stars + 5,
        };
      })
    );
    showToast(`+5 Bintang Apresiasi untuk Ananda ${student.nickname}!`);
  };

  // Update teacher notes
  const handleUpdateTeacherNotes = (studentId: string, notes: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          teacherNotes: notes,
        };
      })
    );
  };

  // Submit Parent Absence Permit
  const handleSubmitParentPermit = (studentId: string, type: 'sakit' | 'izin', note: string) => {
    handleUpdateAttendance(studentId, type);
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: `Surat Izin ${type === 'sakit' ? 'Sakit' : 'Keluarga'} - Ananda ${student.name}`,
      category: 'Pengumuman Wali Murid',
      date: 'Hari ini',
      author: `${student.parentName} (Orang Tua)`,
      content: note,
      urgent: true,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const handleAddAnnouncement = (ann: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('Pengumuman baru berhasil diterbitkan!');
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#1F1B2E] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4C1D95] text-white px-4 py-3 rounded-2xl shadow-academic-lg border border-[#C4B5FD]/40 flex items-center gap-2.5 text-xs font-semibold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-[#7DD3FC]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Navigation & Context Header */}
      <HeaderNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenNewAssessment={() => setIsNewAssessmentOpen(true)}
        onOpenBatchPrint={() => setSelectedStudentForReport(students[0])}
        unreadAnnouncementsCount={announcements.length}
      />

      {/* Main Body View Container */}
      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1">
        {activeTab === 'dashboard' && (
          <ClassDashboard
            students={students}
            onUpdateAttendance={handleUpdateAttendance}
            onMarkAllPresent={handleMarkAllPresent}
            onOpenReportCard={(s) => setSelectedStudentForReport(s)}
            onOpenStudentDetail={(s) => setSelectedStudentForDetail(s)}
            onQuickAwardStar={handleQuickAwardStar}
            announcements={announcements}
            onNavigateToGradebook={() => setActiveTab('gradebook')}
          />
        )}

        {activeTab === 'gradebook' && (
          <GradebookQuickReport
            students={students}
            subjects={subjects}
            onUpdateScore={handleUpdateScore}
            onOpenReportCard={(s) => setSelectedStudentForReport(s)}
            onOpenNewAssessment={() => setIsNewAssessmentOpen(true)}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementBoard
            students={students}
            onAwardBadge={handleAwardBadge}
            onQuickAwardStar={handleQuickAwardStar}
          />
        )}

        {activeTab === 'growth' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#C4B5FD]/30 shadow-academic-sm">
              <h2 className="text-lg font-bold text-[#1F1B2E]">
                Daftar Rekam Tumbuh Kembang Peserta Didik
              </h2>
              <p className="text-xs text-[#6B6880]">
                Klik pada siswa untuk membuka rekam medis berkala, nilai radar, dan catatan naratif guru kelas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  onClick={() => {
                    soundEffects.playPop();
                    setSelectedStudentForDetail(student);
                  }}
                  className="bg-white p-5 rounded-2xl border border-[#EDE9FE] hover:border-[#4C1D95] hover:shadow-academic-md transition-all cursor-pointer flex flex-col items-center text-center group"
                >
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-3 ring-[#EDE9FE] group-hover:ring-[#4C1D95]/40 transition-all shadow-sm"
                  />
                  <h3 className="mt-3 text-sm font-bold text-[#1F1B2E] group-hover:text-[#4C1D95]">
                    {student.name}
                  </h3>
                  <span className="text-[11px] text-[#6B6880] mt-0.5">
                    NISN: {student.nisn}
                  </span>

                  <div className="mt-3 pt-3 border-t border-[#EDE9FE] w-full flex items-center justify-around text-xs">
                    <div>
                      <span className="text-[#6B6880] text-[10px] block">TB / BB</span>
                      <strong className="text-[#1F1B2E]">
                        {student.physicalGrowth.heightCm}cm / {student.physicalGrowth.weightKg}kg
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#6B6880] text-[10px] block">Bintang</span>
                      <strong className="text-[#EC4899]">⭐ {student.p5Stars}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'parent' && (
          <ParentPortalView
            students={students}
            onOpenReportCard={(s) => setSelectedStudentForReport(s)}
            onSubmitParentPermit={handleSubmitParentPermit}
          />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsView
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
          />
        )}
      </main>

      {/* Modal: Official Kurikulum Merdeka Report Card */}
      {selectedStudentForReport && (
        <ReportCardModal
          student={selectedStudentForReport}
          students={students}
          subjects={subjects}
          onClose={() => setSelectedStudentForReport(null)}
          onSelectStudent={(s) => setSelectedStudentForReport(s)}
        />
      )}

      {/* Drawer: Detailed Student Profile */}
      {selectedStudentForDetail && (
        <StudentProfileDrawer
          student={selectedStudentForDetail}
          subjects={subjects}
          onClose={() => setSelectedStudentForDetail(null)}
          onOpenReportCard={(s) => {
            setSelectedStudentForDetail(null);
            setSelectedStudentForReport(s);
          }}
          onUpdateTeacherNotes={handleUpdateTeacherNotes}
          onQuickAwardStar={handleQuickAwardStar}
        />
      )}

      {/* Modal: New Batch Assessment */}
      {isNewAssessmentOpen && (
        <NewAssessmentModal
          students={students}
          subjects={subjects}
          onClose={() => setIsNewAssessmentOpen(false)}
          onSaveAssessmentBatch={handleSaveAssessmentBatch}
        />
      )}

      {/* Academic Footer */}
      <footer className="no-print bg-white border-t border-[#EDE9FE] py-6 px-4 mt-12 text-center text-xs text-[#6B6880]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-left">
            <div className="w-7 h-7 rounded-lg bg-[#4C1D95] flex items-center justify-center text-white font-bold text-xs">
              <School className="w-4 h-4 text-[#7DD3FC]" />
            </div>
            <div>
              <p className="font-bold text-[#1F1B2E]">
                SD Negeri 01 Tilamuta · Boalemo, Gorontalo
              </p>
              <p className="text-[11px] text-[#6B6880]">
                UPTD Satuan Pendidikan Formal · Kurikulum Merdeka Fase B (Kelas IV)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Wali Kelas: <strong>Khoyum Supardi, S.Pd.</strong></span>
            <span>·</span>
            <span>Tahun Ajaran 2025/2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
