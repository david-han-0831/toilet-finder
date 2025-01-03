export interface ToiletData {
  id: string;
  latitude: number;
  longitude: number;
  strasse: string;  // 도로명
  hsNr: string;     // 번지수
  plz: string;      // 우편번호
  ort: string;      // 도시명
  anmerkung: string; // 독일어 설명
  한국어?: string;    // 한국어 설명 추가
  distance?: number;  // 현재 위치로부터의 거리
  walkingTime?: string;  // 도보 예상 시간
}

export interface ToiletMarker {
  id: string;
  position: google.maps.LatLngLiteral;
  data: ToiletData;
} 