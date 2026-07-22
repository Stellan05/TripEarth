/**
 * RouteLine — Leaflet Polyline 路线段工厂
 *
 * 根据交通方式自动选择颜色和虚线样式：
 *   - FLIGHT → 实线，ocean 蓝色
 *   - TRAIN  → 虚线（8,4），forest 绿色
 *   - CAR    → 虚线（4,6），textTertiary 灰色
 *   - OTHER  → 点线（2,4），textTertiary 灰色
 */
import L from 'leaflet'
import type { TransportType } from '@/types/common'
import { ROUTE_COLORS } from '@/utils/colors'

export interface RouteLineOptions {
  transportType: TransportType
  active?: boolean
}

export function createRouteLine(
  fromLatLng: [number, number],
  toLatLng: [number, number],
  options: RouteLineOptions = { transportType: 'FLIGHT' },
): L.Polyline {
  const color = ROUTE_COLORS[options.transportType] || '#999CA6'

  let dashArray: string | undefined
  let weight = 2

  switch (options.transportType) {
    case 'FLIGHT':
      dashArray = undefined
      weight = 2
      break
    case 'TRAIN':
      dashArray = '8, 4'
      weight = 2
      break
    case 'CAR':
      dashArray = '4, 6'
      weight = 1.5
      break
    default:
      dashArray = '2, 4'
      weight = 1
  }

  const polyline = L.polyline([fromLatLng, toLatLng], {
    color,
    weight: options.active ? weight + 2 : weight,
    dashArray,
    opacity: 0.8,
  })

  return polyline
}
