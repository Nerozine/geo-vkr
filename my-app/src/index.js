import React from 'react';
import ReactDOM from 'react-dom';
import DateTimePicker from 'react-datetime-picker';
import L from 'leaflet';
import './Map.css';
import { MapContainer, Marker, Popup, TileLayer, ScaleControl} from 'react-leaflet';

function getEventInfoAsString(event) {
    return `${event.type}\t` + `magnitude: ${event.magnitude}\t` + `time: ${event.time.toString()}\t` + `lat: ${event.latitude}\t` + `lon: ${event.longitude}\t`;
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

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";


function GeoEvents(props) {
    return props.geoEvents.map(geoEvent =>
        <Marker position={[geoEvent.latitude, geoEvent.longitude]} icon={getIcon(20)}>
            <Popup>
                <p> Date: {geoEvent.time} </p>
                <p> Magnitude: {geoEvent.magnitude} </p>
                <p> lnt: {geoEvent.longitude} lat: {geoEvent.latitude}</p>
            </Popup>
        </Marker>);
}


class MapComponent extends React.Component {
    state = {
        lat: 56.344253,
        lng: 92.860483,
        zoom: 5,
    };

    render() {
        let center = [this.state.lat, this.state.lng];

        return (
            <MapContainer zoom={this.state.zoom} center={center}>
                <ScaleControl imperial={false}/>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoEvents geoEvents={this.props.geoEvents} />
            </MapContainer>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: new Date(),
            endTime: new Date(),
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

    convertDate(date) {
        // Mon Mar 28 2022 02:15:41 GMT+0700 (Новосибирск, стандартное время) input
        // yyyy-mm-ddThh:mm:ss output
        let result = `${date.getFullYear()}-`;

        if (date.getMonth() + 1 > 9) {
            result += `${date.getMonth() + 1}-`;
        }
        else {
            result += `0${date.getMonth() + 1}-`;
        }

        if (date.getDate() > 9) {
            result += `${date.getDate()}T`;
        }
        else {
            result += `0${date.getDate()}T`;
        }

        if (date.getHours() > 9) {
            result += `${date.getHours()}:`;
        }
        else {
            result += `0${date.getHours()}:`;
        }

        if (date.getMinutes() > 9) {
            result += `${date.getMinutes()}:`;
        }
        else {
            result += `0${date.getMinutes()}:`;
        }

        if (date.getSeconds() > 9) {
            result += `${date.getSeconds()}`;
        }
        else {
            result += `0${date.getSeconds()}`;
        }

        return result;
    }

    handleClick = () => {
        const stTime = this.convertDate(this.state.startTime);
        const enTime =  this.convertDate(this.state.endTime);
        const minLatitude = "-90.0";
        const maxLatitude = "90.0";
        const minLongitude = -180.0;
        const maxLongitude = 108.0;
        const limit = 15;

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
                    }

                    let eventsInfo = [];
                    for (let i = 0; i < xmlDoc.getElementsByTagName("event").length; i++) {
                        eventsInfo[i] = {};
                        eventsInfo[i].type = xmlDoc.getElementsByTagName("event")[i].getElementsByTagName("type")[0].childNodes[0].nodeValue;
                        eventsInfo[i].magnitude = xmlDoc.getElementsByTagName("event")[i].getElementsByTagName("magnitude")[0].getElementsByTagName("mag")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                        let coordInfo = xmlDoc.getElementsByTagName("event")[i].getElementsByTagName("origin")[0];
                        eventsInfo[i].latitude = coordInfo.getElementsByTagName("latitude")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                        eventsInfo[i].longitude = coordInfo.getElementsByTagName("longitude")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                        eventsInfo[i].time = coordInfo.getElementsByTagName("time")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                    }

                    let parsedInfo = [];
                    for (let i = 0; i < eventsInfo.length; i++) {
                        parsedInfo[i] = getEventInfoAsString(eventsInfo[i]);
                    }

                    this.setState({
                        geoEvents: eventsInfo,
                    })
                    console.log("text is updated");
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
        const position = [51.505, -0.09];
        return (
            <div>
                <MapComponent geoEvents={this.state.geoEvents} />
                <div>
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
