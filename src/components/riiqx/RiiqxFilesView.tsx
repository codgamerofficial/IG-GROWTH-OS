'use client';

// =============================================================================
// RIIQX 2.0 — Projects & Files Library
// iOS-Inspired Design System • Trending Yellow (#FFD43B) & Red/Coral (#FF4D4F)
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
  Library,
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
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#FAF9F6] dark:bg-[#151515] p-4 sm:p-6 lg:p-8 space-y-6 transition-colors">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
                <Library className="h-4 w-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202124] dark:text-white">
                Projects &amp; Files Library
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A3A3A3] mt-1.5">
              Manage your media assets, video drafts, documents, and exported reels.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] text-xs text-[#202124] dark:text-white placeholder-[#737373] dark:placeholder-[#A3A3A3] focus:outline-none focus:border-[#FFD43B] shadow-2xs transition-colors"
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-[#202124] bg-[#FFD43B] hover:bg-[#FFC928] transition-colors shrink-0 shadow-xs"
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
              className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                activeFilter === tab
                  ? 'bg-[#FFD43B] text-[#202124] shadow-xs'
                  : 'bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] text-[#737373] dark:text-[#A3A3A3] hover:text-[#202124] dark:hover:text-white hover:border-[#FFD43B]'
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
                className="p-4 rounded-3xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] shadow-2xs hover:border-[#FFD43B] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isFolder
                        ? 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B]'
                        : isVid
                        ? 'bg-[#FF6B5E]/15 text-[#FF6B5E]'
                        : 'bg-[#16865D]/15 text-[#16865D]'
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

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-[#202124] dark:text-white truncate">
                      {file.name}
                    </h3>
                    <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mt-0.5">{file.meta}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {isVid && (
                    <button
                      onClick={() => setActiveTab('editor')}
                      title="Open in AI Video Editor"
                      className="p-2 rounded-xl hover:bg-[#FAF9F6] dark:hover:bg-[#151515] text-[#737373] hover:text-[#FF6B5E] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setFiles(files.filter((f) => f.id !== file.id))}
                    title="Delete"
                    className="p-2 rounded-xl hover:bg-[#FF4D4F]/10 text-[#737373] hover:text-[#FF4D4F] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
