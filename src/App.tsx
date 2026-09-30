import React, { useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { usePlacesData } from './hooks/usePlacesData';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { SidebarList } from './components/SidebarList';
import { MapView } from './components/MapView';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { WebSyncModal } from './components/WebSyncModal';
import { PlazaGuideModal } from './components/PlazaGuideModal';
import { RandomWheelModal } from './components/RandomWheelModal';
import { AddPlaceModal } from './components/AddPlaceModal';
import { Map, List, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export function App() {
  const { location, loading: isLocating, requestLocation } = useGeolocation();
  const {
    places,
    filteredPlaces,
    favorites,
    selectedPlace,
    selectedPlaceId,
    filters,
    setFilters,
    setSelectedPlaceId,
    toggleFavorite,
    addPlace,
    mergePlaces,
    resetToDefault,
  } = usePlacesData(location);

  // UI state
  const [mapStyle, setMapStyle] = useState<'dark' | 'light' | 'voyager'>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMapView, setIsMobileMapView] = useState(true);

  // Modals
  const [isWebSyncOpen, setIsWebSyncOpen] = useState(false);
  const [isPlazaGuideOpen, setIsPlazaGuideOpen] = useState(false);
  const [isRandomWheelOpen, setIsRandomWheelOpen] = useState(false);
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);

  const handleSelectPlaza = (plazaId: string) => {
    setFilters((prev) => ({
      ...prev,
      plazaId,
      searchQuery: '',
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      city: 'All',
      category: 'All',
      subcategory: 'All',
      plazaId: 'All',
      priceLevel: 'All',
      tags: [],
      status: 'All',
      onlyFavorites: false,
      sortBy: 'recommended',
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* 1. Header Navbar */}
      <Navbar
        currentCity={filters.city}
        onSelectCity={(city) => setFilters((prev) => ({ ...prev, city }))}
        onOpenWebSync={() => setIsWebSyncOpen(true)}
        onOpenRandomWheel={() => setIsRandomWheelOpen(true)}
        onOpenPlazaGuide={() => setIsPlazaGuideOpen(true)}
        onOpenAddPlace={() => setIsAddPlaceOpen(true)}
        favoritesCount={favorites.length}
        onlyFavorites={filters.onlyFavorites}
        onToggleFavoritesOnly={() =>
          setFilters((prev) => ({ ...prev, onlyFavorites: !prev.onlyFavorites }))
        }
        totalPlacesCount={places.length}
        mapStyle={mapStyle}
        onChangeMapStyle={setMapStyle}
      />

      {/* 2. Quick Filter Bar */}
      <FilterBar
        filters={filters}
        onUpdateFilters={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Main Workspace: Map & Sidebar */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Toggle Tab */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden md:flex absolute top-4 z-30 items-center justify-center w-7 h-9 rounded-r-xl bg-slate-900/90 border-y border-r border-slate-700/80 text-slate-400 hover:text-white shadow-md transition-all"
          style={{ left: isSidebarOpen ? '420px' : '0px' }}
          title={isSidebarOpen ? '折叠列表' : '展开列表'}
        >
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>

        {/* Sidebar Cards List */}
        <div
          className={`${
            isMobileMapView ? 'hidden md:flex' : 'flex'
          } h-full z-20`}
        >
          <SidebarList
            places={filteredPlaces}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={(id) => {
              setSelectedPlaceId(id);
              // On mobile, switch to map view when card is clicked
              if (window.innerWidth < 768) {
                setIsMobileMapView(true);
              }
            }}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            filters={filters}
            onUpdateFilters={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
            userLocation={location}
            isOpen={isSidebarOpen}
            onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        {/* Map View */}
        <div
          className={`${
            !isMobileMapView ? 'hidden md:flex' : 'flex'
          } flex-1 h-full relative`}
        >
          <MapView
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={setSelectedPlaceId}
            userLocation={location}
            onRequestLocation={requestLocation}
            isLocating={isLocating}
            mapStyle={mapStyle}
            onSelectPlaza={handleSelectPlaza}
            hasActiveFilter={Boolean(
              filters.searchQuery.trim() || 
              filters.category !== 'All' || 
              filters.plazaId !== 'All' || 
              filters.priceLevel !== 'All' || 
              filters.tags.length > 0 ||
              filters.onlyFavorites
            )}
          />

        </div>
      </div>

      {/* 4. Mobile Floating Toggle Bar (Switch between Map & List) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-full p-1 shadow-2xl">
        <button
          onClick={() => setIsMobileMapView(true)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            isMobileMapView
              ? 'bg-brand-500 text-white shadow-glow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>地图模式</span>
        </button>
        <button
          onClick={() => setIsMobileMapView(false)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            !isMobileMapView
              ? 'bg-brand-500 text-white shadow-glow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <List className="w-4 h-4" />
          <span>列表模式 ({filteredPlaces.length})</span>
        </button>
      </div>

      {/* 5. Modals */}
      {/* Store Detail Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlaceId(null)}
        isFavorite={selectedPlace ? favorites.includes(selectedPlace.id) : false}
        onToggleFavorite={toggleFavorite}
        onSelectPlaza={handleSelectPlaza}
      />

      {/* Web Sync Modal */}
      <WebSyncModal
        isOpen={isWebSyncOpen}
        onClose={() => setIsWebSyncOpen(false)}
        onMergePlaces={mergePlaces}
        onResetToDefault={resetToDefault}
        totalExistingPlaces={places.length}
      />

      {/* Plaza Guide Modal */}
      <PlazaGuideModal
        isOpen={isPlazaGuideOpen}
        onClose={() => setIsPlazaGuideOpen(false)}
        onSelectPlaza={handleSelectPlaza}
      />

      {/* Random Food Wheel */}
      <RandomWheelModal
        isOpen={isRandomWheelOpen}
        onClose={() => setIsRandomWheelOpen(false)}
        places={filteredPlaces.length > 0 ? filteredPlaces : places}
        onSelectPlace={setSelectedPlaceId}
      />

      {/* Add Place Modal */}
      <AddPlaceModal
        isOpen={isAddPlaceOpen}
        onClose={() => setIsAddPlaceOpen(false)}
        onAddPlace={addPlace}
      />
    </div>
  );
}

export default App;
