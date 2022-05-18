
// https://en.wikipedia.org/wiki/Haversine_formula
export function getDistance(latX, lonX, latY, lonY) {
    const R = 6371; // Radius of the earth in km
    let dLat = deg2rad(latY-latX);
    let dLon = deg2rad(lonY-lonX);
    let a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(latX)) * Math.cos(deg2rad(latY)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}