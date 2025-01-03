/**
 * 두 지점 간의 거리를 계산합니다 (Haversine formula)
 * @returns 거리 (미터 단위)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // 지구의 반경 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 거리를 사용자 친화적인 문자열로 변환합니다
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * 도보 예상 시간을 계산합니다 (평균 도보 속도: 4km/h)
 */
export function calculateWalkingTime(meters: number): string {
  const minutes = Math.round((meters / 1000) * (60 / 4)); // 4km/h 기준
  if (minutes < 60) {
    return `도보 ${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `도보 ${hours}시간 ${remainingMinutes}분`;
} 