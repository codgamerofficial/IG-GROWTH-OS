'use client';

// =============================================================================
// PujaHop Kolkata: Viral Social Passport Card Generator (Phase 28)
// 1080x1920 Instagram Story & WhatsApp Status High-Res Canvas Card
// Official Attribution: Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import React, { useRef, useState, useEffect } from 'react';
import { PandalVisitRecord } from '@/lib/types/pujahop';
import {
  Download,
  Share2,
  Sparkles,
  Award,
  CheckCircle2,
  X,
  Camera,
  Layers,
} from 'lucide-react';

interface SocialPassportCardGeneratorProps {
  visits: PandalVisitRecord[];
  totalPandals: number;
  isOpen: boolean;
  onClose: () => void;
}

export function SocialPassportCardGenerator({
  visits,
  totalPandals,
  isOpen,
  onClose,
}: SocialPassportCardGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userName, setUserName] = useState('Kolkata Hopper');

  // Compute stats
  const stampedCount = visits.length;
  const distinctAreas = Array.from(new Set(visits.map((v) => v.area || 'Kolkata')));
  const estimatedKm = (stampedCount * 1.35).toFixed(1);

  const festivalRank =
    stampedCount >= 10
      ? '👑 MAHA HOPPER 2026'
      : stampedCount >= 5
      ? '🪔 PUJA EXPLORER 2026'
      : '🌱 SHAROD UTSIK HOPPER';

  const renderCard = () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // High resolution 1080x1920 (9:16 Instagram Story)
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background Gradient: Luxurious Royal Crimson to Dark Velvet
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#1A040C');
    bgGrad.addColorStop(0.35, '#2D0615');
    bgGrad.addColorStop(0.7, '#18030B');
    bgGrad.addColorStop(1, '#0C0106');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Radial Glow in Center
    const glowGrad = ctx.createRadialGradient(width / 2, 700, 50, width / 2, 700, 600);
    glowGrad.addColorStop(0, 'rgba(234, 88, 12, 0.18)');
    glowGrad.addColorStop(0.6, 'rgba(225, 29, 72, 0.08)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Ornate Double Gold Border
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, width - 104, height - 104);

    // Corner decorative accents
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(35, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 35);
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(10, 10, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCorner(52, 52, 0);
    drawCorner(width - 52, 52, Math.PI / 2);
    drawCorner(width - 52, height - 52, Math.PI);
    drawCorner(52, height - 52, -Math.PI / 2);

    // 4. Header: Durga Puja Festival Header
    ctx.textAlign = 'center';

    // Top Tag
    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 26px sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('• DURGA PUJA 2026 OFFICIAL PASSPORT •', width / 2, 130);

    // Brand Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 78px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('PUJAHOP KOLKATA', width / 2, 230);

    // Tagline
    ctx.fillStyle = '#FCA5A5';
    ctx.font = 'italic 500 32px serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('One Day. One City. Maximum Puja.', width / 2, 285);

    // Golden Divider
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 325);
    ctx.lineTo(width - 180, 325);
    ctx.stroke();

    // 5. User Profile & Rank Card Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 2;
    ctx.roundRect(80, 360, width - 160, 260, 24);
    ctx.fill();
    ctx.stroke();

    // Pilgrim Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(userName, width / 2, 435);

    // Honorary Rank Pill
    ctx.fillStyle = 'rgba(225, 29, 72, 0.35)';
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 2;
    ctx.roundRect(width / 2 - 250, 470, 500, 60, 30);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FDE047';
    ctx.font = 'bold 28px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(festivalRank, width / 2, 510);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '22px sans-serif';
    ctx.fillText(`GPS-Verified Darshan Passport • Season of 2026`, width / 2, 580);

    // 6. Metrics Grid (3 Boxes)
    const boxY = 660;
    const boxH = 180;
    const boxW = (width - 160 - 40) / 3;

    const stats = [
      { label: 'PANDALS VISITED', value: `${stampedCount}`, sub: `out of ${totalPandals}` },
      { label: 'TRAIL DISTANCE', value: `${estimatedKm}`, sub: 'Kilometers Walked' },
      { label: 'AREAS COVERED', value: `${distinctAreas.length}`, sub: 'Kolkata Zones' },
    ];

    stats.forEach((s, i) => {
      const bx = 80 + i * (boxW + 20);
      ctx.fillStyle = 'rgba(20, 10, 25, 0.8)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.roundRect(bx, boxY, boxW, boxH, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(s.label, bx + boxW / 2, boxY + 48);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 52px sans-serif';
      ctx.fillText(s.value, bx + boxW / 2, boxY + 115);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '18px sans-serif';
      ctx.fillText(s.sub, bx + boxW / 2, boxY + 152);
    });

    // 7. Stamped Pandals Wall of Fame
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('🏛️ VERIFIED PANDAL STAMPS COLLECTION', width / 2, 895);

    // Render list of stamps (up to 8 on card)
    const listY = 930;
    const maxStamps = 7;
    const stampsToShow = visits.slice(0, maxStamps);

    if (stampsToShow.length === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.roundRect(80, listY, width - 160, 520, 20);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = 'italic 26px sans-serif';
      ctx.fillText('Ready for your first darshan stamp in Kolkata!', width / 2, listY + 260);
    } else {
      stampsToShow.forEach((v, idx) => {
        const itemY = listY + idx * 78;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.lineWidth = 1;
        ctx.roundRect(80, itemY, width - 160, 68, 16);
        ctx.fill();
        ctx.stroke();

        // Golden Stamp Icon
        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('✔', 110, itemY + 44);

        // Pandal Name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 26px sans-serif';
        const pName = v.pandal_name.length > 32 ? v.pandal_name.substring(0, 32) + '...' : v.pandal_name;
        ctx.fillText(pName, 160, itemY + 44);

        // Verification Pill
        ctx.textAlign = 'right';
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`${v.area || 'Kolkata'} • 5★`, width - 110, itemY + 44);
      });

      if (visits.length > maxStamps) {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FCA5A5';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(`+ ${visits.length - maxStamps} more stamped pandals in Kolkata passport`, width / 2, listY + maxStamps * 78 + 40);
      }
    }

    // 8. Official Creator Attribution Badge (MANDATORY REQUIREMENT)
    const footerY = 1600;
    ctx.textAlign = 'center';

    // Badge Background Box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.roundRect(100, footerY, width - 200, 180, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 24px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('OFFICIAL CREATOR & ARCHITECT CREDIT', width / 2, footerY + 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Created & Conceptualized by Saswata Dey (Riik)', width / 2, footerY + 105);

    ctx.fillStyle = '#FCA5A5';
    ctx.font = '500 22px sans-serif';
    ctx.fillText('PujaHop Kolkata • One Day. One City. Maximum Puja.', width / 2, footerY + 148);

    // 9. Bottom URL & Hashtags
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '22px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('pujahop.in • #PujaHopKolkata #DurgaPuja2026', width / 2, 1840);

    // Export Data URL
    setDataUrl(canvas.toDataURL('image/png'));
    setIsGenerating(false);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => renderCard(), 150);
    }
  }, [isOpen, userName, visits.length]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `PujaHop_Passport_${userName.replace(/\s+/g, '_')}_2026.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleNativeShare = async () => {
    if (!dataUrl) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'pujahop-passport.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Kolkata Puja Passport 2026',
          text: `Check out my verified Durga Puja 2026 passport with ${stampedCount} pandals visited! Built with PujaHop Kolkata (Created by Saswata Dey - Riik).`,
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0F0D20] border border-amber-500/30 shadow-2xl p-6 md:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Viral Story Card Generator (1080x1920 HD)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1">
            Export Your Durga Puja Passport Story
          </h2>
          <p className="text-xs text-zinc-400">
            Share your festival journey on Instagram Story, WhatsApp Status, and social media.
          </p>
        </div>

        {/* Customization bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <label className="text-[11px] font-bold text-zinc-300 block mb-1">
              Your Display Name on Passport:
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={24}
              className="w-full px-3.5 py-2 rounded-xl bg-[#121124] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
              placeholder="Your name"
            />
          </div>

          <button
            type="button"
            onClick={renderCard}
            className="self-end px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            Regenerate Card
          </button>
        </div>

        {/* Live Canvas (Hidden or scaled preview) */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-full max-w-xs aspect-[9/16] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-black">
            <canvas ref={canvasRef} className="hidden" />
            {dataUrl ? (
              <img
                src={dataUrl}
                alt="PujaHop Passport Social Card"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500 text-xs">
                Rendering Story Card...
              </div>
            )}
          </div>
          <span className="text-[10px] text-zinc-500">
            High-Definition 1080x1920 9:16 Canvas Format
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download HD Story Card (PNG)</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share to Instagram / WhatsApp</span>
          </button>
        </div>

        {/* Creator attribution note */}
        <div className="pt-2 border-t border-white/10 text-center text-[11px] text-zinc-500">
          Official Credit: Created & Conceptualized by{' '}
          <strong className="text-amber-400">Saswata Dey (Riik)</strong>
        </div>
      </div>
    </div>
  );
}
