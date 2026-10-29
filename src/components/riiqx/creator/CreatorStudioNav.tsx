'use client';

// =============================================================================
// RIIQX Creator Studio — Workflow Navigation & Project Header
// 14 Stage Tabs • Project Selector • Pipeline Progress Indicator
// =============================================================================

import React from 'react';
import {
  CreatorStudioTab,
  CreatorProject,
  ProjectLifecycleStatus,
} from '@/lib/riiqx/creator-types';
import {
  Sparkles,
  LayoutGrid,
  TrendingUp,
  CalendarDays,
  FileText,
  Layers,
  Video,
  FolderOpen,
  CheckCircle2,
  Clock,
  Calendar,
  CheckCheck,
  BarChart3,
  Bookmark,
  Palette,
  Plus,
  ChevronDown,
  FolderKanban,
  Check,
} from 'lucide-react';

interface CreatorStudioNavProps {
  activeTab: CreatorStudioTab;
  onTabChange: (tab: CreatorStudioTab) => void;
  projects: CreatorProject[];
  activeProject: CreatorProject | null;
  onSelectProject: (proj: CreatorProject) => void;
  onNewProject: () => void;
}

export function CreatorStudioNav({
  activeTab,
  onTabChange,
  projects,
  activeProject,
  onSelectProject,
  onNewProject,
}: CreatorStudioNavProps) {
  const [projectDropdownOpen, setProjectDropdownOpen] = React.useState(false);

  const tabs: Array<{
    id: CreatorStudioTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'ideas', label: 'Ideas & Trends', icon: TrendingUp },
    { id: 'planner', label: 'Planner', icon: CalendarDays },
    { id: 'script', label: 'Script Studio', icon: FileText },
    { id: 'storyboard', label: 'Storyboard', icon: Layers },
    { id: 'editor', label: 'Video Editor', icon: Video },
    { id: 'assets', label: 'AI Assets', icon: FolderOpen },
    { id: 'metadata', label: 'Captions & Review', icon: CheckCircle2 },
    { id: 'queue', label: 'Publish Queue', icon: Clock },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'published', label: 'Published', icon: CheckCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'templates', label: 'Templates', icon: Bookmark },
    { id: 'brand_kit', label: 'Brand Kit', icon: Palette },
  ];

  const getStatusBadge = (status: ProjectLifecycleStatus) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'ready_to_publish':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'editing':
      case 'producing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="w-full border-b border-[#EAE7E1] dark:border-[#2E2E2E] bg-white/85 dark:bg-[#151515]/85 backdrop-blur-md sticky top-0 z-20 transition-colors">
      {/* Top Bar: Project Switcher & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FFD43B] to-[#FF6B5E] text-[#202124] font-bold shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#202124] dark:text-[#FFD43B]">
                Creator Studio
              </span>
              <span className="text-xs text-[#737373]">•</span>
              <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">9:16 Shorts &amp; Reels</span>
            </div>
            {/* Project Dropdown */}
            <div className="relative mt-0.5">
              <button
                onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                className="flex items-center gap-2 text-sm font-bold text-[#202124] dark:text-white hover:text-[#FF6B5E] transition-colors"
              >
                <span className="max-w-[240px] truncate sm:max-w-md">
                  {activeProject?.name || 'No Project Selected'}
                </span>
                {activeProject && (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${getStatusBadge(
                      activeProject.status
                    )}`}
                  >
                    {activeProject.status.replace('_', ' ')}
                  </span>
                )}
                <ChevronDown className="h-4 w-4 text-[#737373]" />
              </button>

              {projectDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-2 shadow-2xl z-50">
                  <div className="mb-2 px-3 py-1 text-[11px] font-bold uppercase text-[#737373]">
                    Switch Active Project
                  </div>
                  <div className="max-h-60 space-y-1 overflow-y-auto">
                    {projects.map((proj) => (
                      <button
                        key={proj.id}
                        onClick={() => {
                          onSelectProject(proj);
                          setProjectDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                          proj.id === activeProject?.id
                            ? 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] font-bold'
                            : 'text-[#202124] dark:text-slate-300 hover:bg-[#FAF9F6] dark:hover:bg-[#282828]'
                        }`}
                      >
                        <span className="truncate pr-2">{proj.name}</span>
                        {proj.id === activeProject?.id && (
                          <Check className="h-3.5 w-3.5 text-[#202124] dark:text-[#FFD43B] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 border-t border-[#EAE7E1] dark:border-[#2E2E2E] pt-2">
                    <button
                      onClick={() => {
                        onNewProject();
                        setProjectDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[#202124] dark:text-[#FFD43B] hover:bg-[#FFD43B]/15 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create New Project</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] px-3.5 py-1.5 text-xs font-bold text-[#202124] shadow-xs transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Video Project</span>
          </button>
        </div>
      </div>

      {/* Workflow Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto px-4 sm:px-6 pb-2 pt-1 no-scrollbar border-t border-[#EAE7E1] dark:border-[#2E2E2E]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#FFD43B] text-[#202124] shadow-xs font-bold'
                  : 'text-[#737373] dark:text-[#A3A3A3] hover:bg-[#FAF9F6] dark:hover:bg-[#202020] hover:text-[#202124] dark:hover:text-white'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#202124]' : 'text-[#737373] dark:text-[#A3A3A3]'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive ? 'bg-[#202124] text-white' : 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B]'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
