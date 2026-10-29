export type SubjectKey =
  | 'pancasila'
  | 'indonesia'
  | 'matematika'
  | 'ipas'
  | 'seni'
  | 'pjok'
  | 'inggris'
  | 'mulok';

export interface SubjectInfo {
  key: SubjectKey;
  name: string;
  code: string;
  category: 'Wajib' | 'Muatan Lokal';
  teacher: string;
  kkm: number;
  tpDescriptions: {
    tp1: string;
    tp2: string;
  };
}

export interface StudentGrade {
  tp1: number;
  tp2: number;
  formatif: number;
  sumatifMateri: number;
  sumatifAkhir: number;
  finalScore: number;
  predicate: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan';
  achievedDescription: string;
  growthDescription: string;
}

export type AttendanceStatus = 'hadir' | 'sakit' | 'izin' | 'alpa';

export interface Badge {
  id: string;
  title: string;
  dimension: 'Bernalar Kritis' | 'Bergotong Royong' | 'Mandiri' | 'Kreatif' | 'Berakhlak Mulia' | 'Berkebinekaan Global';
  icon: string;
  description: string;
  earnedDate: string;
  points: number;
}

export interface Student {
  id: string;
  nisn: string;
  nipd: string;
  name: string;
  nickname: string;
  gender: 'L' | 'P';
  avatar: string;
  birthPlace: string;
  birthDate: string;
  parentName: string;
  parentPhone: string;
  address: string;
  todayAttendance: AttendanceStatus;
  attendanceHistory: {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
  };
  grades: Record<SubjectKey, StudentGrade>;
  p5Stars: number;
  badges: Badge[];
  teacherNotes: string;
  p5ProjectNotes: string;
  physicalGrowth: {
    heightCm: number;
    weightKg: number;
    vision: string;
    hearing: string;
    dental: string;
  };
  extracurricular: string[];
  favoriteField: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Proyek P5' | 'Asesmen' | 'Kegiatan Siswa' | 'Pengumuman Wali Murid';
  date: string;
  author: string;
  content: string;
  urgent?: boolean;
}

export interface ClassStats {
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
  todayAttendanceRate: number;
  averageClassScore: number;
  totalP5Stars: number;
  reportsReady: number;
}
