import {MapContainer, ScaleControl, TileLayer} from "react-leaflet";
import LeafletRuler from "../leaflet-ruler/code/LeafletRuler";
import React from "react";
import {GeoEvents} from "./GeoEvents";

export function MapComponent(props) {
    let center = {
        lat: 52.298415,
        lng: 53.708968,
        zoom: 7,
    };

    return (
        <MapContainer zoom={center.zoom} center={[center.lat, center.lng]}>
            <ScaleControl imperial={false}/>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoEvents geoEvents={props.geoEvents} popupsEnable={props.popupsEnable}/>
            <LeafletRuler/>
        </MapContainer>
    );
}