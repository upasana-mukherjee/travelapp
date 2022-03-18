import React, {useEffect} from "react";
import "leaflet/dist/leaflet.css";
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css';
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import * as ELG from "esri-leaflet-geocoder";
import L from 'leaflet';

function MyMap() {
function Geocoder() {
   const map = useMap();
   //console.log('map'+map);

   async function getLocations(){
      const response = await fetch('https://data.sfgov.org/resource/yitu-d5am.json', 
      {method: 'GET',
      headers: {
        'Content-Type': 'application/json'
              } 
      }
      );  
      const data = await response.json();
  
      console.log(data);
      for(var i = 0; i < data.length; i++){
          var filmLocation = data[i].locations;
          //console.log(filmLocation);
          const geoLocation = 
           ELG.geocode({apikey: 'AAPK12a2d2da3b5e4df0a52bf6fab6c5140beY7baK2htc4Ae-ENA7_72PyWDAC6po1rpl-pVZHvl3EnM46HAjcUvYcDhd06rcDg'})
          .text(filmLocation);
          //console.log(geoLocation);
           geoLocation.run((err, results, response) => {
          //  console.log(results);
            if (err) {
           //   console.log(err);
              return;
            }
            const { lat, lng } = results?.results[0].latlng;
            map.setView([lat, lng], 13);
          });
      }
     
    }
    getLocations();

   
   const searchControl = ELG.geosearch({
  position: "topright",
  placeholder: "Enter an address or place e.g. 1 York St",
  useMapBounds: false,
  providers: [
    ELG.arcgisOnlineProvider({
      apikey: 'AAPK12a2d2da3b5e4df0a52bf6fab6c5140beY7baK2htc4Ae-ENA7_72PyWDAC6po1rpl-pVZHvl3EnM46HAjcUvYcDhd06rcDg'
    })
  ]
}).addTo(map);

   const results = L.layerGroup().addTo(map);
  
    searchControl.on("results", (data) => {
      results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
        const lngLatString = `${Math.round(data.results[i].latlng.lng * 100000) / 100000}, ${
          Math.round(data.results[i].latlng.lat * 100000) / 100000
        }`;
        const marker = L.marker(data.results[i].latlng);
        marker.bindPopup(`<b>${lngLatString}</b><p>${data.results[i].properties.LongLabel}</p>`);
        results.addLayer(marker);
        marker.openPopup();
      }
    });

   return null;
  }

  const position = [53.35, 18.8];
  return (
    <MapContainer
      className="map"
      center={position}
      zoom={6}
      style={{ height: 500, width: "100%" }}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    <Geocoder/>
    </MapContainer>
  );
}
export default MyMap;

