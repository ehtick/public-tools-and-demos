import { DURATION } from '../constants'

export async function activateDataOverlay(ctx) {
  const { map, setLightPreset, setColorTheme } = ctx

  setLightPreset('night')
  setColorTheme('warm')
  map.flyTo({
    center: [-119.5, 37.5],
    zoom: 5,
    pitch: 0,
    bearing: 0,
    duration: DURATION
  })

  try {
    const res = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
    )
    const data = await res.json()
    if (!map) return

    if (!map.getSource('earthquakes-source')) {
      map.addSource('earthquakes-source', { type: 'geojson', data })
    }

    if (!map.getLayer('earthquakes-heat')) {
      map.addLayer({
        id: 'earthquakes-heat',
        type: 'heatmap',
        source: 'earthquakes-source',
        slot: 'top',
        maxzoom: 9,
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            0,
            0,
            6,
            1
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            1,
            9,
            3
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgb(103,169,207)',
            0.4,
            'rgb(209,229,240)',
            0.6,
            'rgb(253,219,199)',
            0.8,
            'rgb(239,138,98)',
            1,
            'rgb(178,24,43)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            2,
            9,
            20
          ],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            1,
            9,
            0
          ],
          'heatmap-emissive-strength': 1
        }
      })
    }

    if (!map.getLayer('earthquakes-point')) {
      map.addLayer({
        id: 'earthquakes-point',
        type: 'circle',
        source: 'earthquakes-source',
        slot: 'top',
        minzoom: 7,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
            16,
            ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            1,
            'rgba(33,102,172,0)',
            2,
            'rgb(102,169,207)',
            3,
            'rgb(209,229,240)',
            4,
            'rgb(253,219,199)',
            5,
            'rgb(239,138,98)',
            6,
            'rgb(178,24,43)'
          ],
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1],
          'circle-emissive-strength': 1
        }
      })
    }
  } catch (e) {
    console.error('Failed to load earthquake data:', e)
  }
}
