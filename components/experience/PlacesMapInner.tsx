"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import type { Marker as LeafletMarker } from "leaflet";
import { PLACES } from "@/lib/data";
import "leaflet/dist/leaflet.css";

function makeIcon(name: string, active: boolean) {
  return L.divIcon({
    className: "place-marker-wrap",
    html: `
      <div class="place-marker ${active ? "is-active" : ""}">
        <span class="place-dot"></span>
        <span class="place-label">${name}</span>
      </div>
    `,
    iconSize: [140, 48],
    iconAnchor: [70, 12],
    popupAnchor: [0, -8],
  });
}

function MapController({
  activeId,
  onClear,
}: {
  activeId: string | null;
  onClear: () => void;
}) {
  const map = useMap();

  useMapEvents({
    click: () => onClear(),
  });

  useEffect(() => {
    const bounds = L.latLngBounds(PLACES.map((p) => p.position));
    if (!activeId) {
      map.flyToBounds(bounds.pad(0.28), { duration: 0.7, maxZoom: 8 });
      return;
    }
    const place = PLACES.find((p) => p.id === activeId);
    if (place) map.flyTo(place.position, 9, { duration: 0.65 });
  }, [activeId, map]);

  return null;
}

function PlaceMarker({
  place,
  active,
  onSelect,
  onClear,
}: {
  place: (typeof PLACES)[number];
  active: boolean;
  onSelect: (id: string) => void;
  onClear: () => void;
}) {
  const markerRef = useRef<LeafletMarker | null>(null);
  const icon = useMemo(
    () => makeIcon(place.name, active),
    [place.name, active],
  );

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    if (active) marker.openPopup();
    else marker.closePopup();
  }, [active]);

  return (
    <Marker
      ref={markerRef}
      position={place.position}
      icon={icon}
      eventHandlers={{
        click: (e) => {
          L.DomEvent.stopPropagation(e.originalEvent);
          onSelect(place.id);
        },
      }}
    >
      <Popup
        autoPan
        closeButton
        className="place-popup"
        eventHandlers={{
          remove: () => {
            if (active) onClear();
          },
        }}
      >
        <div className="place-popup-body">
          <p className="place-popup-title">{place.name}</p>
          <p className="place-popup-text">{place.description}</p>
        </div>
      </Popup>
    </Marker>
  );
}

export default function PlacesMapInner({
  activeId,
  onSelect,
  onClear,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <MapContainer
      center={[10.0, -84.5]}
      zoom={7}
      scrollWheelZoom={false}
      className="h-[300px] w-full bg-[#0b0a09] sm:h-[420px] md:h-[560px] [&_.leaflet-control-attribution]:hidden"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapController activeId={activeId} onClear={onClear} />
      {PLACES.map((place) => (
        <PlaceMarker
          key={place.id}
          place={place}
          active={activeId === place.id}
          onSelect={onSelect}
          onClear={onClear}
        />
      ))}
    </MapContainer>
  );
}
