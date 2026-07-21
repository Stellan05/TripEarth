/**
 * 地理计算工具
 */

interface LatLng {
  lat: number
  lng: number
}

/** 大圆插值 — 两点之间生成 N 个点（用于飞行弧线） */
export function greatCircleInterpolation(
  from: LatLng,
  to: LatLng,
  numPoints: number,
): LatLng[] {
  const points: LatLng[] = []
  const toRad = (d: number) => (d * Math.PI) / 180
  const toDeg = (r: number) => (r * 180) / Math.PI

  const lat1 = toRad(from.lat)
  const lng1 = toRad(from.lng)
  const lat2 = toRad(to.lat)
  const lng2 = toRad(to.lng)

  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints
    const d =
      2 *
      Math.asin(
        Math.sqrt(
          Math.sin((lat2 - lat1) / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin((lng2 - lng1) / 2) ** 2,
        ),
      )
    const A = Math.sin((1 - f) * d) / Math.sin(d)
    const B = Math.sin(f * d) / Math.sin(d)
    const x =
      A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2)
    const y =
      A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2)
    const z = A * Math.sin(lat1) + B * Math.sin(lat2)

    points.push({
      lat: toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))),
      lng: toDeg(Math.atan2(y, x)),
    })
  }

  return points
}

/** 获取一组坐标的边界框中心 */
export function bboxCenter(points: LatLng[]): LatLng {
  if (points.length === 0) return { lat: 0, lng: 0 }
  const sum = points.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 },
  )
  return { lat: sum.lat / points.length, lng: sum.lng / points.length }
}
