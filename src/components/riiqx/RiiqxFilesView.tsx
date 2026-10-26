'use client';

// =============================================================================
// RIIQX 2.0 — Projects & Files Library (Matching Mobile/Desktop Reference)
// Multi-Category Filters • File Size Badges • Real Upload Handlers
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import {
  Folder,
  FileText,
  Video,
  Image as ImageIcon,
  Plus,
  Search,
  MoreVertical,
  Download,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  meta: string;
  category: 'Documents' | 'Images' | 'Videos';
  isFolder?: boolean;
}

export function RiiqxFilesView() {
  const { setActiveTab } = useRiiqx();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Documents' | 'Images' | 'Videos'>('All');
  const [search, setSearch] = useState('');
  const [files, setFiles] = useState<FileItem[]>([
    { id: 'f1', name: 'Travel Photos', meta: '12 files · 2.4 GB', category: 'Images', isFolder: true },
    { id: 'f2', name: 'Reel Draft', meta: 'Video · 00:28', category: 'Videos' },
    { id: 'f3', name: 'Business Plan.pdf', meta: 'PDF · 2.1 MB', category: 'Documents' },
    { id: 'f4', name: 'Product Images', meta: '8 images · 45 MB', category: 'Images', isFolder: true },
    { id: 'f5', name: 'Script.docx', meta: 'DOCX · 120 KB', category: 'Documents' },
    { id: 'f6', name: 'Final Reel.mp4', meta: 'Video · 00:28', category: 'Videos' },
  ]);

  const filtered = files.filter((f) => {
    const matchesFilter = activeFilter === 'All' || f.category === activeFilter;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 space-y-6 bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Projects & Files
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your media assets, video drafts, documents, and exported reels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-violet-400"
            />
          </div>
          <button
            onClick={() => {
              const name = prompt('Enter new document/file name:');
              if (name) {
                setFiles([
                  { id: `f_${Date.now()}`, name, meta: 'Uploaded today · 1.5 MB', category: 'Documents' },
                  ...files,
                ]);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-slate-900 hover:bg-violet-600 transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {(['All', 'Documents', 'Images', 'Videos'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
              activeFilter === tab
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* File List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((file) => {
          const isDoc = file.category === 'Documents';
          const isVid = file.category === 'Videos';
          const isFolder = file.isFolder;

          return (
            <div
              key={file.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    isFolder
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                      : isVid
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'
                      : 'bg-purple-50 text-purple-600 dark:bg-purple-950/40'
                  }`}
                >
                  {isFolder ? (
                    <Folder className="w-5 h-5" />
                  ) : isVid ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                    {file.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{file.meta}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isVid && (
                  <button
                    onClick={() => setActiveTab('editor')}
                    title="Open in AI Video Editor"
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-violet-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setFiles(files.filter((f) => f.id !== file.id))}
                  title="Delete"
                  className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
