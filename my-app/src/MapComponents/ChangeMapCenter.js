import {useMap} from "react-leaflet";

export function ChangeMapView(props) {
    const map = useMap();
    map.setView(props.center, props.center.zoom);
    return null;
}