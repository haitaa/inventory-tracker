"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OrderStatusEnum } from "@/types/schema";

// SSR sırasında Leaflet marker ikonlarıyla ilgili sorunu çözmek için
// Bu işlem sadece client tarafında çalışmalı
const getMarkerIcon = (iconType: string) => {
  // Leaflet'in varsayılan ikonlarıyla ilgili sorunu çöz
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });

  // İkon tipine göre farklı renkli marker
  if (iconType === "destination") {
    return new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  } else if (iconType === "transit") {
    return new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  } else {
    return new L.Icon.Default();
  }
};

// Adres metninden koordinat alma simülasyonu
// Gerçek bir uygulamada burada geocoding API kullanılır (Google Maps, Mapbox, vb.)
const getCoordinates = (address: string) => {
  // Basit bir koordinat oluşturma simülasyonu
  // Gerçek uygulamada burada adres metni koordinata çevrilir

  // İstanbul içinde rastgele konumlar üret (örnek amaçlı)
  const istanbulCenter = [41.0082, 28.9784]; // İstanbul merkez koordinatları

  // Rastgele ofset ekleyelim (gerçekçilik için)
  const randomOffset = () => (Math.random() - 0.5) * 0.1;

  return {
    lat: istanbulCenter[0] + randomOffset(),
    lng: istanbulCenter[1] + randomOffset(),
  };
};

// Teslimat aşamasına göre simüle edilmiş konumlar üretme
const generateDeliveryRoute = (
  destination: { lat: number; lng: number },
  orderStatus: OrderStatusEnum
) => {
  // İstanbul'da bir dağıtım merkezinden başlayalım
  const startPoint = { lat: 41.0377, lng: 28.9251 }; // Atatürk Havalimanı bölgesi

  // Teslimat rotası için ara noktalar
  const points = [];

  // Başlangıç noktasını ekle
  points.push(startPoint);

  // Sipariş durumuna göre ara noktalar ekle
  if (orderStatus === "SHIPPED" || orderStatus === "DELIVERED") {
    // Birkaç ara nokta ekle
    points.push({ lat: 41.0278, lng: 28.9503 }); // 1. transfer merkezi

    if (orderStatus === "DELIVERED") {
      // Daha fazla ara nokta ekle
      points.push({ lat: 41.0187, lng: 28.9639 }); // 2. transfer merkezi
      points.push({
        lat: destination.lat - 0.005,
        lng: destination.lng - 0.007,
      }); // Teslimat bölgesine yakın
      points.push(destination); // Varış noktası
    }
  }

  return points;
};

interface DeliveryMapProps {
  address: string;
  carrierName: string;
  orderStatus: OrderStatusEnum;
}

export default function DeliveryMap({
  address,
  carrierName,
  orderStatus,
}: DeliveryMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [destination, setDestination] = useState({
    lat: 41.0082,
    lng: 28.9784,
  });
  const [currentPosition, setCurrentPosition] = useState({
    lat: 41.0082,
    lng: 28.9784,
  });
  const [routePoints, setRoutePoints] = useState<
    Array<{ lat: number; lng: number }>
  >([]);

  useEffect(() => {
    // CSR olduğundan emin olalım
    setIsClient(true);

    // Teslimat adresinden koordinat elde et
    const destCoords = getCoordinates(address);
    setDestination(destCoords);

    // Teslimat rotası oluştur
    const route = generateDeliveryRoute(destCoords, orderStatus);
    setRoutePoints(route);

    // Sipariş durumuna göre kargonun şu anki konumunu belirle
    const currentPos = route[route.length > 1 ? route.length - 2 : 0];
    setCurrentPosition(currentPos);
  }, [address, orderStatus]);

  // Server-side rendering sırasında haritayı gösterme
  if (!isClient) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p className="text-muted-foreground">Harita yükleniyor...</p>
      </div>
    );
  }

  // Harita merkezi, gösterilecek konumların ortalaması olsun
  const center = {
    lat: (destination.lat + routePoints[0].lat) / 2,
    lng: (destination.lng + routePoints[0].lng) / 2,
  };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Teslimat noktası */}
      <Marker
        position={[destination.lat, destination.lng]}
        icon={getMarkerIcon("destination")}
      >
        <Popup>
          <strong>Teslimat Adresi</strong>
          <br />
          {address}
        </Popup>
      </Marker>

      {/* Kargonun şu anki konumu (eğer teslimat başladıysa) */}
      {(orderStatus === "SHIPPED" || orderStatus === "DELIVERED") && (
        <Marker
          position={[currentPosition.lat, currentPosition.lng]}
          icon={getMarkerIcon("transit")}
        >
          <Popup>
            <strong>{carrierName}</strong>
            <br />
            Son Konum: {new Date().toLocaleTimeString("tr-TR")}
          </Popup>
        </Marker>
      )}

      {/* Kargo rotası */}
      {routePoints.length > 1 && (
        <Polyline
          positions={routePoints.map((point) => [point.lat, point.lng])}
          color="#3388ff"
          weight={3}
          opacity={0.7}
          dashArray={orderStatus === "DELIVERED" ? "" : "5, 10"}
        />
      )}
    </MapContainer>
  );
}
