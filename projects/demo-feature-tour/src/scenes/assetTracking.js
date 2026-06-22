import mapboxgl from 'mapbox-gl'
import { WAREHOUSE_COORD, PICKUP_LOCATIONS, TRUCK_PATHS } from '../data/assetTracking'
import { DURATION } from '../constants'

export function activateAssetTracking(ctx) {
  const {
    map,
    markersRef,
    activationIdRef,
    animFrameRef,
    rotationTypeRef,
    setLightPreset,
    setColorTheme
  } = ctx

  setLightPreset('day')
  setColorTheme('default')
  rotationTypeRef.current = 'asset-tracking'
  const aid = activationIdRef.current

  map.flyTo({
    center: [-87.635, 41.87],
    zoom: 11,
    pitch: 30,
    bearing: 0,
    duration: DURATION
  })

  // Warehouse marker
  const warehouseEl = document.createElement('div')
  warehouseEl.className = 'warehouse-marker'
  warehouseEl.innerHTML = `
    <div class="warehouse-pin">
      <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </div>
    <span class="warehouse-label">Warehouse</span>
  `
  const fleetMarkers = []

  const warehouseMarker = new mapboxgl.Marker({ element: warehouseEl })
    .setLngLat(WAREHOUSE_COORD)
    .addTo(map)
  markersRef.current.push(warehouseMarker)
  fleetMarkers.push(warehouseMarker)

  // Pickup location markers
  PICKUP_LOCATIONS.forEach((pickup) => {
    const el = document.createElement('div')
    el.className = 'pickup-marker'
    el.innerHTML = `
      <div class="pickup-pin" style="background:${pickup.color}">
        <svg viewBox="0 0 24 24" fill="white" width="12" height="12">
          <circle cx="12" cy="10" r="3" fill="white"/>
        </svg>
      </div>
      <span class="pickup-label" style="color:${pickup.color}">${pickup.label}</span>
    `
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat(pickup.lngLat)
      .addTo(map)
    markersRef.current.push(marker)
    fleetMarkers.push(marker)
  })

  // Fetch isochrones
  ;(async () => {
    try {
      const token = mapboxgl.accessToken
      const [lng, lat] = WAREHOUSE_COORD
      const res = await fetch(
        `https://api.mapbox.com/isochrone/v1/mapbox/driving/${lng},${lat}?contours_minutes=10,20,30&polygons=true&access_token=${token}`
      )
      if (activationIdRef.current !== aid) return
      const data = await res.json()
      if (activationIdRef.current !== aid) return

      map.addSource('isochrone-source', { type: 'geojson', data })

      const isoLayers = [
        {
          id: '30',
          fill: 'rgba(66,100,251,0.07)',
          line: 'rgba(66,100,251,0.35)',
          min: 30
        },
        {
          id: '20',
          fill: 'rgba(66,100,251,0.12)',
          line: 'rgba(66,100,251,0.52)',
          min: 20
        },
        {
          id: '10',
          fill: 'rgba(66,100,251,0.20)',
          line: 'rgba(66,100,251,0.75)',
          min: 10
        }
      ]
      isoLayers.forEach(({ id, fill, line, min }) => {
        map.addLayer({
          id: `isochrone-fill-${id}`,
          type: 'fill',
          source: 'isochrone-source',
          minzoom: 9,
          filter: ['==', ['get', 'contour'], min],
          paint: { 'fill-color': fill, 'fill-emissive-strength': 1 },
          slot: 'bottom'
        })
        map.addLayer({
          id: `isochrone-line-${id}`,
          type: 'line',
          source: 'isochrone-source',
          minzoom: 9,
          filter: ['==', ['get', 'contour'], min],
          paint: {
            'line-color': line,
            'line-width': 1.5,
            'line-dasharray': [4, 2],
            'line-emissive-strength': 1
          },
          slot: 'bottom'
        })
      })
    } catch (e) {
      console.error('Isochrone fetch failed:', e)
    }
  })()

  // Trail sources + layers for each truck
  TRUCK_PATHS.forEach((truck) => {
    map.addSource(`trail-${truck.id}-source`, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [truck.path[0], truck.path[0]]
        }
      }
    })
    map.addLayer({
      id: `trail-${truck.id}`,
      type: 'line',
      source: `trail-${truck.id}-source`,
      minzoom: 9,
      paint: {
        'line-color': truck.color,
        'line-width': 5,
        'line-opacity': 0.65,
        'line-emissive-strength': 1
      },
      slot: 'top'
    })
  })

  // Truck markers with trail state
  const truckStates = TRUCK_PATHS.map((truck, i) => {
    const el = document.createElement('div')
    el.className = 'truck-marker'
    el.innerHTML = `
      <div class="truck-dot" style="background:${truck.color}">
        <svg viewBox="0 0 24 24" fill="white">
          <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3h3l3 3v4h-2a3 3 0 0 1-6 0H8a3 3 0 0 1-6 0H5V17Z"/>
        </svg>
      </div>
      <span class="truck-label" style="color:${truck.color}">${truck.label}</span>
    `
    const totalSegments = truck.path.length - 1
    const globalT = (i / TRUCK_PATHS.length) * totalSegments
    const startSegment = Math.floor(globalT)
    const startT = globalT - startSegment
    const startPos = [
      truck.path[startSegment][0] +
        (truck.path[startSegment + 1][0] - truck.path[startSegment][0]) *
          startT,
      truck.path[startSegment][1] +
        (truck.path[startSegment + 1][1] - truck.path[startSegment][1]) *
          startT
    ]
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat(startPos)
      .addTo(map)
    markersRef.current.push(marker)
    fleetMarkers.push(marker)
    return {
      ...truck,
      marker,
      t: startT,
      segment: startSegment,
      speed: 0.015 + Math.random() * 0.005,
      trail: [[...startPos]]
    }
  })

  // Show/hide all fleet markers based on zoom level
  const updateMarkerVisibility = () => {
    if (activationIdRef.current !== aid) {
      map.off('zoom', updateMarkerVisibility)
      return
    }
    const visible = map.getZoom() >= 9
    fleetMarkers.forEach((m) => {
      m.getElement().style.display = visible ? '' : 'none'
    })
  }
  updateMarkerVisibility()
  map.on('zoom', updateMarkerVisibility)

  let frameCount = 0
  const animate = () => {
    frameCount++
    truckStates.forEach((truck) => {
      truck.t += truck.speed
      if (truck.t >= 1) {
        truck.t -= 1
        truck.segment = (truck.segment + 1) % (truck.path.length - 1)
        if (truck.segment === 0) truck.trail = [[...truck.path[0]]]
      }
      const start = truck.path[truck.segment]
      const end = truck.path[truck.segment + 1]
      const pos = [
        start[0] + (end[0] - start[0]) * truck.t,
        start[1] + (end[1] - start[1]) * truck.t
      ]
      truck.marker.setLngLat(pos)
      if (frameCount % 3 === 0) {
        truck.trail.push([...pos])
        if (truck.trail.length > 300) truck.trail.shift()
        const src = map.getSource(`trail-${truck.id}-source`)
        if (src)
          src.setData({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: truck.trail }
          })
      }
    })
    animFrameRef.current = requestAnimationFrame(animate)
  }
  animate()
}
