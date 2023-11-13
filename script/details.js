const params = new URLSearchParams(window.location.search);
const rideID = params.get("id");
const ride = getRideRecord(rideID);

document.addEventListener("DOMContentLoaded", async () => {
  const firstPosition = ride.data[0];
  const firstLocationData = await getLocationData(
    firstPosition.latitude,
    firstPosition.longitude
  );

  const itemElement = document.createElement("div");
  itemElement.className = "flex-fill d-flex flex-column";

  const cityDiv = document.createElement("div");
  cityDiv.innerText = `${firstLocationData.city} - ${firstLocationData.countryCode}`;
  cityDiv.className = "text-primary mb-2";

  const maxSpeedDiv = document.createElement("div");
  maxSpeedDiv.innerText = `Max Speed ${getMaxSpeed(ride.data)} km/h`;
  maxSpeedDiv.className = "h5";

  const distanceDiv = document.createElement("div");
  distanceDiv.innerText = `Distance: ${getDistance(ride.data)}`;

  const durationDiv = document.createElement("div");
  durationDiv.innerText = `Duration: ${getDuration(ride)}`;

  const dateDiv = document.createElement("div");
  dateDiv.innerText = getStartDate(ride);
  dateDiv.className = "text-secondary mt-2";

  itemElement.appendChild(cityDiv);
  itemElement.appendChild(maxSpeedDiv);
  itemElement.appendChild(distanceDiv);
  itemElement.appendChild(durationDiv);
  itemElement.appendChild(dateDiv);

  document.querySelector("#data").appendChild(itemElement);

  const deleteButton = document.querySelector("#deleteBtn");
  deleteButton.addEventListener("click", () => {
    deleteRide(rideID);
    window.location.href = "./";
  });

  const map = L.map("mapDetail");
  map.setView([firstPosition.latitude, firstPosition.longitude], 13);
  var Stadia_StamenTonerLite = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      minZoom: 5,
      maxZoom: 18,
      ext: "png",
    }
  ).addTo(map);

  const positionsArray = ride.data.map((position) => {
    return [position.latitude, position.longitude];
  });

  console.log(positionsArray);

  const polyline = L.polyline(positionsArray, { color: "#F00" });
  polyline.addTo(map);

  map.fitBounds(polyline.getBounds());
});
