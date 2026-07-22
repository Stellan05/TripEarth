/**
 * useMap — Leaflet 地图生命周期 composable
 *
 * 职责：
 *   - 初始化 Leaflet 地图（含瓦片主题）
 *   - 提供便捷方法：fitToBounds、addMarker、addPolyline
 *   - 主题切换（深色/浅色瓦片）
 *   - 组件卸载时自动释放地图实例
 */
import { ref, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export function useMap() {
  const map = ref<L.Map | null>(null)
  const containerRef = ref<HTMLElement | null>(null)

  function init(options?: { dark?: boolean; scrollWheelZoom?: boolean }): L.Map | null {
    if (!containerRef.value) return null

    const isDark = options?.dark ?? document.body.getAttribute('data-theme') === 'dark'

    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

    map.value = L.map(containerRef.value, {
      zoomControl: true,
      scrollWheelZoom: options?.scrollWheelZoom ?? true,
      minZoom: 2,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0,
    }).setView([20, 0], 2)

    L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
      noWrap: true,
    }).addTo(map.value)

    return map.value
  }

  function fitToBounds(latlngs: [number, number][], padding = 50) {
    if (!map.value || !latlngs.length) return
    map.value.fitBounds(
      latlngs.map((l) => L.latLng(l[0], l[1])),
      { padding: [padding, padding] },
    )
  }

  function destroy() {
    if (map.value) {
      map.value.remove()
      map.value = null
    }
  }

  function addMarker(
    lat: number,
    lng: number,
    options?: { color?: string; pulse?: boolean; label?: string },
  ): L.Marker | null {
    if (!map.value) return null

    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="width:12px;height:12px;border-radius:50%;background:${options?.color || '#E8714A'};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);${options?.pulse ? 'animation:pulse-marker 2s ease-in-out infinite;' : ''}"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    })

    const marker = L.marker([lat, lng], { icon }).addTo(map.value)
    if (options?.label) {
      marker.bindTooltip(options.label, { direction: 'top', offset: L.point(0, -8) })
    }
    return marker
  }

  function addPolyline(
    latlngs: [number, number][],
    options?: { color?: string; weight?: number; dashArray?: string },
  ) {
    if (!map.value) return null
    return L.polyline(latlngs, {
      color: options?.color || '#3B7EC7',
      weight: options?.weight || 2,
      dashArray: options?.dashArray,
      opacity: 0.8,
    }).addTo(map.value)
  }

  function setTileTheme(dark: boolean) {
    if (!map.value) return

    const tiles: L.TileLayer[] = []
    map.value.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) tiles.push(layer)
    })
    tiles.forEach((t) => t.remove())

    const tileUrl = dark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

    L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
      noWrap: true,
    }).addTo(map.value)
  }

  onUnmounted(destroy)

  return { map, containerRef, init, destroy, fitToBounds, addMarker, addPolyline, setTileTheme }
}
