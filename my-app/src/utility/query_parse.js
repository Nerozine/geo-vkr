import {toReadableDate} from "./date_work";
import {BASENAME_API} from "../constants";

export function parseEvents(data) {
    console.log(data);
    let parser;
    let xmlDoc;
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(data.toString(), "text/xml");
    }
    else {
        console.log("can't parse response");
        return [];
    }

    let events = [];
    let eventsXML = xmlDoc.getElementsByTagName("event");
    for (let i = 0; i < eventsXML.length; i++) {
        let origin = eventsXML[i].getElementsByTagName("origin")[0];
        let magInfo = eventsXML[i].getElementsByTagName("magnitude")[0];
        events[i] = {};
        events[i].type = eventsXML[i].getElementsByTagName("type")[1]
                                .childNodes[0].nodeValue;
        events[i].networkCode = eventsXML[i].getElementsByTagName("pick")[0]
                                .getElementsByTagName("waveformID")[0]
                                .getAttribute("networkCode");
        events[i].magnitudeType = magInfo.getElementsByTagName("type")[0]
                                .childNodes[0].nodeValue;
        events[i].magnitude = magInfo.getElementsByTagName("value")[0]
                                .childNodes[0].nodeValue;
        events[i].time = toReadableDate(origin.getElementsByTagName("time")[0]
                                .getElementsByTagName("value")[0]
                                .childNodes[0].nodeValue);
        events[i].latitude = origin.getElementsByTagName("latitude")[0]
                                .getElementsByTagName("value")[0]
                                .childNodes[0].nodeValue;
        events[i].longitude = origin.getElementsByTagName("longitude")[0]
                                .getElementsByTagName("value")[0]
                                .childNodes[0].nodeValue;
        events[i].depthType = origin.getElementsByTagName("depthType")[0]
                                .childNodes[0].nodeValue;
        events[i].depth = origin.getElementsByTagName("depth")[0]
                                .getElementsByTagName("value")[0]
                                .childNodes[0].nodeValue;
        events[i].depthUncertainty = origin.getElementsByTagName("depth")[0]
                                .getElementsByTagName("uncertainty")[0]
                                .childNodes[0].nodeValue;
        console.log(events[i]);
    }

    return events;
}

export function parseStations(data) {
    let parser;
    let xmlDoc;
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(data.toString(), "text/xml");
    }
    else {
        console.log("can't parse response");
        return [];
    }

    let stations = [];
    let stationsAlreadyAdded = 0;
    for (let i = 0; i < xmlDoc.getElementsByTagName("Network").length; i++) {
        let network = xmlDoc.getElementsByTagName("Network")[i];
        let stationsXML = network.getElementsByTagName("Station");
        for (let j = 0; j < stationsXML.length; j++) {
            stations[stationsAlreadyAdded + j] = {};
            stations[stationsAlreadyAdded + j].latitude = stationsXML[j].getElementsByTagName("Latitude")[0]
                .childNodes[0].nodeValue;
            stations[stationsAlreadyAdded + j].longitude = stationsXML[j].getElementsByTagName("Longitude")[0]
                .childNodes[0].nodeValue;
            stations[stationsAlreadyAdded + j].elevation = stationsXML[j].getElementsByTagName("Elevation")[0]
                .childNodes[0].nodeValue;
            stations[stationsAlreadyAdded + j].code = stationsXML[j].getAttribute("code");
            stations[stationsAlreadyAdded + j].networkCode = network.getAttribute("code");
        }
        stationsAlreadyAdded += stationsXML.length;
    }

    /*let query = BASENAME_API + "event/1/query?contributor=";
    for (let i = 0; i < stations.length; i++) {
        fetch(query + stations[i].code).then(response => {
            console.log(response);
            console.log(response.status);
        });
    }*/

    return stations;
}

export function parseNetworks(data) {
    let parser;
    let xmlDoc;
    if (!window.DOMParser) {
        console.log("Bad response status!");
        return [];
    }

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(data, "text/xml");

    let networks = xmlDoc.getElementsByTagName("Network");
    let networkNames = [];
    for (let i = 0; i < networks.length; i++) {
        networkNames[i] = networks[i].getAttribute("code")
    }

    let result = [];
    networkNames.forEach(networkName => {
        result.push({value: networkName, label: networkName});
    });
    console.log(result);

    return result;
}