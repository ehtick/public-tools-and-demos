import mapboxgl from 'mapbox-gl'
import { NAV_ROUTE, NAV_MANEUVERS } from '../data/navRoute'
import { DURATION } from '../constants'

export function activateNavigation(ctx) {
  const {
    map,
    markersRef,
    activationIdRef,
    pendingTimeoutRef,
    rotationTypeRef,
    setLightPreset,
    setColorTheme
  } = ctx

  setLightPreset('dusk')
  setColorTheme('default')
  rotationTypeRef.current = 'navigation'
  const aid = activationIdRef.current

  map.addSource('route-source', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: NAV_ROUTE }
    }
  })
  map.addLayer({
    id: 'route-outline',
    type: 'line',
    source: 'route-source',
    slot: 'top',
    paint: {
      'line-color': '#ffffff',
      'line-width': 9,
      'line-opacity': 0.4,
      'line-emissive-strength': 1
    }
  })
  map.addLayer({
    id: 'route-line',
    type: 'line',
    source: 'route-source',
    slot: 'top',
    paint: {
      'line-color': '#4264FB',
      'line-width': 5,
      'line-emissive-strength': 1
    }
  })

  const makeNavEl = (letter, cls) => {
    const el = document.createElement('div')
    el.className = `nav-marker ${cls}`
    el.textContent = letter
    return el
  }

  const startMarker = new mapboxgl.Marker({
    element: makeNavEl('A', 'start-marker')
  })
    .setLngLat(NAV_ROUTE[0])
    .addTo(map)
  const endMarker = new mapboxgl.Marker({
    element: makeNavEl('B', 'end-marker')
  })
    .setLngLat(NAV_ROUTE[NAV_ROUTE.length - 1])
    .addTo(map)
  markersRef.current.push(startMarker, endMarker)

  // Phase 1: overview — fit the full route in view for 3 seconds
  const bounds = NAV_ROUTE.reduce(
    (b, coord) => b.extend(coord),
    new mapboxgl.LngLatBounds(NAV_ROUTE[0], NAV_ROUTE[0])
  )
  map.fitBounds(bounds, {
    padding: 80,
    pitch: 0,
    bearing: 0,
    duration: 2000,
    essential: true
  })

  // Phase 2: after 2s fly + 3s overview, animate puck along route
  pendingTimeoutRef.current = setTimeout(() => {
    pendingTimeoutRef.current = null
    if (activationIdRef.current !== aid) return

    const calcBearing = (from, to) => {
      const toRad = (d) => (d * Math.PI) / 180
      const dLng = toRad(to[0] - from[0])
      const lat1 = toRad(from[1])
      const lat2 = toRad(to[1])
      const y = Math.sin(dLng) * Math.cos(lat2)
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
      return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
    }

    // Draw puck icon onto a canvas and register as a map image
    if (!map.hasImage('nav-puck-icon')) {
      const size = 56
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const canvasCtx = canvas.getContext('2d')
      // Blue circle with white border
      canvasCtx.beginPath()
      canvasCtx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2)
      canvasCtx.fillStyle = '#4264FB'
      canvasCtx.fill()
      canvasCtx.strokeStyle = 'white'
      canvasCtx.lineWidth = 4
      canvasCtx.stroke()
      // White upward arrow
      canvasCtx.beginPath()
      canvasCtx.moveTo(size / 2, 16)
      canvasCtx.lineTo(size - 18, size - 14)
      canvasCtx.lineTo(size / 2, size - 20)
      canvasCtx.lineTo(18, size - 14)
      canvasCtx.closePath()
      canvasCtx.fillStyle = 'white'
      canvasCtx.fill()
      const imgData = canvasCtx.getImageData(0, 0, size, size)
      map.addImage('nav-puck-icon', {
        width: size,
        height: size,
        data: imgData.data
      })
    }

    // GeoJSON source + symbol layer for the puck
    map.addSource('nav-puck-source', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: NAV_ROUTE[0] },
        properties: {}
      }
    })
    map.addLayer({
      id: 'nav-puck-layer',
      type: 'symbol',
      source: 'nav-puck-source',
      slot: 'top',
      layout: {
        'icon-image': 'nav-puck-icon',
        'icon-size': 0.5,
        'icon-rotation-alignment': 'viewport',
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
      },
      paint: {
        'icon-emissive-strength': 1
      }
    })

    const initBearing = calcBearing(NAV_ROUTE[0], NAV_ROUTE[1])
    map.easeTo({
      center: NAV_ROUTE[0],
      zoom: 16,
      pitch: 50,
      bearing: initBearing,
      duration: 1500,
      essential: true
    })

    let coordT = 0
    let smoothBearing = initBearing
    const speed = (NAV_ROUTE.length - 1) / (65 * 60)
    const LOOKAHEAD = 15
    let nextManeuver = 0
    let currentPopup = null
    let userInteracting = false
    let interactTimeout = null

    const onUserInteract = () => {
      userInteracting = true
      clearTimeout(interactTimeout)
      interactTimeout = setTimeout(() => {
        userInteracting = false
      }, 2000)
    }
    map.on('mousedown', onUserInteract)
    map.on('wheel', onUserInteract)
    map.on('touchstart', onUserInteract)

    // Use setInterval so the loop is immune to requestAnimationFrame
    // cancellation that can occur internally during Mapbox scroll-zoom.
    let navIntervalId = null

    const tick = () => {
      if (activationIdRef.current !== aid) {
        clearInterval(navIntervalId)
        clearTimeout(interactTimeout)
        map.off('mousedown', onUserInteract)
        map.off('wheel', onUserInteract)
        map.off('touchstart', onUserInteract)
        if (currentPopup) {
          currentPopup.remove()
          currentPopup = null
        }
        return
      }

      coordT += speed

      // Loop back to start when route is complete
      if (coordT >= NAV_ROUTE.length - 1) {
        coordT = 0
        smoothBearing = initBearing
        nextManeuver = 0
        if (currentPopup) {
          currentPopup.remove()
          currentPopup = null
        }
      }

      const idx = Math.floor(coordT)
      const frac = coordT - idx
      const from = NAV_ROUTE[idx]
      const to = NAV_ROUTE[Math.min(idx + 1, NAV_ROUTE.length - 1)]
      const pos = [
        from[0] + (to[0] - from[0]) * frac,
        from[1] + (to[1] - from[1]) * frac
      ]

      if (idx < NAV_ROUTE.length - 1) {
        const raw = calcBearing(from, to)
        const diff = ((raw - smoothBearing + 540) % 360) - 180
        smoothBearing = (smoothBearing + diff * 0.08 + 360) % 360
      }

      // Show popup when approaching the next maneuver
      if (nextManeuver < NAV_MANEUVERS.length) {
        const m = NAV_MANEUVERS[nextManeuver]
        if (!currentPopup && coordT >= m.idx - LOOKAHEAD) {
          currentPopup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            anchor: 'bottom',
            offset: 28,
            className: 'nav-turn-popup'
          })
            .setLngLat(pos)
            .setHTML(
              `<div class="nav-popup"><span class="nav-popup-dir">${m.dir}</span><span class="nav-popup-text">${m.instruction}</span></div>`
            )
            .addTo(map)
        }
        // Move popup with the puck
        if (currentPopup) currentPopup.setLngLat(pos)
        // Dismiss when the puck executes the turn
        if (coordT >= m.idx) {
          if (currentPopup) {
            currentPopup.remove()
            currentPopup = null
          }
          nextManeuver++
        }
      }

      const src = map.getSource('nav-puck-source')
      if (src) {
        src.setData({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: pos },
          properties: {}
        })
      }
      if (!userInteracting) {
        map.jumpTo({
          center: pos,
          bearing: smoothBearing,
          pitch: 50,
          zoom: 16
        })
      }
    }

    setTimeout(() => {
      if (activationIdRef.current !== aid) return
      navIntervalId = setInterval(tick, 16)
    }, 1500)
  }, 2000)
}
