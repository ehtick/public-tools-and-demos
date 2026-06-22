import { GLOBE_BOUNDS, DURATION } from '../constants'

export function activateGlobe(ctx) {
  const {
    map,
    activationIdRef,
    startCameraRotationRef,
    rotationTypeRef,
    setLightPreset,
    setColorTheme
  } = ctx

  setLightPreset('day')
  setColorTheme('default')
  rotationTypeRef.current = 'globe'
  const aid = activationIdRef.current
  map.fitBounds(GLOBE_BOUNDS, {
    pitch: 0,
    bearing: 0,
    duration: DURATION
  })
  map.once('moveend', () => {
    if (activationIdRef.current !== aid) return
    if (startCameraRotationRef.current) startCameraRotationRef.current()
  })
}
