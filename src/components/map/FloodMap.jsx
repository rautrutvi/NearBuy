import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { Store, AlertTriangle, ShieldCheck, Phone, Navigation } from 'lucide-react'

// Fix default Leaflet marker icon paths for React
import iconMarker from 'leaflet/dist/images/marker-icon.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const customShopIcon = L.icon({
  iconUrl: iconMarker,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export const FloodMap = ({ shops = [], floodReports = [], userLocation = { lat: 19.076, lng: 72.8777 } }) => {
  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-soft border border-slate-200 relative">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={customShopIcon}>
          <Popup>
            <div className="p-1 text-center font-sans">
              <span className="text-xs font-bold text-primary-600 block">📍 You are Here</span>
              <span className="text-[11px] text-slate-500">Current Hyperlocal Radius</span>
            </div>
          </Popup>
        </Marker>

        {/* Shop Markers */}
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            position={[shop.location.lat, shop.location.lng]}
            icon={customShopIcon}
          >
            <Popup>
              <div className="p-2 space-y-2 font-sans max-w-[200px]">
                <div className="flex items-center gap-1">
                  <Store className="w-4 h-4 text-primary-500" />
                  <h4 className="font-bold text-xs text-slate-800 font-display">{shop.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500">{shop.address}</p>

                <div className="flex items-center justify-between text-[11px] border-t border-slate-100 pt-1.5">
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> {shop.distanceKm} km away
                  </span>
                  <span className="font-semibold text-slate-700">★ {shop.rating}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Flood Waterlogging Hazard Radius Circles */}
        {floodReports.map((report) => (
          <React.Fragment key={report.id}>
            <Circle
              center={[report.location.lat, report.location.lng]}
              radius={350}
              pathOptions={{
                color: report.severity === 'alert' ? '#EF4444' : '#F59E0B',
                fillColor: report.severity === 'alert' ? '#EF4444' : '#F59E0B',
                fillOpacity: 0.25,
              }}
            />
            <Marker position={[report.location.lat, report.location.lng]} icon={customShopIcon}>
              <Popup>
                <div className="p-2 space-y-1.5 font-sans">
                  <div className="flex items-center gap-1 text-rose-600 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{report.areaName}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Water depth: <strong className="text-slate-900">{report.waterDepthCm} cm</strong>
                  </p>
                  <p className="text-[10px] text-slate-500 bg-rose-50 p-1.5 rounded text-rose-800 font-medium">
                    Detour: {report.safeDetour}
                  </p>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lift border border-slate-200 text-xs space-y-1.5 pointer-events-auto">
        <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider font-display">Monsoon Radar Legend</span>
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Nearby Shop
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate Waterlogging
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Severe Flood Warning Zone
        </div>
      </div>
    </div>
  )
}
