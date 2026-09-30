import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Place } from '../types/food';
import { CATEGORY_CONFIG } from '../utils/formatters';
import { Locate, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import { UserLocation } from '../hooks/useGeolocation';

interface MapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (placeId: string) => void;
  userLocation: UserLocation | null;
  onRequestLocation: () => void;
  isLocating: boolean;
  mapStyle: 'dark' | 'light' | 'voyager';
  onSelectPlaza?: (plazaId: string) => void;
  hasActiveFilter?: boolean;
}

const TILE_LAYERS = {
  dark: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
  voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
};

export const MapView: React.FC<MapViewProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  userLocation,
  onRequestLocation,
  isLocating,
  mapStyle,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Irvine coordinates center
    const map = L.map(mapContainerRef.current, {
      center: [33.6846, -117.8265],
      zoom: 12.5,
      zoomControl: false,
      attributionControl: false,
    });

    // Toggle store name labels strictly based on zoom level >= 13.8
    const updateLabelVisibility = () => {
      if (mapContainerRef.current) {
        const isZoomedIn = map.getZoom() >= 13.8;
        mapContainerRef.current.classList.toggle('show-store-labels', isZoomedIn);
      }
    };

    map.on('zoom zoomend moveend', updateLabelVisibility);
    updateLabelVisibility();

    const tileUrl = TILE_LAYERS[mapStyle] || TILE_LAYERS.dark;
    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    tileLayerRef.current = tileLayer;
    markersLayerRef.current = markersLayer;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Tile Layer on Style Change
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    const tileUrl = TILE_LAYERS[mapStyle] || TILE_LAYERS.dark;
    tileLayerRef.current.setUrl(tileUrl);
  }, [mapStyle]);

  // Render Place Markers
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    places.forEach((place) => {
      const catConfig = CATEGORY_CONFIG[place.category] || CATEGORY_CONFIG.chinese;
      const isSelected = selectedPlace?.id === place.id;
      const isComingSoon = place.status === 'coming_soon';
      
      const hasZh = /[\u4e00-\u9fa5]/.test(place.name) && place.name !== place.enName;
      const displayEnName = (place.enName || place.name).split(' - ')[0];
      const displayZhName = hasZh ? place.name.split(' (')[0] : '';

      const markerHtml = `
        <div class="custom-food-marker" style="display: flex; flex-direction: column; align-items: center; width: 160px;">
          <div class="marker-bubble ${isSelected ? 'selected' : ''}" style="background-color: ${
        catConfig.color
      }; color: ${catConfig.color};">
            <span style="color: white; font-size: 17px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));">${catConfig.icon}</span>
            ${
              isComingSoon
                ? '<span style="position: absolute; top: -6px; right: -6px; background: #a855f7; color: white; font-size: 8px; font-weight: 800; padding: 1px 4px; border-radius: 9999px; border: 1px solid white;">NEW</span>'
                : ''
            }
            <div class="marker-pin-tail"></div>
          </div>
          <div class="marker-name-label">
            <span class="marker-en-primary">${displayEnName}</span>
            ${displayZhName ? `<span class="marker-zh-sub">${displayZhName}</span>` : ''}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'food-marker-container',
        html: markerHtml,
        iconSize: [160, 74],
        iconAnchor: [80, 38],
        popupAnchor: [0, -36],
      });



      const marker = L.marker([place.lat, place.lng], { icon: customIcon });

      // Custom Popup HTML
      const popupHtml = `
        <div style="width: 260px; overflow: hidden; border-radius: 12px; font-family: inherit;">
          <div style="position: relative; height: 110px; background: #1e293b;">
            <img src="${place.imageUrl}" alt="${place.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.95), transparent);"></div>
            <div style="position: absolute; bottom: 8px; left: 10px; right: 10px;">
              <div style="font-weight: 700; font-size: 14px; color: white; line-height: 1.2; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">${place.name}</div>
              <div style="font-size: 11px; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${place.enName}</div>
            </div>
            <span style="position: absolute; top: 8px; right: 8px; background: rgba(15,23,42,0.85); color: #fb923c; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 6px; border: 1px solid rgba(251,146,60,0.3);">
              ⭐ ${place.rating} (${place.reviewCount})
            </span>
          </div>
          <div style="padding: 10px 12px; font-size: 12px; color: #94a3b8; display: flex; flex-col; gap: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #fdba74; font-weight: 600;">${place.subcategory}</span>
              <span style="color: #64748b;">${place.priceLevel} · ${place.city}</span>
            </div>
            <div style="font-size: 11px; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              📍 ${place.plazaName || place.address}
            </div>
            <button id="btn-view-detail-${place.id}" style="margin-top: 6px; width: 100%; background: #f97316; color: white; font-weight: 600; padding: 6px 0; border-radius: 8px; border: none; cursor: pointer; font-size: 12px;">
              查看详细介绍与菜单 →
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: false,
        offset: [0, -10],
      });

      marker.on('click', () => {
        onSelectPlace(place.id);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-view-detail-${place.id}`);
        if (btn) {
          btn.onclick = () => onSelectPlace(place.id);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [places, selectedPlace, onSelectPlace]);

  // Handle Selected Place Fly To
  useEffect(() => {
    if (!mapRef.current || !selectedPlace) return;
    mapRef.current.flyTo([selectedPlace.lat, selectedPlace.lng], 16, {
      animate: true,
      duration: 1.2,
    });
  }, [selectedPlace]);

  // Handle User Location Marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (userLocation) {
      if (!userMarkerRef.current) {
        const userIcon = L.divIcon({
          className: 'user-location-marker',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 22px; height: 22px;">
              <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #38bdf8; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="width: 14px; height: 14px; border-radius: 50%; background: #0284c7; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.5);"></div>
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
          zIndexOffset: 2000,
        }).addTo(mapRef.current);
      } else {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      }
    }
  }, [userLocation]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetCenter = () => {
    mapRef.current?.flyTo([33.6846, -117.8265], 12.5, { duration: 1.2 });
  };

  return (
    <div className="relative w-full h-full flex-1">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        {/* Locate Me Button */}
        <button
          onClick={onRequestLocation}
          className={`p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 shadow-glass text-slate-200 transition-all active:scale-90 ${
            isLocating ? 'text-cyan-400 animate-spin' : ''
          }`}
          title="定位我当前的位置"
        >
          <Locate className="w-5 h-5" />
        </button>

        {/* Reset Irvine Center */}
        <button
          onClick={handleResetCenter}
          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 shadow-glass text-slate-200 transition-all active:scale-90"
          title="重置到尔湾中心视野"
        >
          <Navigation className="w-5 h-5 text-brand-400" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col bg-slate-900/90 rounded-xl border border-slate-700 shadow-glass overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-2.5 hover:bg-slate-800 text-slate-200 border-b border-slate-800 transition-all"
            title="放大地图"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 hover:bg-slate-800 text-slate-200 transition-all"
            title="缩小地图"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Legend (Bottom Right Overlay) */}
      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800/80 text-[11px] text-slate-300 shadow-glass">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>中餐</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
          <span>日料</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>韩餐</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>东南亚</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
          <span>超市</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>甜品</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>新店</span>
        </div>
      </div>
    </div>
  );
};
