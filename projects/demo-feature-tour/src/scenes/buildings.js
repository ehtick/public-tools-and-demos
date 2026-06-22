import { DURATION } from '../constants'

export function activate3DBuildings(ctx) {
  const {
    map,
    activationIdRef,
    pendingTimeoutRef,
    startCameraRotationRef,
    rotationTypeRef,
    setLightPreset,
    setColorTheme
  } = ctx

  setLightPreset('dusk')
  setColorTheme('warm')
  rotationTypeRef.current = 'buildings'
  const aid = activationIdRef.current
  map.flyTo({
    center: [-74.0145, 40.7023],
    zoom: 16.2,
    pitch: 62,
    bearing: -20,
    duration: DURATION
  })
  map.once('moveend', () => {
    if (activationIdRef.current !== aid) return
    pendingTimeoutRef.current = setTimeout(() => {
      pendingTimeoutRef.current = null
      if (activationIdRef.current !== aid) return
      if (startCameraRotationRef.current) startCameraRotationRef.current()
    }, 300)
  })
}
