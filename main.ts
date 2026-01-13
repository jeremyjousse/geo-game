import places from './places.json';

interface Place {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    description: string;
    picture_url: string;
}

const placeNameEl = document.getElementById('place-name') as HTMLHeadingElement;
const placePictureEl = document.getElementById('place-picture') as HTMLImageElement;
const congratsContainerEl = document.getElementById('congrats-container') as HTMLDivElement;
const nextPlaceBtn = document.getElementById('next-place-btn') as HTMLButtonElement;
const targetCoordsEl = document.getElementById('target-coords') as HTMLSpanElement;
const userCoordsEl = document.getElementById('user-coords') as HTMLSpanElement;

let currentPlaceIndex = 0;

function displayPlace(place: Place) {
    placeNameEl.textContent = place.name;
    placePictureEl.src = place.picture_url;
    targetCoordsEl.textContent = `${place.latitude.toFixed(6)}, ${place.longitude.toFixed(6)}`;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
}

function checkPosition(position: GeolocationPosition) {
    const currentPlace = places[currentPlaceIndex];
    userCoordsEl.textContent = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
    const distance = haversineDistance(
        position.coords.latitude,
        position.coords.longitude,
        currentPlace.latitude,
        currentPlace.longitude
    );

    if (distance < 50) { // 50 meters threshold
        congratsContainerEl.style.display = 'block';
    }
}

function nextPlace() {
    currentPlaceIndex = (currentPlaceIndex + 1) % places.length;
    displayPlace(places[currentPlaceIndex]);
    congratsContainerEl.style.display = 'none';
}

nextPlaceBtn.addEventListener('click', nextPlace);

displayPlace(places[currentPlaceIndex]);

if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(checkPosition, 
        (error) => {
            console.error("Error getting location:", error);
            alert("Error getting your location. Please make sure location services are enabled.");
        },
        {
            enableHighAccuracy: true
        }
    );
} else {
    alert('Geolocation is not supported by your browser.');
}