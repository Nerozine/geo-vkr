import {toReadableDate} from "./date_work";

export function parseEvents(data) {
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
    let stationsXML = xmlDoc.getElementsByTagName("Station");
    for (let i = 0; i < stationsXML.length; i++) {
        stations[i] = {};
        stations[i].latitude = stationsXML[i].getElementsByTagName("Latitude")[0]
                                    .childNodes[0].nodeValue;
        stations[i].longitude = stationsXML[i].getElementsByTagName("Longitude")[0]
                                    .childNodes[0].nodeValue;
        stations[i].elevation = stationsXML[i].getElementsByTagName("Elevation")[0]
                                    .childNodes[0].nodeValue;
        stations[i].code = stationsXML[i].getAttribute("code");
    }

    return stations;
}