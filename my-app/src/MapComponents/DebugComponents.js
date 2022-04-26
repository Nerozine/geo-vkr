import React from "react";

function getEventInfoAsString(event) {
    return `${event.type}\t` + `magnitude: ${event.magnitude}\t` + `time: ${event.time.toString()}\t` +
        `latitude: ${event.latitude}\t` + `longitude: ${event.longitude}\t`;
}

export function NewlineText(props) {
    return props.items.map(geoEvent => <p>{getEventInfoAsString(geoEvent)}</p>);
}