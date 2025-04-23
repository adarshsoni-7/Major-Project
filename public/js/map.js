mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: listings.geometry.coordinates,
  zoom: 6,
});

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<h4>${listings.location} <br/><p>Exact location provided after booking</p></h4>`
);

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listings.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);

const nav = new mapboxgl.NavigationControl({ visualizePitch: true });
map.addControl(nav, "bottom-right");
