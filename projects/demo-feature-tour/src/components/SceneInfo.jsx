import { USE_CASES } from './useCasesData'

const A = ({ href, children }) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className='scene-link'
  >
    {children}
  </a>
)

const C = ({ children }) => <code className='scene-code'>{children}</code>

const SCENE_BODY = {
  globe: (
    <>
      <C>globe</C> is one of many supported{' '}
      <A href='https://docs.mapbox.com/style-spec/reference/projection/'>
        projections
      </A>{' '}
      available in Mapbox web and mobile mapping SDKs.
    </>
  ),
  buildings: (
    <>
      The{' '}
      <A href='https://docs.mapbox.com/mapbox-gl-js/guides/standard/'>
        Mapbox Standard Style
      </A>{' '}
      includes realistic 3D buildings, landmarks, and trees — a rich foundation
      for immersive scenes enhanced with dynamic lighting presets and camera
      controls.
    </>
  ),
  markers: (
    <>
      Custom HTML{' '}
      <A href='https://docs.mapbox.com/mapbox-gl-js/api/markers/'>Markers</A>{' '}
      can be placed at any geographic coordinate. Popups attach to markers and
      support arbitrary HTML content for rich interactive experiences.
    </>
  ),
  'data-overlay': (
    <>
      A <C>heatmap</C> layer visualizes point density and magnitude — here
      driven by live data from the{' '}
      <A href='https://earthquake.usgs.gov/earthquakes/feed/'>
        USGS Earthquake Hazards Program
      </A>
      . Mapbox supports data-driven styling across all{' '}
      <A href='https://docs.mapbox.com/style-spec/reference/layers/'>
        layer types
      </A>
      .
    </>
  ),
  raster: (
    <>
      The <C>raster-particle</C> layer type renders animated particle flows over
      raster-array sources. This scene streams GFS global wind forecast data via
      the{' '}
      <A href='https://docs.mapbox.com/api/maps/raster-tiles/'>
        Mapbox Raster Tiles API
      </A>
      .
    </>
  ),
  navigation: (
    <>
      Mapbox powers turn-by-turn navigation through the{' '}
      <A href='https://docs.mapbox.com/navigation/'>
        Navigation SDKs for iOS and Android
      </A>
      . End users receive turn by turn instructions and voice guidance.
    </>
  ),
  'asset-tracking': (
    <>
      The{' '}
      <A href='https://docs.mapbox.com/api/navigation/isochrone/'>
        Isochrone API
      </A>{' '}
      computes drive-time polygons from any location, while the{' '}
      <A href='https://docs.mapbox.com/api/navigation/matrix/'>Matrix API</A>{' '}
      returns travel times between multiple origins and destinations. Pair these
      with real-time vehicle location feeds to build a live fleet tracking
      experience.
    </>
  ),
  terrain: (
    <>
      3D terrain is powered by the{' '}
      <A href='https://docs.mapbox.com/data/tilesets/reference/mapbox-terrain-dem-v1/'>
        Mapbox Terrain DEM
      </A>{' '}
      — a global elevation dataset. The{' '}
      <A href='https://docs.mapbox.com/maps/satellite/'>Mapbox Satellite</A>{' '}
      raster tileset can be draped over terrain for a photorealistic landscape.
    </>
  )
}

export default function SceneInfo({ sceneId }) {
  const body = SCENE_BODY[sceneId]
  const useCase = USE_CASES.find((uc) => uc.id === sceneId)
  if (!body || !useCase) return null

  return (
    <div className='scene-info-panel'>
      {/*<div className='scene-info-header'>
        <span className='scene-info-icon'>{useCase.icon}</span>
        <span className='scene-info-title'>{useCase.label}</span>
      </div> */}
      <div className='scene-info'>
        <div className='scene-info-icon'>
          {/*<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><script xmlns=""/>
            <path d="M9 0C7.21997 0 5.47991 0.527841 3.99987 1.51677C2.51983 2.50571 1.36628 3.91131 0.685088 5.55585C0.00389956 7.20038 -0.17433 9.00998 0.172937 10.7558C0.520203 12.5016 1.37737 14.1053 2.63604 15.364C3.89472 16.6226 5.49836 17.4798 7.24419 17.8271C8.99002 18.1743 10.7996 17.9961 12.4442 17.3149C14.0887 16.6337 15.4943 15.4802 16.4832 14.0001C17.4722 12.5201 18 10.78 18 9C18 7.8181 17.7672 6.64778 17.3149 5.55585C16.8626 4.46392 16.1997 3.47177 15.364 2.63604C14.5282 1.80031 13.5361 1.13738 12.4442 0.685084C11.3522 0.232792 10.1819 0 9 0ZM9.9 12.6C9.9 12.8387 9.80518 13.0676 9.6364 13.2364C9.46762 13.4052 9.2387 13.5 9 13.5C8.76131 13.5 8.53239 13.4052 8.36361 13.2364C8.19482 13.0676 8.1 12.8387 8.1 12.6V8.1C8.1 7.8613 8.19482 7.63238 8.36361 7.4636C8.53239 7.29482 8.76131 7.2 9 7.2C9.2387 7.2 9.46762 7.29482 9.6364 7.4636C9.80518 7.63238 9.9 7.8613 9.9 8.1V12.6ZM9 6.3C8.822 6.3 8.64799 6.24721 8.49999 6.14832C8.35198 6.04943 8.23663 5.90887 8.16851 5.74441C8.10039 5.57996 8.08257 5.399 8.1173 5.22442C8.15202 5.04983 8.23774 4.88947 8.36361 4.7636C8.48947 4.63774 8.64984 4.55202 8.82442 4.51729C8.999 4.48256 9.17997 4.50039 9.34442 4.56851C9.50887 4.63663 9.64943 4.75198 9.74833 4.89999C9.84722 5.04799 9.9 5.222 9.9 5.4C9.9 5.63869 9.80518 5.86761 9.6364 6.03639C9.46762 6.20518 9.2387 6.3 9 6.3Z" fill="#BBC2CE"/>
          </svg> */}
          ℹ
        </div>
        <p className='scene-info-body'>{body}</p>
      </div>
    </div>
  )
}
