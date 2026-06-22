import mapboxgl from 'mapbox-gl'
import { TERRAIN_TRAIL_COORDS } from '../data/terrainTrail'
import { DURATION } from '../constants'

export function activateTerrain(ctx) {
  const {
    map,
    markersRef,
    activationIdRef,
    pendingTimeoutRef,
    startCameraRotationRef,
    rotationTypeRef,
    setLightPreset,
    setColorTheme,
    setIsSatellite
  } = ctx

  setLightPreset('dawn')
  setColorTheme('ocean')
  setIsSatellite(true)
  rotationTypeRef.current = 'terrain'
  const aid = activationIdRef.current

  // Mount Vesuvius, Italy — crater trail from Ercolano
  map.flyTo({
    center: [14.422, 40.819],
    zoom: 13,
    pitch: 75,
    bearing: 135,
    duration: DURATION
  })

  if (!map.getSource('mapbox-dem')) {
    map.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
      tileSize: 512,
      maxzoom: 14
    })
  }
  map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })

  // Vesuvius crater trail
  map.addSource('terrain-trail-source', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: TERRAIN_TRAIL_COORDS }
    }
  })
  map.addLayer({
    id: 'terrain-trail',
    type: 'line',
    source: 'terrain-trail-source',
    slot: 'top',
    paint: {
      'line-color': '#FF6B35',
      'line-width': 3,
      'line-dasharray': [2, 2],
      'line-opacity': 0.9,
      'line-emissive-strength': 1
    }
  })

  // Trail start / end markers
  const makeTrailMarker = (label, cls) => {
    const el = document.createElement('div')
    el.className = `trail-marker ${cls}`
    el.innerHTML = `<span class="trail-marker-label">${label}</span>`
    return el
  }
  const startMarker = new mapboxgl.Marker({
    element: makeTrailMarker('Ercolano', 'trail-start')
  })
    .setLngLat(TERRAIN_TRAIL_COORDS[0])
    .addTo(map)
  const endMarker = new mapboxgl.Marker({
    element: makeTrailMarker('Crater Rim', 'trail-end')
  })
    .setLngLat(TERRAIN_TRAIL_COORDS[TERRAIN_TRAIL_COORDS.length - 1])
    .addTo(map)
  markersRef.current.push(startMarker, endMarker)

  map.once('moveend', () => {
    if (activationIdRef.current !== aid) return
    pendingTimeoutRef.current = setTimeout(() => {
      pendingTimeoutRef.current = null
      if (activationIdRef.current !== aid) return
      if (startCameraRotationRef.current) startCameraRotationRef.current()
    }, 300)
  })
}
