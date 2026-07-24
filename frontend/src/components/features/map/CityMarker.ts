/**
 * CityMarker — Leaflet DivIcon 城市标记工厂
 *
 * 提供：
 *   - createCityMarker()     — 通用城市点标记（DivIcon）
 *   - createCityLabelMarker() — 带 Tooltip 的完整 Marker
 */
import L from 'leaflet'

export interface CityMarkerOptions {
  color?: string
  pulse?: boolean
  size?: number
  label?: string
}

export function createCityMarker(options: CityMarkerOptions = {}): L.DivIcon {
  const color = options.color || '#E8714A'
  const size = options.size || 12
  const pulseAnim = options.pulse ? 'animation:pulse-marker 2s ease-in-out infinite;' : ''

  const html = `<div style="
    width:${size}px;height:${size}px;
    border-radius:50%;
    background:${color};
    border:2px solid white;
    box-shadow:0 1px 4px rgba(0,0,0,0.3);
    ${pulseAnim}
  "></div>`

  return L.divIcon({
    className: 'city-marker',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export function createCityLabelMarker(
  lat: number,
  lng: number,
  name: string,
  options?: { color?: string; visited?: boolean; size?: number },
): L.Marker {
  const color = options?.color || (options?.visited ? '#E8714A' : '#4A9C7C')
  const size = options?.size || 12

  const marker = L.marker([lat, lng], {
    icon: createCityMarker({ color, pulse: false, size }),
  })

  marker.bindTooltip(name, { direction: 'top', offset: L.point(0, -10) })
  return marker
}
