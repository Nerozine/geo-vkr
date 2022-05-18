import {MapContainer, ScaleControl, TileLayer} from "react-leaflet";
import LeafletRuler from "../leaflet-ruler/code/LeafletRuler";
import React from "react";
import {GeoEvents} from "./GeoEvents";
import {Stations} from "./Stations";
import {ChangeMapView} from "./ChangeMapCenter";

export function MapComponent(props) {
    console.log(props.center);
    return (
        <MapContainer >
            <ScaleControl imperial={false}/>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoEvents geoEvents={props.geoEvents} popupsEnable={props.popupsEnable}/>
            <Stations show={props.showStations} stations={props.stations} popupsEnable={props.popupsEnable} />
            <LeafletRuler/>
            <ChangeMapView center={props.center}/>
        </MapContainer>
    );
}