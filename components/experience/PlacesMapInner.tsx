"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { PLACES } from "@/lib/data";
import "leaflet/dist/leaflet.css";

const icon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:999px;background:#e8b4b8;box-shadow:0 0 0 6px rgba(232,180,184,0.25),0 0 24px rgba(232,180,184,0.65);border:2px solid rgba(255,255,255,0.7)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function FitBounds({ activeId }: { activeId: string | null }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(PLACES.map((p) => p.position));
    map.fitBounds(bounds.pad(0.25));
  }, [map]);

  useEffect(() => {
    if (!activeId) return;
    const place = PLACES.find((p) => p.id === activeId);
    if (place) map.flyTo(place.position, 10, { duration: 0.8 });
  }, [activeId, map]);

  return null;
}

export default function PlacesMapInner({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <MapContainer
      center={[10.0, -84.5]}
      zoom={7}
      scrollWheelZoom={false}
      className="h-[520px] w-full bg-[#0b0a09] [&_.leaflet-control-attribution]:hidden"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds activeId={activeId} />
      {PLACES.map((place) => (
        <Marker
          key={place.id}
          position={place.position}
          icon={icon}
          eventHandlers={{
            click: () => onSelect(place.id),
          }}
        />
      ))}
    </MapContainer>
  );
}
