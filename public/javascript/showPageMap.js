// from mapbox page
// this mapToken varaible is because when our js
// then at that time our broweser doesn't know about
// mapboxgl.accessToken = "<%-process.env.MAPBOX_TOKEN%>"
// is not understood by the browser due to ejs syntax
// we can use any varibal let mapToken that is define in show page AT TOP
// const camp=JSON.parse(campground);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: camp.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
})
map.addControl(new mapboxgl.NavigationControl(),'bottom-left');

// creating default marker for map
//https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/
const marker1 = new mapboxgl.Marker(
    {
         color: 'blue', rotation: 45 
    })
.setLngLat(camp.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:20})
    .setHTML(
        `<h5>${camp.title}</h5><p>${camp.location}</p>`
    )
)
.addTo(map);