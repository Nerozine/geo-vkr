import {parseStations} from "./query_parse";

const serverUrl = "http://84.237.89.72:8080/fdsnws/";
// const serverUrl = "https://service.iris.edu/fdsnws/";

export function getStations(network, setStations) {
    let query = serverUrl + "station/1/query?";
    console.log(query);
    fetch(query).then(response => {
        console.log(response);
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