import React from 'react';
import ReactDOM from 'react-dom';
import DateTimePicker from 'react-datetime-picker';
import L from 'leaflet';
import './Map.css';
import { MapContainer, Marker, Popup, TileLayer, ScaleControl} from 'react-leaflet';
import {convertDate, toReadableDate} from "./date_work";
import LeafletRuler from "./leaflet-ruler/code/LeafletRuler";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

function getEventInfoAsString(event) {
    return `${event.type}\t` + `magnitude: ${event.magnitude}\t` + `time: ${event.time.toString()}\t` +
        `latitude: ${event.latitude}\t` + `longitude: ${event.longitude}\t`;
}

function getIcon(_iconSize) {
    return L.icon({
        iconUrl: require("./static\\earthquake_icon.png"),
        iconSize: _iconSize,
    });
}

function NewlineText(props) {
    return props.items.map(geoEvent => <p>{getEventInfoAsString(geoEvent)}</p>);
}

function GeoEvents(props) {
    return props.geoEvents.map(geoEvent =>
        <Marker position={[geoEvent.latitude, geoEvent.longitude]} icon={getIcon(20)}>
            <Popup>
                <p> Event type: {geoEvent.type} </p>
                <p> Date: {geoEvent.time} </p>
                <p> Magnitude: {geoEvent.magnitude}({geoEvent.magnitudeType}) </p>
                <p> longitude: {geoEvent.longitude} latitude: {geoEvent.latitude} </p>
                <p> Depth: {geoEvent.depth}({geoEvent.depthType}, uncertainty: {geoEvent.depthUncertainty}) </p>
            </Popup>
        </Marker>);
}

class MapComponent extends React.Component {
    render() {
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
                <GeoEvents geoEvents={this.props.geoEvents} />
                <LeafletRuler />
            </MapContainer>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: new Date('2021-10-01T00:00:00'),
            endTime: new Date('2021-10-31T23:59:59'),
            text : [],
            geoEvents :[],
        };
    }

    onChangeStart = (date) => {
        console.log(date);
        this.setState({
            startTime: date,
            endTime: this.state.endTime,
        })
    }

    onChangeEnd = (date) => {
        console.log(date);
        this.setState({
            startTime: this.state.startTime,
            endTime: date,
        })
    }

    handleClick = () => {
        const stTime = convertDate(this.state.startTime);
        const enTime =  convertDate(this.state.endTime);
        const minLatitude = "-90.0";
        const maxLatitude = "90.0";
        const minLongitude = -180.0;
        const maxLongitude = 108.0;
        const limit =  document.getElementById("events_limit").value;
        console.log("limit is " + limit);

        console.log("current state is: " + stTime + " :: " + enTime);
        if (this.state.startTime < this.state.endTime) {
            console.log("can make http request");
            const serverUrl = "http://84.237.89.72:8080/fdsnws/";
            // const serverUrl = "https://service.iris.edu/fdsnws/";
            let query = serverUrl + `event/1/query?starttime=${stTime}&endtime=${enTime}`+
                `&limit=${limit}`;

            console.log(query);

            fetch(query)
                .then(response => {
                    console.log(response);
                    if (response.status !== 200) {
                        this.setState({
                            text : [],
                        })
                        console.log("bad response code: " + response.status);
                        let error = new Error(response.statusText);
                        error.response = response;
                        throw error
                    } else {
                        return response.text();
                    }
                })
                .then(data => {
                    let parser;
                    let xmlDoc;
                    if (window.DOMParser) {
                        parser = new DOMParser();
                        xmlDoc = parser.parseFromString(data, "text/xml");
                        console.log("data is " + data);
                    }

                    let eventsInfo = [];
                    for (let i = 0; i < xmlDoc.getElementsByTagName("event").length; i++) {
                        eventsInfo[i] = {};
                        eventsInfo[i].type = xmlDoc.getElementsByTagName("event")[i].getElementsByTagName("type")[1].childNodes[0].nodeValue;
                        eventsInfo[i].magnitude = xmlDoc.getElementsByTagName("event")[i].getElementsByTagName("magnitude")[0].getElementsByTagName("mag")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                        eventsInfo[i].magnitudeType = xmlDoc.getElementsByTagName("event")[i].getElementsByTagName("magnitude")[0].getElementsByTagName("type")[0].childNodes[0].nodeValue;
                        let coordInfo = xmlDoc.getElementsByTagName("event")[i].getElementsByTagName("origin")[0];
                        eventsInfo[i].time = toReadableDate(coordInfo.getElementsByTagName("time")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue);
                        eventsInfo[i].latitude = coordInfo.getElementsByTagName("latitude")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                        eventsInfo[i].longitude = coordInfo.getElementsByTagName("longitude")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                        eventsInfo[i].depthType = coordInfo.getElementsByTagName("depthType")[0].childNodes[0].nodeValue;
                        eventsInfo[i].depth = coordInfo.getElementsByTagName("depth")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                        eventsInfo[i].depthUncertainty = coordInfo.getElementsByTagName("depth")[0].getElementsByTagName("uncertainty")[0].childNodes[0].nodeValue;
                    }

                    let parsedInfo = [];
                    for (let i = 0; i < eventsInfo.length; i++) {
                        parsedInfo[i] = getEventInfoAsString(eventsInfo[i]);
                    }

                    this.setState({
                        geoEvents: eventsInfo,
                    })
                    console.log("text is updated " + parsedInfo.length);
                })
                .catch((e) => {
                    console.log("Error " + e.message);
                    console.log(e.response);
                });

        }
        else {
            console.log("incorrect date, can't make request");
        }
    }

    render() {
        return (
            <div>
                <MapComponent geoEvents={this.state.geoEvents}/>
                <div>
                    <p> events limit: <input type="number" id="events_limit" name="events_limit" min="1" max="300" defaultValue={10} /> </p>
                    <p> start time: <DateTimePicker maxDetail="second"  value={this.state.startTime} onChange={this.onChangeStart} /> </p>
                    <p> end time: <DateTimePicker maxDetail="second"  value={this.state.endTime} onChange={this.onChangeEnd} /> </p>
                    <p> <button onClick={this.handleClick}> get info </button> </p>
                    <NewlineText items={this.state.geoEvents} />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
