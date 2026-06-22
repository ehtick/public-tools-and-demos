import mapboxgl from 'mapbox-gl'
import { SF_MARKERS } from '../data/sfMarkers'
import { DURATION } from '../constants'

export function activateMarkers(ctx) {
  const {
    map,
    markersRef,
    activationIdRef,
    pendingTimeoutRef,
    setLightPreset,
    setColorTheme
  } = ctx

  setLightPreset('day')
  setColorTheme('default')
  const aid = activationIdRef.current
  map.flyTo({
    center: [-122.404, 37.796],
    zoom: 14,
    pitch: 30,
    bearing: 0,
    duration: DURATION
  })

  pendingTimeoutRef.current = setTimeout(() => {
    pendingTimeoutRef.current = null
    if (activationIdRef.current !== aid) return

    SF_MARKERS.forEach(({ lngLat, label, emoji, description, image }) => {
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.innerHTML = `
        <div class="marker-pin">
          <img class="marker-thumb" src="${image.replace(
            /\/\d+px-/,
            '/60px-'
          )}" alt="${label}" />
        </div>
        <span class="marker-label">${label}</span>
      `

      const popup = new mapboxgl.Popup({
        offset: 32,
        closeButton: false,
        closeOnClick: false,
        maxWidth: '220px'
      }).setHTML(`
          <div class="popup-card">
            <img class="popup-image" src="${image}" alt="${label}" />
            <div class="popup-body">
              <div class="popup-title">${emoji} ${label}</div>
              <div class="popup-desc">${description}</div>
            </div>
          </div>
        `)

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(lngLat)
        .setPopup(popup)
        .addTo(map)

      el.addEventListener('mouseenter', () =>
        marker.getPopup().addTo(map)
      )
      el.addEventListener('mouseleave', () => marker.getPopup().remove())

      markersRef.current.push(marker)
    })
  }, DURATION * 0.65)
}
