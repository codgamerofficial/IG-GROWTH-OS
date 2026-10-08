'use client';

// =============================================================================
// PujaHop Kolkata: Real Map Screen (Phase 7: Real Tiles • OSRM Geometry • Leaflet)
// CartoDB Dark Matter / OSM Tiles • No Fake SVG Projections • Real Coordinates
// =============================================================================

import React, { useEffect, useRef, useState } from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { Pandal, MetroStation, Restaurant, Hospital, PoliceStation } from '@/lib/types/pujahop';
import { VERIFIED_HOSPITALS, VERIFIED_POLICE_STATIONS, VERIFIED_RESTAURANTS } from '@/lib/data/kolkata-amenities';
import { getPandalOpeningStatusForDate } from '@/lib/data/kolkata-pandals';
import { SourceBadge } from '@/components/common/SourceBadge';
import {
  MapPin,
  Train,
  Utensils,
  ShieldAlert,
  Hospital as HospIcon,
  Navigation,
  CheckCircle2,
  ExternalLink,
  Layers,
  Filter,
  Phone,
  Clock,
  Compass,
} from 'lucide-react';

type LayerType = 'all' | 'pandals' | 'metro' | 'emergency' | 'food';

export function MapView() {
  const {
    pandals,
    metroStations,
    currentTrip,
    selectedDate,
    setSelectedPandal,
    markPandalVisited,
  } = usePujaHop();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const CARTO_API_KEY = process.env.NEXT_PUBLIC_CARTO_API_KEY || 'cb1_4er7_1_ff393df50298cdcd08cbc8cb';
  type MapTheme = 'dark_all' | 'voyager';
  const [mapTheme, setMapTheme] = useState<MapTheme>('dark_all');

  const getTileUrl = (theme: MapTheme) => {
    if (theme === 'voyager') {
      return `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`;
    }
    return `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`;
  };

  const [filterLayer, setFilterLayer] = useState<LayerType>('all');
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'PANDAL' | 'METRO' | 'HOSPITAL' | 'POLICE' | 'FOOD';
    data: any;
  } | null>({ type: 'PANDAL', data: pandals[0] });

  // Initialize Real Leaflet Map
  useEffect(() => {
    let isMounted = true;

    // Dynamically import Leaflet on client side
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Prevent duplicate map initialization
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Center on Central Kolkata (CR Avenue / Esplanade corridor)
      const map = L.map(mapContainerRef.current, {
        center: [22.565, 88.363],
        zoom: 13,
        zoomControl: true,
      });

      // CartoDB Tiles with API key
      const tileLayer = L.tileLayer(getTileUrl(mapTheme), {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      const layerGroup = L.layerGroup().addTo(map);
      const routeGroup = L.layerGroup().addTo(map);

      layerGroupRef.current = layerGroup;
      routeLayerRef.current = routeGroup;
      mapInstanceRef.current = map;

      // Render markers
      renderMarkers(L, map, layerGroup, routeGroup, filterLayer);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update base tile layer on theme toggle (Dark Matter vs Voyager)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    import('leaflet').then((L) => {
      if (tileLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      const newLayer = L.tileLayer(getTileUrl(mapTheme), {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
      newLayer.bringToBack();
    });
  }, [mapTheme]);

  // Re-render markers when filter or trip changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current || !routeLayerRef.current) return;

    import('leaflet').then((L) => {
      renderMarkers(L, mapInstanceRef.current, layerGroupRef.current, routeLayerRef.current, filterLayer);
    });
  }, [filterLayer, currentTrip, pandals, metroStations]);

  const renderMarkers = (L: any, map: any, layerGroup: any, routeGroup: any, layer: LayerType) => {
    layerGroup.clearLayers();
    routeGroup.clearLayers();

    // 1. Draw Active Trip Route Polyline if present
    if (currentTrip && currentTrip.stops.length > 1) {
      const latlngs = currentTrip.stops.map((s) => [s.lat, s.lng]);
      const polyline = L.polyline(latlngs, {
        color: '#F59E0B',
        weight: 4,
        dashArray: '6, 6',
        opacity: 0.9,
      }).addTo(routeGroup);

      // Fit map to trip route bounds
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }

    // 2. Pandals
    if (layer === 'all' || layer === 'pandals') {
      pandals.forEach((p) => {
        const areaColor =
          p.area === 'North Kolkata'
            ? '#E11D48'
            : p.area === 'Central Kolkata'
            ? '#F59E0B'
            : p.area === 'South Kolkata'
            ? '#6366F1'
            : '#10B981';

        const icon = L.divIcon({
          className: 'custom-pandal-marker',
          html: `<div style="background-color: ${areaColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.8); cursor: pointer;"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker([p.lat, p.lng], { icon }).addTo(layerGroup);
        marker.on('click', () => {
          setSelectedEntity({ type: 'PANDAL', data: p });
          setSelectedPandal(p);
        });
        marker.bindTooltip(`<b>${p.name}</b><br/><span style="font-size:10px">${p.area} • Metro: ${p.nearest_metro}</span>`, {
          direction: 'top',
        });
      });
    }

    // 3. Metro Stations
    if (layer === 'all' || layer === 'metro') {
      metroStations.forEach((station) => {
        const icon = L.divIcon({
          className: 'custom-metro-marker',
          html: `<div style="background-color: #06B6D4; width: 12px; height: 12px; border-radius: 3px; border: 1.5px solid white; color: black; font-size: 8px; font-weight: bold; display: flex; align-items: center; justify-content: center; cursor: pointer;">M</div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        const marker = L.marker([station.lat, station.lng], { icon }).addTo(layerGroup);
        marker.on('click', () => {
          setSelectedEntity({ type: 'METRO', data: station });
        });
        marker.bindTooltip(`<b>🚇 ${station.name} Metro</b><br/><span style="font-size:10px">${station.line_name}</span>`, {
          direction: 'top',
        });
      });
    }

    // 4. Hospitals & Police Stations (Emergency)
    if (layer === 'all' || layer === 'emergency') {
      VERIFIED_HOSPITALS.forEach((hosp) => {
        const icon = L.divIcon({
          className: 'custom-hosp-marker',
          html: `<div style="background-color: #EF4444; width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid white; color: white; font-size: 9px; font-weight: bold; display: flex; align-items: center; justify-content: center; cursor: pointer;">+</div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        const marker = L.marker([hosp.lat, hosp.lng], { icon }).addTo(layerGroup);
        marker.on('click', () => {
          setSelectedEntity({ type: 'HOSPITAL', data: hosp });
        });
        marker.bindTooltip(`<b>🏥 ${hosp.name}</b><br/><span style="font-size:10px">Emergency: ${hosp.emergency_number}</span>`);
      });

      VERIFIED_POLICE_STATIONS.forEach((ps) => {
        const icon = L.divIcon({
          className: 'custom-ps-marker',
          html: `<div style="background-color: #3B82F6; width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid white; color: white; font-size: 8px; font-weight: bold; display: flex; align-items: center; justify-content: center; cursor: pointer;">P</div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        const marker = L.marker([ps.lat, ps.lng], { icon }).addTo(layerGroup);
        marker.on('click', () => {
          setSelectedEntity({ type: 'POLICE', data: ps });
        });
        marker.bindTooltip(`<b>👮 ${ps.name}</b><br/><span style="font-size:10px">Phone: ${ps.phone}</span>`);
      });
    }

    // 5. Food Stops
    if (layer === 'all' || layer === 'food') {
      VERIFIED_RESTAURANTS.forEach((rest) => {
        const icon = L.divIcon({
          className: 'custom-rest-marker',
          html: `<div style="background-color: #F97316; width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid white; color: white; font-size: 8px; font-weight: bold; display: flex; align-items: center; justify-content: center; cursor: pointer;">🍽</div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        const marker = L.marker([rest.lat, rest.lng], { icon }).addTo(layerGroup);
        marker.on('click', () => {
          setSelectedEntity({ type: 'FOOD', data: rest });
        });
        marker.bindTooltip(`<b>🍴 ${rest.name}</b><br/><span style="font-size:10px">${rest.category} • ${rest.rating}⭐</span>`);
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#070611]">
      {/* REAL LEAFLET MAP CONTAINER */}
      <div className="relative flex-1 h-[60vh] lg:h-full bg-[#0B0918] overflow-hidden select-none border-r border-white/10">
        {/* Real Leaflet Map mount */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Layer Filters */}
        <div className="absolute top-4 left-4 z-[500] flex flex-wrap items-center gap-1.5 bg-[#121124]/95 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs shadow-2xl">
          <Layers className="w-4 h-4 text-amber-400 ml-1.5" />
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'pandals', label: 'Pandals' },
              { id: 'metro', label: 'Metro' },
              { id: 'emergency', label: 'Police & Hospitals' },
              { id: 'food', label: 'Food Stops' },
            ] as const
          ).map((l) => (
            <button
              key={l.id}
              onClick={() => setFilterLayer(l.id)}
              className={`px-3 py-1 rounded-xl capitalize font-medium transition-all ${
                filterLayer === l.id
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* CARTO Basemap Theme Switcher */}
        <div className="absolute top-4 right-4 z-[500] flex items-center bg-[#121124]/95 backdrop-blur-md p-1 rounded-2xl border border-white/10 text-xs shadow-2xl">
          <button
            onClick={() => setMapTheme('dark_all')}
            className={`px-2.5 py-1 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              mapTheme === 'dark_all'
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="CartoDB Dark Matter (Festive Dark Mode)"
          >
            <span>🌙</span>
            <span className="hidden sm:inline">Dark Matter</span>
          </button>
          <button
            onClick={() => setMapTheme('voyager')}
            className={`px-2.5 py-1 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              mapTheme === 'voyager'
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="CartoDB Voyager (Day Street Mode)"
          >
            <span>☀️</span>
            <span className="hidden sm:inline">Voyager</span>
          </button>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 z-[500] hidden sm:flex items-center gap-3 bg-[#121124]/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-[11px] text-zinc-300 shadow-xl">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
            North
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
            Central
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm" />
            South
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
            East
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm" />
            Metro
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
            Hospital
          </span>
        </div>
      </div>

      {/* RIGHT SIDEBAR: SELECTED ENTITY DOSSIER */}
      <div className="w-full lg:w-96 h-[40vh] lg:h-full bg-[#121124] overflow-y-auto p-5 space-y-4 border-t lg:border-t-0 lg:border-l border-white/10 shadow-2xl">
        {selectedEntity?.type === 'PANDAL' && (
          <div className="space-y-4">
            {(() => {
              const p = selectedEntity.data as Pandal;
              const dateStatus = getPandalOpeningStatusForDate(p, selectedDate);
              const score = p.score_breakdown?.editorial_score || p.overall_score;

              return (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {p.area}
                    </span>
                    <SourceBadge
                      source={p.source}
                      sourceUrl={p.source_url}
                      sourceType={p.source_type}
                      confidence={p.confidence}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white">{p.name}</h3>
                    <p className="text-xs text-amber-300/90 font-medium">{p.name_bn}</p>
                    <p className="text-xs text-zinc-400 mt-1 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
                      <span>{p.address}</span>
                    </p>
                  </div>

                  <div
                    className={`p-2.5 rounded-xl border text-xs ${
                      dateStatus.status === 'OPEN'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : dateStatus.status === 'EARLY OPENING'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : dateStatus.status === 'UNDER PREPARATION'
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <div className="font-semibold uppercase text-[10px]">{dateStatus.status}</div>
                    <div className="text-[10px] opacity-90 mt-0.5">{dateStatus.display_text}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                    <span className="text-amber-300 font-semibold text-[11px]">Theme:</span>
                    <p className="text-zinc-200 line-clamp-3">{p.theme}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] text-zinc-400">Nearest Metro</span>
                      <div className="font-bold text-white mt-0.5">🚇 {p.nearest_metro}</div>
                      <div className="text-[10px] text-zinc-400">{p.walking_distance}m walk</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] text-zinc-400">Darshan Timing</span>
                      <div className="font-bold text-white mt-0.5">
                        {p.opening_time} – {p.closing_time}
                      </div>
                      <div className="text-[10px] text-amber-400 font-bold">Index: {score.toFixed(1)}/10</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/30"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>START WALKING</span>
                    </a>

                    <button
                      onClick={() => markPandalVisited(p)}
                      className="px-3 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>VISITED</span>
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {selectedEntity?.type === 'METRO' && (
          <div className="space-y-4">
            {(() => {
              const station = selectedEntity.data as MetroStation;
              return (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {station.line_name}
                    </span>
                    <SourceBadge source="Metro Railway Kolkata" sourceType="METRO_RAILWAY" />
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white">🚇 {station.name}</h3>
                    <p className="text-xs text-amber-300/90 font-medium">{station.name_bn}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-2">
                    <div className="text-zinc-400 text-[11px]">Nearest Pandals within walking corridor:</div>
                    <ul className="text-zinc-200 space-y-1 list-disc pl-4 text-xs">
                      {station.nearest_pandals.map((np, i) => (
                        <li key={i}>{np}</li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>NAVIGATE TO STATION</span>
                  </a>
                </>
              );
            })()}
          </div>
        )}

        {selectedEntity?.type === 'HOSPITAL' && (
          <div className="space-y-4">
            {(() => {
              const hosp = selectedEntity.data as Hospital;
              return (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                      Emergency Hospital
                    </span>
                    <SourceBadge source="WB Health Department" sourceType="GOVERNMENT" />
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white">🏥 {hosp.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{hosp.address}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs space-y-2">
                    <div className="text-red-300 font-bold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Emergency Hotline: {hosp.emergency_number}</span>
                    </div>
                    <div className="text-zinc-300">Ambulance: {hosp.ambulance_number}</div>
                    <div className="text-[10px] text-zinc-400">
                      {hosp.has_emergency_icu ? '✓ 24/7 ICU & Trauma Center Available' : 'Emergency Casualty Only'}
                    </div>
                  </div>

                  <a
                    href={`tel:${hosp.emergency_number}`}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>CALL EMERGENCY HOTLINE</span>
                  </a>
                </>
              );
            })()}
          </div>
        )}

        {selectedEntity?.type === 'POLICE' && (
          <div className="space-y-4">
            {(() => {
              const ps = selectedEntity.data as PoliceStation;
              return (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Kolkata Police Station
                    </span>
                    <SourceBadge source="Kolkata Police Official" sourceType="KOLKATA_POLICE" />
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white">👮 {ps.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{ps.address}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs space-y-2">
                    <div className="text-blue-300 font-bold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Helpline: {ps.phone}</span>
                    </div>
                    <div className="text-zinc-300">Central Control Room: {ps.control_room}</div>
                  </div>

                  <a
                    href="tel:100"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>DIAL 100 / POLICE HELPLINE</span>
                  </a>
                </>
              );
            })()}
          </div>
        )}

        {selectedEntity?.type === 'FOOD' && (
          <div className="space-y-4">
            {(() => {
              const rest = selectedEntity.data as Restaurant;
              return (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                      {rest.category}
                    </span>
                    <SourceBadge source={rest.source} sourceUrl={rest.source_url} />
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white">🍴 {rest.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{rest.address}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                    <div className="text-amber-400 font-bold">Specialty:</div>
                    <p className="text-zinc-200">{rest.specialty}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Timing: {rest.opening_time} – {rest.closing_time}</span>
                    <span className="font-bold text-amber-400">{rest.rating} ⭐ ({rest.price_level})</span>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${rest.lat},${rest.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>NAVIGATE TO FOOD STOP</span>
                  </a>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
