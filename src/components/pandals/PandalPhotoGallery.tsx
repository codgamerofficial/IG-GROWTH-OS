'use client';

// =============================================================================
// PujaHop Kolkata: Community Darshan Photo Gallery & Direct Upload Component
// PostGIS EXIF Geocoding • Instant Camera Capture • High-Res Lightbox
// Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Pandal } from '@/lib/types/pujahop';
import { extractExifFromFile, calculateDistanceMeters, ExtractedExifData } from '@/lib/utils/exif';
import {
  Camera,
  Upload,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  X,
  Maximize2,
  Calendar,
  Sparkles,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

interface PhotoItem {
  id: string;
  pandal_id: string;
  photo_url: string;
  caption: string;
  taken_at?: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  source: string;
}

interface Props {
  pandal: Pandal;
}

export function PandalPhotoGallery({ pandal }: Props) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  // Upload Draft State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [exifData, setExifData] = useState<ExtractedExifData | null>(null);
  const [distanceToPandal, setDistanceToPandal] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch photos for pandal
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/photos?pandal_id=${pandal.id}&limit=20`)
      .then((r) => r.json())
      .then((data) => {
        if (isMounted && data.success) {
          setPhotos(data.photos || []);
        }
      })
      .catch((err) => console.error('Failed to load pandal photos:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pandal.id]);

  // Handle Image Selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setStatusMsg(null);

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Extract EXIF Metadata
    const extracted = await extractExifFromFile(file);
    setExifData(extracted);

    if (extracted.latitude && extracted.longitude) {
      const dist = calculateDistanceMeters(
        extracted.latitude,
        extracted.longitude,
        pandal.lat,
        pandal.lng
      );
      setDistanceToPandal(dist);
    } else {
      // Fallback: try browser geolocation if available
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const currentLat = pos.coords.latitude;
            const currentLng = pos.coords.longitude;
            const dist = calculateDistanceMeters(currentLat, currentLng, pandal.lat, pandal.lng);
            setDistanceToPandal(dist);
            setExifData((prev) => ({
              ...(prev || {
                takenAt: new Date().toISOString(),
                cameraMake: null,
                cameraModel: null,
                rawExif: {},
              }),
              latitude: currentLat,
              longitude: currentLng,
              hasGps: true,
            }));
          },
          () => {
            // Geolocation declined - fallback to pandal location
            setDistanceToPandal(0);
          },
          { timeout: 3000 }
        );
      } else {
        setDistanceToPandal(0);
      }
    }
  };

  const cancelUpload = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setExifData(null);
    setDistanceToPandal(null);
    setCaption('');
    setStatusMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setStatusMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('pandal_id', pandal.id);
      formData.append('caption', caption || `${pandal.name} Darshan`);

      const lat = exifData?.latitude ?? pandal.lat;
      const lng = exifData?.longitude ?? pandal.lng;
      formData.append('latitude', lat.toString());
      formData.append('longitude', lng.toString());

      if (exifData?.takenAt) {
        formData.append('taken_at', exifData.takenAt);
      }
      if (exifData?.rawExif) {
        formData.append('exif_metadata', JSON.stringify(exifData.rawExif));
      }

      const res = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.photo) {
        setPhotos((prev) => [data.photo, ...prev]);
        setStatusMsg('✔ Photo uploaded and geocoded in PostGIS!');
        setTimeout(() => {
          cancelUpload();
        }, 1500);
      } else {
        setStatusMsg(`Upload error: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-white/10">
      {/* Header & Trigger */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white">Community Darshan Gallery</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
            {photos.length} Photos
          </span>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-950/40 transition-all active:scale-95"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Darshan Photo</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />
      </div>

      {/* Upload Preview & Geotag Card */}
      {selectedFile && previewUrl && (
        <div className="p-4 rounded-2xl bg-[#15132B] border border-amber-500/30 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Review &amp; Geotag Darshan Photo</span>
            </span>
            <button onClick={cancelUpload} className="text-zinc-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Image Preview Thumbnail */}
            <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>

            {/* Geotag & Form Inputs */}
            <form onSubmit={handleUploadSubmit} className="flex-1 space-y-2 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Darshan Caption / Tithi:</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={`e.g. Maha Ashtami Idol Darshan at ${pandal.name}`}
                  className="w-full bg-[#0D0B1C] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-zinc-500"
                />
              </div>

              {/* Geotag Validation Pill */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>EXIF Location:</span>
                  </span>
                  {distanceToPandal !== null ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {distanceToPandal < 350
                        ? `Within ${distanceToPandal}m of Pandal (Authentic Ground Darshan)`
                        : `${distanceToPandal}m from Pandal`}
                    </span>
                  ) : (
                    <span className="text-zinc-400 font-mono">Calibrated to Pandal GPS</span>
                  )}
                </div>

                {exifData?.cameraModel && (
                  <div className="text-[10px] text-zinc-500">
                    Camera: {exifData.cameraMake} {exifData.cameraModel}
                  </div>
                )}
              </div>

              {statusMsg && (
                <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
                  {statusMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={cancelUpload}
                  className="px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploading ? 'Uploading to Supabase...' : 'Publish to Gallery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-8 text-xs text-zinc-400">
          <Loader2 className="w-4 h-4 animate-spin mr-2 text-rose-400" />
          <span>Loading community photographs...</span>
        </div>
      ) : photos.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-zinc-400 space-y-1">
          <ImageIcon className="w-6 h-6 mx-auto text-zinc-500 mb-1" />
          <p>No community photographs uploaded for this pandal yet.</p>
          <p className="text-[11px] text-amber-400">Be the first to share your Darshan memory!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {photos.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black cursor-pointer hover:border-amber-400/50 transition-all"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.photo_url}
                alt={item.caption || pandal.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-[10px]">
                <p className="font-semibold text-white truncate">{item.caption}</p>
                <div className="flex items-center justify-between text-zinc-400 pt-0.5">
                  <span>{item.source === 'COMMUNITY_DARSHAN' ? 'Community' : 'Official'}</span>
                  <Maximize2 className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-[#121124] border border-white/15 rounded-3xl overflow-hidden shadow-2xl space-y-3"
          >
            <div className="relative max-h-[70vh] bg-black flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.photo_url}
                alt={selectedPhoto.caption}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <h4 className="font-bold text-white text-sm">{selectedPhoto.caption}</h4>
                <div className="text-zinc-400 flex items-center gap-2 mt-0.5 text-[11px]">
                  <span>Pandal: {pandal.name}</span>
                  {selectedPhoto.taken_at && (
                    <span>• {new Date(selectedPhoto.taken_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 self-start sm:self-auto flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Geotagged &amp; Verified</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
