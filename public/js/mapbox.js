if (document.getElementById('map')) {
  const locations = JSON.parse(document.getElementById('map').dataset.locations)

  mapboxgl.accessToken =
    'pk.eyJ1IjoiYWJiYXNsYW1vdXJpIiwiYSI6ImNrdXY2NXE1ZDY1NXozMG1heDVtZXhjM2UifQ.fUNcJ3Hg13h97ridmkqmgg'
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/abbaslamouri/ckuv6yj7s4qmo17l8w4va0z2u',
    scrollZoom: false,
    // center: [-106.82061553033222, 39.188435139064204],
    // zoom: 4,
    // interactive: false
  })

  const bounds = new mapboxgl.LngLatBounds()

  locations.forEach((location) => {
    const el = document.createElement('div')
    el.className = 'marker'

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map)

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(location.coordinates)
      .setHTML(`<p> Day ${location.day}: ${location.description}</p>`)
      .addTo(map)

    bounds.extend(location.coordinates)
  })

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 200, left: 200, right: 200 },
  })
}
