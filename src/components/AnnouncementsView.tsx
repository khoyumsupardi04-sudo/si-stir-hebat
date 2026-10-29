import React, { useState } from 'react';
import { BellRing, Calendar, PlusCircle, Sparkles, Filter, Pin, CheckCircle2 } from 'lucide-react';
import { Announcement } from '../types/academic';
import { soundEffects } from '../utils/soundEffects';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  onAddAnnouncement,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('Proyek P5');
  const [content, setContent] = useState('');

  const filtered = announcements.filter((a) => {
    if (filterCategory === 'all') return true;
    return a.category === filterCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    soundEffects.playStarChime();
    onAddAnnouncement({
      title,
      category,
      content,
      author: 'Khoyum Supardi, S.Pd. (Wali Kelas)',
      date: 'Hari ini',
      urgent: false,
    });

    setTitle('');
    setContent('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#7C3AED] text-white p-6 rounded-2xl shadow-academic-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-[#E0F2FE]">
            <BellRing className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Papan Informasi Sekolah & Kelas</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Agenda Pembelajaran & Pengumuman
          </h2>
          <p className="text-xs sm:text-sm text-[#E0F2FE] max-w-xl">
            Informasi penting seputar agenda asesmen, jadwal pameran karya P5, dan koordinasi dengan orang tua murid.
          </p>
        </div>

        <button
          onClick={() => {
            soundEffects.playPop();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#EC4899] text-white hover:bg-[#DB2777] shadow-md shadow-[#EC4899]/30 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Buat Agenda Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-white rounded-2xl border border-[#C4B5FD]/30 shadow-academic-sm">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
            filterCategory === 'all'
              ? 'bg-[#4C1D95] text-white shadow-xs'
              : 'text-[#6B6880] hover:text-[#1F1B2E]'
          }`}
        >
          Semua Informasi ({announcements.length})
        </button>
        {['Proyek P5', 'Asesmen', 'Kegiatan Siswa', 'Pengumuman Wali Murid'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-[#4C1D95] text-white shadow-xs'
                : 'text-[#6B6880] hover:text-[#1F1B2E]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ann) => (
          <div
            key={ann.id}
            className="bg-white rounded-2xl p-5 border border-[#C4B5FD]/30 shadow-academic-sm hover:shadow-academic-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#EDE9FE] text-[#4C1D95]">
                  {ann.category}
                </span>
                <span className="text-xs text-[#6B6880] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {ann.date}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#1F1B2E] leading-snug">
                {ann.title}
              </h3>

              <p className="text-xs text-[#6B6880] leading-relaxed">
                {ann.content}
              </p>
            </div>

            <div className="pt-3 border-t border-[#EDE9FE] flex items-center justify-between text-[11px] text-[#6B6880]">
              <span>Diterbitkan oleh: <strong>{ann.author}</strong></span>
              <span className="text-[#22C55E] font-semibold">Tersampaikan</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Announcement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1B2E]/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-academic-lg border border-[#C4B5FD]/40 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
              <h3 className="text-base font-bold text-[#1F1B2E]">
                Terbitkan Agenda & Pengumuman Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#6B6880] hover:text-[#1F1B2E] text-xs font-bold"
              >
                Batal
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#1F1B2E] mb-1">
                  Kategori:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Announcement['category'])}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF9FF] focus:border-[#4C1D95] font-semibold"
                >
                  <option value="Proyek P5">Proyek P5</option>
                  <option value="Asesmen">Asesmen</option>
                  <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                  <option value="Pengumuman Wali Murid">Pengumuman Wali Murid</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1F1B2E] mb-1">
                  Judul Informasi / Agenda:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Penilaian Portofolio Sulam Karawo..."
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF9FF] focus:border-[#4C1D95]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#1F1B2E] mb-1">
                  Rincian Informasi:
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan petunjuk lengkap dan pengumuman untuk siswa serta orang tua..."
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF9FF] focus:border-[#4C1D95] leading-relaxed"
                  required
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#6B6880] font-bold"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-[#4C1D95] text-white hover:bg-[#340075] transition-all"
                >
                  Terbitkan Informasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
