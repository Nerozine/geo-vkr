import {parseEvents, parseNetworks, parseStations} from "./query_parse";
import {convertDate} from "./date_work";
import {BASENAME_API} from "../constants";

export function getStations(network, setStations) {
    let query = BASENAME_API + "station/1/query?";
    console.log(query);
    fetch(query).then(response => {
        console.log("stations: " + response);
        if (response.status !== 200) {
            setStations(() => []);
            console.log("bad response code: " + response.status);
            let error = new Error(response.statusText);
            error.response = response;
            throw error;
        } else {
            return response.text();
        }
    }).then(data => {
        setStations(parseStations(data));
    });
}

export async function getGeoEvents(startTime, endTime, limit) {
    const stTime = convertDate(startTime);
    const enTime = convertDate(endTime);

    if (startTime >= endTime) {
        console.log("error, start date >= end time");
    }
    else {
        let query = BASENAME_API + `event/1/query?starttime=${stTime}&endtime=${enTime}` +
            `&limit=${limit}` + "&includearrivals=true";

        console.log(query);

        let response = await fetch(query);
        if (response.status === 200) {
            console.log("parsing events");
            return parseEvents(await response.text());
        }
        else {
            console.log("bad response code: " + response.status);
            return [];
        }
    }
}

export async function getNetworks() {
    let levelNetworkQuery = "network";
    let getNetworksQuery = `${BASENAME_API}/station/1/query?level=${levelNetworkQuery}`;

    let response = await fetch(getNetworksQuery);
    if (response.status === 200) {
        return parseNetworks(await response.text());
    }
    else {
        console.log("Bad response status!");
    }
}