import React, { useEffect, useRef, useMemo } from 'react';
import { TravelAdvisory, Supplier } from '../types';
import L from 'leaflet';
import { worldGeoJson } from '../data/world-geojson';

interface InteractiveWorldMapProps {
  advisories: TravelAdvisory[];
  suppliers: Supplier[];
  showSuppliers: boolean;
}

const getLevelColor = (level: number) => {
    switch(level) {
        case 1: return '#60a5fa'; // blue-400
        case 2: return '#facc15'; // yellow-400
        case 3: return '#fb923c'; // orange-400
        case 4: return '#f87171'; // red-400
        default: return '#e5e7eb'; // gray-200
    }
};

// Custom icon for suppliers
const supplierIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #4f46e5; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5]
});


const InteractiveWorldMap: React.FC<InteractiveWorldMapProps> = ({ advisories, suppliers, showSuppliers }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const geoJsonLayer = useRef<L.GeoJSON | null>(null);
    const supplierLayer = useRef<L.LayerGroup | null>(null);

    const advisoryMap = useMemo(() => {
        return new Map(advisories.map(a => [a.country.toLowerCase().trim(), a]));
    }, [advisories]);

    // Initialize map
    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                center: [20, 15],
                zoom: 2,
                zoomControl: true,
                attributionControl: false,
            });

             L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
             }).addTo(mapInstance.current);
             
             supplierLayer.current = L.layerGroup().addTo(mapInstance.current);
        }
    }, []);

    // Update GeoJSON layer for advisories
    useEffect(() => {
        if (!mapInstance.current) return;
        
        if (geoJsonLayer.current) {
            mapInstance.current.removeLayer(geoJsonLayer.current);
        }

        geoJsonLayer.current = L.geoJSON(worldGeoJson as any, {
            style: (feature) => {
                const countryName = feature?.properties.name.toLowerCase().trim();
                const advisory = advisoryMap.get(countryName);
                return {
                    fillColor: advisory ? getLevelColor(advisory.level) : '#f1f5f9', // slate-100
                    weight: 1,
                    opacity: 1,
                    color: '#cbd5e1', // slate-300
                    fillOpacity: 0.7
                };
            },
            onEachFeature: (feature, layer) => {
                const countryName = feature.properties.name;
                const advisory = advisoryMap.get(countryName.toLowerCase().trim());
                if (advisory) {
                    const popupContent = `
                        <div class="font-sans">
                            <h4 class="font-bold text-base border-b border-slate-200 pb-1 mb-1">${advisory.country}</h4>
                            <p class="text-sm"><span class="font-semibold">Level ${advisory.level}:</span> ${advisory.details.split('.')[0]}</p>
                            <p class="text-xs text-slate-500 mt-2">Updated: ${advisory.lastUpdated}</p>
                        </div>
                    `;
                    layer.bindTooltip(popupContent);
                }
            }
        }).addTo(mapInstance.current);

    }, [advisories, advisoryMap]);

    // Update supplier markers
    useEffect(() => {
        if (!supplierLayer.current) return;
        
        supplierLayer.current.clearLayers();

        if (showSuppliers) {
            suppliers.forEach(supplier => {
                if (supplier.lat && supplier.lon) {
                    const marker = L.marker([supplier.lat, supplier.lon], { icon: supplierIcon });
                    const popupContent = `
                        <div class="font-sans">
                            <h4 class="font-bold text-base border-b border-slate-200 pb-1 mb-1">${supplier.companyName}</h4>
                            <p class="text-sm">${supplier.address}, ${supplier.city}, ${supplier.province || ''}</p>
                            <p class="text-sm">${supplier.country}</p>
                            <p class="text-xs text-slate-500 mt-2">CAGE: ${supplier.cageCode}</p>
                        </div>
                    `;
                    marker.bindPopup(popupContent);
                    supplierLayer.current?.addLayer(marker);
                }
            });
        }
    }, [suppliers, showSuppliers]);


    return (
      <div className="w-full h-full relative">
        <div id="map" ref={mapRef} className="w-full h-full rounded-lg" />
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md leaflet-control z-[1000]">
            <h4 className="font-bold text-sm mb-2">Advisory Level Legend</h4>
            <div className="space-y-1 text-xs">
                <div className="flex items-center"><div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: getLevelColor(1)}}></div>Level 1</div>
                <div className="flex items-center"><div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: getLevelColor(2)}}></div>Level 2</div>
                <div className="flex items-center"><div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: getLevelColor(3)}}></div>Level 3</div>
                <div className="flex items-center"><div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: getLevelColor(4)}}></div>Level 4</div>
            </div>
        </div>
      </div>
    );
};

export default InteractiveWorldMap;