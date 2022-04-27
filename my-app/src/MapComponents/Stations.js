import {Marker, Popup} from "react-leaflet";
import React from "react";
import L from "leaflet";

function getStationIcon(_iconSize) {
    return L.icon({
        iconUrl: require("../static/station.png"),
        iconSize: _iconSize,
    });
}

export function Stations(props) {
    return props.stations.map(station =>
        <> {props.show === true &&
            <Marker position={[station.latitude, station.longitude]} icon={getStationIcon(20)}>
                <>{props.popupsEnable === true &&
                    <Popup>
                        <p> Code: {station.code} </p>
                        <p> longitude: {station.longitude} latitude: {station.latitude} </p>
                        <p> elevation: {station.elevation} </p>
                    </Popup>
                }</>
            </Marker>
        }
        </>);
}