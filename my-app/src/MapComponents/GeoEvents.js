import {Marker, Popup} from "react-leaflet";
import React from "react";
import L from "leaflet";

export function getIcon(_iconSize) {
    return L.icon({
        iconUrl: require("../static/earthquake_icon.png"),
        iconSize: _iconSize,
    });
}

export function GeoEvents(props) {
    return props.geoEvents.map(geoEvent =>
        <Marker position={[geoEvent.latitude, geoEvent.longitude]} icon={getIcon(20)}>
            <>{ props.popupsEnable === true &&
                <Popup>
                    <p> Event type: {geoEvent.type} </p>
                    <p> Date: {geoEvent.time} </p>
                    <p> Magnitude: {geoEvent.magnitude}({geoEvent.magnitudeType}) </p>
                    <p> longitude: {geoEvent.longitude} latitude: {geoEvent.latitude} </p>
                    <p> Depth: {geoEvent.depth}({geoEvent.depthType}, uncertainty: {geoEvent.depthUncertainty}) </p>
                </Popup>
            }</>
        </Marker>);
}