import L from "leaflet";
import React, {useState} from "react";
import {convertDate} from "./utility/date_work";
import {MapComponent} from "./MapComponents/MapComponent";
import DateTimePicker from "react-datetime-picker";
import {NewlineText} from "./MapComponents/DebugComponents";
import {parseEvents} from "./utility/query_parse";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

export function App() {
    const serverUrl = "http://84.237.89.72:8080/fdsnws/";
    // const serverUrl = "https://service.iris.edu/fdsnws/";
    const [geoEvents, setGeoEvents] = useState([]);
    const [startTime, startTimeOnChange] = useState(new Date('2021-10-01T00:00:00'));
    const [endTime, endTimeOnChange] = useState(new Date('2021-10-31T23:59:59'));

    function handleClick() {
        const stTime = convertDate(startTime);
        const enTime = convertDate(endTime);
        /*const minLatitude = "-90.0";
        const maxLatitude = "90.0";
        const minLongitude = -180.0;
        const maxLongitude = 108.0;*/
        const limit = document.getElementById("events_limit").value;

        if (startTime < endTime) {
            let query = serverUrl + `event/1/query?starttime=${stTime}&endtime=${enTime}` +
                `&limit=${limit}`;

            console.log(query);

            fetch(query)
                .then(response => {
                    console.log(response);
                    if (response.status !== 200) {
                        setGeoEvents(()=> []);
                        console.log("bad response code: " + response.status);
                        let error = new Error(response.statusText);
                        error.response = response;
                        throw error;
                    } else {
                        return response.text();
                    }
                })
                .then(data => {
                    setGeoEvents(()=> parseEvents(data));
                })
                .catch((e) => {
                    console.log("Error " + e.message);
                    console.log(e.response);
                });

        } else {
            console.log("error, start date >= end time");
        }
    }

    return (
        <div>
            <MapComponent geoEvents={geoEvents}/>
            <div>
                <p> events limit: <input type="number" id="events_limit" name="events_limit" min="1" max="300" defaultValue={10} /> </p>
                <p> start time: <DateTimePicker maxDetail="second"  value={startTime} onChange={startTimeOnChange} /> </p>
                <p> end time: <DateTimePicker maxDetail="second"  value={endTime} onChange={endTimeOnChange} /> </p>
                <p> <button onClick={handleClick}> get info </button> </p>
                <NewlineText items={geoEvents} />
            </div>
        </div>
    );
}