import L from "leaflet";
import React, {useEffect, useState} from "react";
import {MapComponent} from "./MapComponents/MapComponent";
import DateTimePicker from "react-datetime-picker";
import {NewlineText} from "./MapComponents/DebugComponents";
import {getGeoEvents, getNetworks, getStations} from "./utility/queries";
import AsyncSelect from "react-select/async";
import "./index.css";
import {getDistance} from "./utility/map_distance";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

export function App() {
    const [center, setCenter] = useState({
        lat: 52.298415,
        lng: 53.708968,
        zoom: 7,
    });
    const [geoEvents, setGeoEvents] = useState([]);
    const [stations, setStations] = useState([]);
    const [startTime, startTimeOnChange] = useState(new Date('2021-10-01T00:00:00'));
    const [endTime, endTimeOnChange] = useState(new Date('2021-10-31T23:59:59'));
    const [popupsInteractivity, setPopupsInteractivity] = useState(true);
    const [showStations, setShowStations] = useState(true);
    const [selectedNetwork, setSelectedNetwork] = useState(null);

    useEffect(() => getStations("", setStations), []);
    useEffect(() => setSelectedNetwork(getNetworks()), []);


    function handleClickGetInfo() {
        getGeoEvents(startTime, endTime, document.getElementById("events_limit").value)
            .then(result => setGeoEvents(result));
    }

    function updateCenter(selectedNetwork) {
        // find 2 most far events
        let maxDistance = 0;
        let mostFarObjectsIndexes = [];
        let selectedNetworkObjects = geoEvents.concat(stations);
        for (let i = 0; i < selectedNetworkObjects.length; i++) {
            if (selectedNetworkObjects[i].networkCode !== selectedNetwork.label) {
                continue;
            }

            for (let j = i + 1; j < selectedNetworkObjects.length; j++) {
                if (selectedNetworkObjects[j].networkCode !== selectedNetwork.label) {
                    continue;
                }

                let distance = getDistance(selectedNetworkObjects[i].latitude, selectedNetworkObjects[i].longitude,
                    selectedNetworkObjects[j].latitude, selectedNetworkObjects[i].longitude);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    mostFarObjectsIndexes = [i, j];
                }
            }
        }

        // find optimal zoom
        const R = 6371; // Radius of the earth in km
        console.log(R / maxDistance);
        let optimalZoom = Math.trunc(Math.log2(R / maxDistance)) + 1;
        console.log(optimalZoom);

        let optimalLatitude = (+selectedNetworkObjects[mostFarObjectsIndexes[0]].latitude +
            +selectedNetworkObjects[mostFarObjectsIndexes[1]].latitude) / 2;
        let optimalLongitude = (+selectedNetworkObjects[mostFarObjectsIndexes[0]].longitude +
            +selectedNetworkObjects[mostFarObjectsIndexes[1]].longitude) / 2;

        setCenter({
            lat: optimalLatitude,
            lng: optimalLongitude,
            zoom: optimalZoom,
        });
    }

    const handleChangeSelect = (selectedNetwork) => {
        console.log("selected network is " + selectedNetwork.value);
        setSelectedNetwork(selectedNetwork);
        updateCenter(selectedNetwork);
    };

    return (
        <div>
            <MapComponent center={center}
                          geoEvents={geoEvents}
                          stations={stations}
                          popupsEnable={popupsInteractivity}
                          showStations={showStations}/>
            <div>
                <p>
                    <input type="checkbox" id="popupsInteractivity" name="popupsInteractivity"
                           onChange={() => setPopupsInteractivity(!popupsInteractivity)}/>
                    <label htmlFor="popupsInteractivity">Disable pop-ups interactivity</label>
                    <input type="checkbox" id="showStations" name="showStations"
                           onChange={() => setShowStations(!showStations)}/>
                    <label htmlFor="showStations">Hide stations</label>
                    <div className="select_network">
                        <AsyncSelect
                                 onChange={handleChangeSelect}
                                 value={selectedNetwork}
                                 cacheOptions
                                 defaultOptions
                                 loadOptions={getNetworks} />
                    </div>
                </p>
                <p> events limit: <input type="number" id="events_limit" name="events_limit" min="1" max="300" defaultValue={10} /> </p>
                <p> start time: <DateTimePicker maxDetail="second"  value={startTime} onChange={startTimeOnChange} /> </p>
                <p> end time: <DateTimePicker maxDetail="second"  value={endTime} onChange={endTimeOnChange} /> </p>
                <p> <button onClick={handleClickGetInfo}> get info </button> </p>
                <NewlineText items={geoEvents} />
            </div>
        </div>
    );
}