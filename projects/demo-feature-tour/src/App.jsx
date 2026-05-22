import { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './App.css'
import UseCasePanel from './components/UseCasePanel'
import MapControls from './components/MapControls'
//import SceneInfo from './components/SceneInfo'

// ─── Data ────────────────────────────────────────────────────────────────────

const SF_MARKERS = [
  {
    lngLat: [-122.3937, 37.7956],
    label: 'Ferry Building',
    emoji: '🏛️',
    description:
      'Historic 1898 transit terminal turned artisan marketplace on the Embarcadero waterfront.',
    image: 'https://picsum.photos/seed/ferry-building/220/120'
  },
  {
    lngLat: [-122.4089, 37.8087],
    label: 'Pier 39',
    emoji: '🎡',
    description:
      'Waterfront shopping and entertainment complex, famous for its resident sea lion colony.',
    image: 'https://picsum.photos/seed/pier39-sf/220/120'
  },
  {
    lngLat: [-122.4169, 37.8044],
    label: 'Ghirardelli Square',
    emoji: '🍫',
    description:
      'Former chocolate factory reinvented as a landmark plaza of shops and restaurants.',
    image: 'https://picsum.photos/seed/ghirardelli/220/120'
  },
  {
    lngLat: [-122.405, 37.7849],
    label: 'Union Square',
    emoji: '🛍️',
    description:
      "San Francisco's premier shopping district, anchored by a public plaza since 1850.",
    image: 'https://picsum.photos/seed/union-square/220/120'
  },
  {
    lngLat: [-122.4057, 37.7953],
    label: 'Chinatown Gate',
    emoji: '🏮',
    description:
      'The ornate Dragon Gate marks the entrance to one of the oldest Chinatowns in North America.',
    image: 'https://picsum.photos/seed/chinatown-gate/220/120'
  },
  {
    lngLat: [-122.406, 37.7906],
    label: 'Transamerica Pyramid',
    emoji: '🏢',
    description:
      'Completed in 1972, this 260-meter tapered spire is the most recognizable landmark on the SF skyline.',
    image: 'https://picsum.photos/seed/transamerica/220/120'
  },
  {
    lngLat: [-122.3969, 37.8007],
    label: 'Exploratorium',
    emoji: '🔬',
    description:
      'Museum of science, art, and human perception with over 600 interactive exhibits on Pier 15.',
    image: 'https://picsum.photos/seed/exploratorium/220/120'
  }
]

const NAV_ROUTE = [
  [-122.40512, 37.777406],
  [-122.404902, 37.777233],
  [-122.404522, 37.776931],
  [-122.404634, 37.776842],
  [-122.404912, 37.776622],
  [-122.40549, 37.776166],
  [-122.406217, 37.775591],
  [-122.406242, 37.775572],
  [-122.406308, 37.77552],
  [-122.406412, 37.775603],
  [-122.406629, 37.775776],
  [-122.406691, 37.775825],
  [-122.407091, 37.776145],
  [-122.407305, 37.776315],
  [-122.407519, 37.776485],
  [-122.40756, 37.77652],
  [-122.407768, 37.776685],
  [-122.407854, 37.776752],
  [-122.407955, 37.776833],
  [-122.408077, 37.776931],
  [-122.408136, 37.776979],
  [-122.408187, 37.777019],
  [-122.40926, 37.777874],
  [-122.409318, 37.77792],
  [-122.409388, 37.777976],
  [-122.40945, 37.778025],
  [-122.409497, 37.778063],
  [-122.409945, 37.77842],
  [-122.410373, 37.778762],
  [-122.410401, 37.778785],
  [-122.410562, 37.778913],
  [-122.410836, 37.779131],
  [-122.410867, 37.779156],
  [-122.410936, 37.779211],
  [-122.411022, 37.77928],
  [-122.411041, 37.779295],
  [-122.411239, 37.779453],
  [-122.41125, 37.779462],
  [-122.411422, 37.779599],
  [-122.411484, 37.779648],
  [-122.411817, 37.779913],
  [-122.411941, 37.780011],
  [-122.412039, 37.780091],
  [-122.412124, 37.780161],
  [-122.412367, 37.780361],
  [-122.412409, 37.780395],
  [-122.412484, 37.780452],
  [-122.412514, 37.780477],
  [-122.412528, 37.780488],
  [-122.412544, 37.780501],
  [-122.412576, 37.780527],
  [-122.412649, 37.780584],
  [-122.412975, 37.780856],
  [-122.413074, 37.780938],
  [-122.413149, 37.781001],
  [-122.413288, 37.780984],
  [-122.413602, 37.780944],
  [-122.413693, 37.780933],
  [-122.413804, 37.780919],
  [-122.414743, 37.780806],
  [-122.415245, 37.780738],
  [-122.415339, 37.780726],
  [-122.415446, 37.780713],
  [-122.415652, 37.780687],
  [-122.415924, 37.780653],
  [-122.415977, 37.780647],
  [-122.416161, 37.780623],
  [-122.416865, 37.780532],
  [-122.416918, 37.780521],
  [-122.41699, 37.780499],
  [-122.417075, 37.780473],
  [-122.417119, 37.780464],
  [-122.417285, 37.780443],
  [-122.417362, 37.780433],
  [-122.417564, 37.780407],
  [-122.418082, 37.78034],
  [-122.418476, 37.780291],
  [-122.418615, 37.780275],
  [-122.418748, 37.78026],
  [-122.418966, 37.780234],
  [-122.419012, 37.780228],
  [-122.419534, 37.780161],
  [-122.419707, 37.780138],
  [-122.419827, 37.780123],
  [-122.419844, 37.780121],
  [-122.420084, 37.780093],
  [-122.420155, 37.780088],
  [-122.420156, 37.78009],
  [-122.420185, 37.780196],
  [-122.420263, 37.780582],
  [-122.420335, 37.780945],
  [-122.42034, 37.780969],
  [-122.420357, 37.781046],
  [-122.420377, 37.781134],
  [-122.420385, 37.781176],
  [-122.420386, 37.78118],
  [-122.420453, 37.781514],
  [-122.420534, 37.781899],
  [-122.420548, 37.781976],
  [-122.420565, 37.782059],
  [-122.420573, 37.782101],
  [-122.420614, 37.782319],
  [-122.420633, 37.782507],
  [-122.420694, 37.782808],
  [-122.4207, 37.782836],
  [-122.420721, 37.782911],
  [-122.420746, 37.782995],
  [-122.420782, 37.783134],
  [-122.420829, 37.783379],
  [-122.420902, 37.783747],
  [-122.420906, 37.783769],
  [-122.420921, 37.783841],
  [-122.420939, 37.783925],
  [-122.420947, 37.783964],
  [-122.421018, 37.78431],
  [-122.421063, 37.784536],
  [-122.421064, 37.784546],
  [-122.421075, 37.78465],
  [-122.421075, 37.784655],
  [-122.42108, 37.784702],
  [-122.42109, 37.78478],
  [-122.421104, 37.784857],
  [-122.421139, 37.785036],
  [-122.421181, 37.785245],
  [-122.42126, 37.785633],
  [-122.421283, 37.78571],
  [-122.421308, 37.78579],
  [-122.421335, 37.785872],
  [-122.421399, 37.786183],
  [-122.421466, 37.786511],
  [-122.421467, 37.786517],
  [-122.421476, 37.78656],
  [-122.421493, 37.786636],
  [-122.421511, 37.786726],
  [-122.421513, 37.786738],
  [-122.421514, 37.786744],
  [-122.421585, 37.787102],
  [-122.421654, 37.787452],
  [-122.421663, 37.787496],
  [-122.421678, 37.787571],
  [-122.421693, 37.787654],
  [-122.421695, 37.787667],
  [-122.421696, 37.78767],
  [-122.421697, 37.787674],
  [-122.421698, 37.78768],
  [-122.421731, 37.787857],
  [-122.421752, 37.788038],
  [-122.42183, 37.788425],
  [-122.421853, 37.788503],
  [-122.421854, 37.788505],
  [-122.421878, 37.788587],
  [-122.421908, 37.788709],
  [-122.421959, 37.788968],
  [-122.42204, 37.789356],
  [-122.422057, 37.789433],
  [-122.422075, 37.789518],
  [-122.42208, 37.789541],
  [-122.422234, 37.790297],
  [-122.422243, 37.790343],
  [-122.422244, 37.790346],
  [-122.42226, 37.790425],
  [-122.422264, 37.790442],
  [-122.422275, 37.790496],
  [-122.422282, 37.790531],
  [-122.422428, 37.791252],
  [-122.42244, 37.791316],
  [-122.422458, 37.791394],
  [-122.422468, 37.791437],
  [-122.422488, 37.791524],
  [-122.422508, 37.791753],
  [-122.422583, 37.792129],
  [-122.422602, 37.792195],
  [-122.422603, 37.792197],
  [-122.422629, 37.792281],
  [-122.422648, 37.792332],
  [-122.422775, 37.792968],
  [-122.422776, 37.792971],
  [-122.422777, 37.792975],
  [-122.422783, 37.79301],
  [-122.422795, 37.793073],
  [-122.42281, 37.793147],
  [-122.422947, 37.793827],
  [-122.422959, 37.793887],
  [-122.422974, 37.793953],
  [-122.422975, 37.793956],
  [-122.422989, 37.794024],
  [-122.422993, 37.794064],
  [-122.422994, 37.794069],
  [-122.423015, 37.794271],
  [-122.423106, 37.794724],
  [-122.423115, 37.794769],
  [-122.423138, 37.794832],
  [-122.423167, 37.794908],
  [-122.423175, 37.794951],
  [-122.423235, 37.795257],
  [-122.423293, 37.795619],
  [-122.423293, 37.795621],
  [-122.4233, 37.795662],
  [-122.423316, 37.79576],
  [-122.423334, 37.795856],
  [-122.423344, 37.795907],
  [-122.423346, 37.795919],
  [-122.423346, 37.795921],
  [-122.423414, 37.796253],
  [-122.423421, 37.796291],
  [-122.423495, 37.796637],
  [-122.423508, 37.796707],
  [-122.423523, 37.796796],
  [-122.423529, 37.796823],
  [-122.42353, 37.796827],
  [-122.423625, 37.797278],
  [-122.423682, 37.79746],
  [-122.423703, 37.797568],
  [-122.423718, 37.797638],
  [-122.423736, 37.797721],
  [-122.423741, 37.797743],
  [-122.423741, 37.797745],
  [-122.423756, 37.797818],
  [-122.423777, 37.798015],
  [-122.423853, 37.798392],
  [-122.423876, 37.798497],
  [-122.423895, 37.798571],
  [-122.423925, 37.798656],
  [-122.423998, 37.798978],
  [-122.424061, 37.799313],
  [-122.424075, 37.799386],
  [-122.424083, 37.79943],
  [-122.4241, 37.79951],
  [-122.424113, 37.799579],
  [-122.424117, 37.799599],
  [-122.424117, 37.799601],
  [-122.424117, 37.799603],
  [-122.424161, 37.799815],
  [-122.424199, 37.799995],
  [-122.424202, 37.800009],
  [-122.424265, 37.800318],
  [-122.424274, 37.80036],
  [-122.424293, 37.800434],
  [-122.424294, 37.800436],
  [-122.424315, 37.800508],
  [-122.424341, 37.800622],
  [-122.424342, 37.800628],
  [-122.424351, 37.80067],
  [-122.424393, 37.800871],
  [-122.424403, 37.800922],
  [-122.424466, 37.801229],
  [-122.424467, 37.801232],
  [-122.424473, 37.801261],
  [-122.424488, 37.801348],
  [-122.424635, 37.801346],
  [-122.424653, 37.801346],
  [-122.424673, 37.801346],
  [-122.424766, 37.801338],
  [-122.424956, 37.801315],
  [-122.425417, 37.801256],
  [-122.42568, 37.801222],
  [-122.426078, 37.801171],
  [-122.426081, 37.801171],
  [-122.426111, 37.801167],
  [-122.426211, 37.801156],
  [-122.426315, 37.801143],
  [-122.42632, 37.801142],
  [-122.426749, 37.801086],
  [-122.427307, 37.801015],
  [-122.427739, 37.80096],
  [-122.427766, 37.800957],
  [-122.427852, 37.800946],
  [-122.42796, 37.800932],
  [-122.428007, 37.800926],
  [-122.42801, 37.800926],
  [-122.428248, 37.800893],
  [-122.428606, 37.800847],
  [-122.428714, 37.800833],
  [-122.429385, 37.800748],
  [-122.429401, 37.800746],
  [-122.429499, 37.800733],
  [-122.429588, 37.800722],
  [-122.429629, 37.800717],
  [-122.430328, 37.800628],
  [-122.430805, 37.800567],
  [-122.430973, 37.800546],
  [-122.43102, 37.80054],
  [-122.431047, 37.800536],
  [-122.431141, 37.800524],
  [-122.431232, 37.800513],
  [-122.432001, 37.800415],
  [-122.432655, 37.800332],
  [-122.432686, 37.800328],
  [-122.432786, 37.800315],
  [-122.432767, 37.800221],
  [-122.432751, 37.800146],
  [-122.432691, 37.799849],
  [-122.433217, 37.799782]
]

const NAV_MANEUVERS = [
  { idx: 2, dir: '↱', instruction: 'Turn right onto Harrison Street' },
  { idx: 8, dir: '↱', instruction: 'Turn right onto 7th Street' },
  { idx: 54, dir: '↰', instruction: 'Turn left onto McAllister Street' },
  { idx: 86, dir: '↱', instruction: 'Turn right onto Van Ness Avenue' },
  { idx: 248, dir: '↰', instruction: 'Turn left onto Lombard Street' },
  { idx: 288, dir: '↰', instruction: 'Turn left onto Buchanan Street' },
  { idx: 291, dir: '↱', instruction: 'Turn right onto Moulton Street' },
  { idx: 292, dir: '📍', instruction: 'Arrived at destination' }
]

const WAREHOUSE_COORD = [-87.650294, 41.881734]

const PICKUP_LOCATIONS = [
  {
    id: 'pickup-1',
    label: 'Lincoln Park',
    lngLat: [-87.63645, 41.921703],
    color: '#E91E63'
  },
  {
    id: 'pickup-2',
    label: 'Wicker Park',
    lngLat: [-87.682308, 41.908904],
    color: '#9C27B0'
  },
  {
    id: 'pickup-3',
    label: 'Hyde Park',
    lngLat: [-87.591664, 41.7943],
    color: '#FF9800'
  }
]

const TRUCK_PATHS = [
  {
    id: 'truck-1',
    color: '#FF5A36',
    label: 'Truck A',
    path: [
      [-87.650294, 41.881734],
      [-87.647945, 41.881773],
      [-87.645757, 41.882364],
      [-87.646015, 41.886212],
      [-87.649098, 41.889962],
      [-87.652735, 41.892485],
      [-87.656954, 41.895349],
      [-87.660053, 41.899849],
      [-87.660891, 41.903793],
      [-87.661536, 41.907216],
      [-87.664336, 41.910452],
      [-87.662519, 41.910709],
      [-87.660856, 41.910738],
      [-87.659067, 41.910764],
      [-87.655697, 41.910804],
      [-87.653602, 41.910837],
      [-87.651133, 41.910879],
      [-87.649796, 41.9109],
      [-87.648397, 41.910924],
      [-87.646008, 41.910926],
      [-87.641787, 41.910997],
      [-87.63858, 41.911039],
      [-87.638639, 41.912933],
      [-87.638747, 41.916353],
      [-87.638631, 41.918325],
      [-87.63614, 41.918684],
      [-87.636405, 41.920263],
      [-87.63645, 41.921703],
      [-87.636405, 41.920263],
      [-87.63614, 41.918684],
      [-87.638631, 41.918325],
      [-87.638747, 41.916353],
      [-87.638639, 41.912933],
      [-87.63858, 41.911039],
      [-87.641787, 41.910997],
      [-87.646008, 41.910926],
      [-87.648397, 41.910924],
      [-87.649796, 41.9109],
      [-87.651133, 41.910879],
      [-87.653602, 41.910837],
      [-87.655697, 41.910804],
      [-87.659067, 41.910764],
      [-87.660856, 41.910738],
      [-87.662519, 41.910709],
      [-87.664336, 41.910452],
      [-87.661536, 41.907216],
      [-87.660891, 41.903793],
      [-87.660053, 41.899849],
      [-87.656954, 41.895349],
      [-87.652735, 41.892485],
      [-87.649098, 41.889962],
      [-87.646015, 41.886212],
      [-87.645757, 41.882364],
      [-87.647945, 41.881773],
      [-87.650294, 41.881734]
    ]
  },
  {
    id: 'truck-2',
    color: '#FFC107',
    label: 'Truck B',
    path: [
      [-87.650294, 41.881734],
      [-87.648655, 41.881761],
      [-87.64736, 41.881782],
      [-87.64573, 41.881801],
      [-87.645685, 41.885013],
      [-87.646101, 41.886419],
      [-87.647638, 41.88874],
      [-87.650697, 41.891004],
      [-87.652661, 41.892432],
      [-87.655395, 41.894302],
      [-87.657382, 41.895695],
      [-87.659121, 41.897849],
      [-87.660726, 41.901461],
      [-87.660891, 41.903793],
      [-87.660873, 41.905861],
      [-87.662221, 41.90796],
      [-87.664109, 41.91009],
      [-87.664656, 41.910674],
      [-87.666053, 41.910666],
      [-87.666678, 41.910655],
      [-87.668209, 41.910625],
      [-87.670658, 41.910584],
      [-87.672994, 41.910548],
      [-87.675021, 41.910528],
      [-87.67731, 41.910495],
      [-87.678098, 41.910483],
      [-87.679971, 41.910445],
      [-87.682336, 41.909945],
      [-87.682308, 41.908904],
      [-87.682336, 41.909945],
      [-87.679971, 41.910445],
      [-87.678098, 41.910483],
      [-87.67731, 41.910495],
      [-87.675021, 41.910528],
      [-87.672994, 41.910548],
      [-87.670658, 41.910584],
      [-87.668209, 41.910625],
      [-87.666678, 41.910655],
      [-87.666053, 41.910666],
      [-87.664656, 41.910674],
      [-87.664109, 41.91009],
      [-87.662221, 41.90796],
      [-87.660873, 41.905861],
      [-87.660891, 41.903793],
      [-87.660726, 41.901461],
      [-87.659121, 41.897849],
      [-87.657382, 41.895695],
      [-87.655395, 41.894302],
      [-87.652661, 41.892432],
      [-87.650697, 41.891004],
      [-87.647638, 41.88874],
      [-87.646101, 41.886419],
      [-87.645685, 41.885013],
      [-87.64573, 41.881801],
      [-87.64736, 41.881782],
      [-87.648655, 41.881761],
      [-87.650294, 41.881734]
    ]
  },
  {
    id: 'truck-3',
    color: '#00C853',
    label: 'Truck C',
    path: [
      [-87.650294, 41.881734],
      [-87.646881, 41.881788],
      [-87.645958, 41.879116],
      [-87.645687, 41.874009],
      [-87.644976, 41.869422],
      [-87.644384, 41.857773],
      [-87.645693, 41.853227],
      [-87.645743, 41.852016],
      [-87.644151, 41.848852],
      [-87.640432, 41.846815],
      [-87.635238, 41.846776],
      [-87.630109, 41.847114],
      [-87.622411, 41.847889],
      [-87.612672, 41.84745],
      [-87.60817, 41.836799],
      [-87.606497, 41.831634],
      [-87.601574, 41.826791],
      [-87.598336, 41.820978],
      [-87.591637, 41.813337],
      [-87.586509, 41.807612],
      [-87.581745, 41.803117],
      [-87.582195, 41.799669],
      [-87.585511, 41.7996],
      [-87.587449, 41.796161],
      [-87.589393, 41.795443],
      [-87.592006, 41.79546],
      [-87.591675, 41.794763],
      [-87.591664, 41.7943],
      [-87.591675, 41.794763],
      [-87.592006, 41.79546],
      [-87.589393, 41.795443],
      [-87.587449, 41.796161],
      [-87.585511, 41.7996],
      [-87.582195, 41.799669],
      [-87.581745, 41.803117],
      [-87.586509, 41.807612],
      [-87.591637, 41.813337],
      [-87.598336, 41.820978],
      [-87.601574, 41.826791],
      [-87.606497, 41.831634],
      [-87.60817, 41.836799],
      [-87.612672, 41.84745],
      [-87.622411, 41.847889],
      [-87.630109, 41.847114],
      [-87.635238, 41.846776],
      [-87.640432, 41.846815],
      [-87.644151, 41.848852],
      [-87.645743, 41.852016],
      [-87.645693, 41.853227],
      [-87.644384, 41.857773],
      [-87.644976, 41.869422],
      [-87.645687, 41.874009],
      [-87.645958, 41.879116],
      [-87.646881, 41.881788],
      [-87.650294, 41.881734]
    ]
  }
]

const TERRAIN_TRAIL_COORDS = [
  [14.405, 40.814],
  [14.412, 40.816],
  [14.418, 40.8178],
  [14.422, 40.819],
  [14.4248, 40.8175],
  [14.426, 40.8211]
]

const CUSTOM_LAYERS = [
  'route-outline',
  'route-line',
  'nav-puck-layer',
  'earthquakes-heat',
  'earthquakes-point',
  'delivery-zone',
  'wind-layer',
  'isochrone-fill-10',
  'isochrone-fill-20',
  'isochrone-fill-30',
  'isochrone-line-10',
  'isochrone-line-20',
  'isochrone-line-30',
  'trail-truck-1',
  'trail-truck-2',
  'trail-truck-3',
  'terrain-trail'
]
const CUSTOM_SOURCES = [
  'route-source',
  'nav-puck-source',
  'earthquakes-source',
  'delivery-zone-source',
  'mapbox-dem',
  'raster-array-source',
  'isochrone-source',
  'trail-truck-1-source',
  'trail-truck-2-source',
  'trail-truck-3-source',
  'terrain-trail-source'
]

const COLOR_THEME_FILTERS = {
  default: 'none',
  faded: 'saturate(0.35) brightness(1.09) contrast(0.92)',
  monochrome: 'grayscale(0.9) contrast(1.1)',
  ocean: 'hue-rotate(20deg) saturate(1.15) brightness(0.97)',
  warm: 'sepia(0.28) saturate(1.25) hue-rotate(-8deg)',
  vivid: 'saturate(1.6) contrast(1.12)'
}

const GLOBE_BOUNDS = [
  [-65, -65],
  [65, 65]
]
const ROTATION_SPEED_FACTOR = 0.02
const DURATION = 6000

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const mapRef = useRef()
  const mapContainerRef = useRef()
  const markersRef = useRef([])
  const animFrameRef = useRef(null)
  const globeRotatingRef = useRef(false)
  const rotationTypeRef = useRef(null) // 'globe' | 'terrain'
  const startCameraRotationRef = useRef(null)
  const pendingTimeoutRef = useRef(null)
  const resumeTimeoutRef = useRef(null)
  const activationIdRef = useRef(0)

  const [activeUseCase, setActiveUseCase] = useState('globe')
  const [mapLoaded, setMapLoaded] = useState(false)

  // Controls state
  const [lightPreset, setLightPreset] = useState('day')
  const [colorTheme, setColorTheme] = useState('default')
  const [isSatellite, setIsSatellite] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [showLandmarks, setShowLandmarks] = useState(true)

  // ─── Map Init ──────────────────────────────────────────────────────────────

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_YOUR_MAPBOX_ACCESS_TOKEN
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      bounds: GLOBE_BOUNDS,
      pitch: 0,
      bearing: 0
    })

    const startCameraRotation = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      globeRotatingRef.current = true
      const step = () => {
        if (!globeRotatingRef.current || !mapRef.current) return
        if (
          rotationTypeRef.current === 'terrain' ||
          rotationTypeRef.current === 'buildings'
        ) {
          mapRef.current.setBearing(mapRef.current.getBearing() + 0.05)
        } else {
          const center = mapRef.current.getCenter()
          mapRef.current.setCenter([
            center.lng - ROTATION_SPEED_FACTOR,
            center.lat
          ])
        }
        animFrameRef.current = requestAnimationFrame(step)
      }
      animFrameRef.current = requestAnimationFrame(step)
    }
    startCameraRotationRef.current = startCameraRotation

    const stopCameraRotation = () => {
      // Don't interfere with scenes that manage their own animation loop
      if (rotationTypeRef.current === 'navigation') return
      if (rotationTypeRef.current === 'asset-tracking') return
      globeRotatingRef.current = false
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      // Resume after 10s of idle if a rotation-capable use case is active
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
      if (rotationTypeRef.current) {
        resumeTimeoutRef.current = setTimeout(() => {
          resumeTimeoutRef.current = null
          startCameraRotation()
        }, 10000)
      }
    }

    mapRef.current.on('load', () => {
      setMapLoaded(true)
      rotationTypeRef.current = 'globe'
      startCameraRotation()
    })

    // Stop rotation when user interacts directly with the map; resumes after idle
    mapRef.current.on('mousedown', stopCameraRotation)
    mapRef.current.on('touchstart', stopCameraRotation)
    mapRef.current.on('wheel', stopCameraRotation)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      mapRef.current.remove()
    }
  }, [])

  // ─── Config effects ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!mapLoaded) return
    mapRef.current.setConfigProperty('basemap', 'lightPreset', lightPreset)
  }, [lightPreset, mapLoaded])

  useEffect(() => {
    if (!mapLoaded) return
    mapRef.current.setConfigProperty(
      'basemap',
      'showPointOfInterestLabels',
      showLandmarks
    )
    mapRef.current.setConfigProperty(
      'basemap',
      'showTransitLabels',
      showLandmarks
    )
  }, [showLandmarks, mapLoaded])

  useEffect(() => {
    if (!mapLoaded) return
    mapRef.current.setConfigProperty('basemap', 'showPlaceLabels', showLabels)
  }, [showLabels, mapLoaded])

  // Color theme via CSS filter on the map container
  useEffect(() => {
    if (!mapContainerRef.current) return
    mapContainerRef.current.style.filter =
      COLOR_THEME_FILTERS[colorTheme] ?? 'none'
  }, [colorTheme])

  // Satellite layer
  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current

    if (isSatellite) {
      map.setConfigProperty('basemap', 'show3dObjects', false)
      if (!map.getSource('satellite-source')) {
        map.addSource('satellite-source', {
          type: 'raster',
          url: 'mapbox://mapbox.satellite',
          tileSize: 256
        })
      }
      if (!map.getLayer('satellite-layer')) {
        map.addLayer({
          id: 'satellite-layer',
          type: 'raster',
          source: 'satellite-source',
          slot: 'middle'
        })
      }
    } else {
      map.setConfigProperty('basemap', 'show3dObjects', true)
      if (map.getLayer('satellite-layer')) map.removeLayer('satellite-layer')
      if (map.getSource('satellite-source'))
        map.removeSource('satellite-source')
    }
  }, [isSatellite, mapLoaded])

  // ─── Cleanup ───────────────────────────────────────────────────────────────

  const cleanup = useCallback(() => {
    activationIdRef.current++
    globeRotatingRef.current = false
    rotationTypeRef.current = null
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current)
      pendingTimeoutRef.current = null
    }
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const map = mapRef.current
    CUSTOM_LAYERS.forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id)
    })
    CUSTOM_SOURCES.forEach((id) => {
      if (id === 'mapbox-dem') {
        map.setTerrain(null)
      }
      if (map.getSource(id)) map.removeSource(id)
    })
  }, [])

  // ─── Use Case Handlers ─────────────────────────────────────────────────────

  const activateGlobe = useCallback(() => {
    setLightPreset('day')
    setColorTheme('default')
    rotationTypeRef.current = 'globe'
    const aid = activationIdRef.current
    mapRef.current.fitBounds(GLOBE_BOUNDS, {
      pitch: 0,
      bearing: 0,
      duration: DURATION
    })
    mapRef.current.once('moveend', () => {
      if (activationIdRef.current !== aid) return
      if (startCameraRotationRef.current) startCameraRotationRef.current()
    })
  }, [])

  const activate3DBuildings = useCallback(() => {
    setLightPreset('dusk')
    setColorTheme('warm')
    rotationTypeRef.current = 'buildings'
    const aid = activationIdRef.current
    mapRef.current.flyTo({
      center: [-74.0145, 40.7023],
      zoom: 16.2,
      pitch: 62,
      bearing: -20,
      duration: DURATION
    })
    mapRef.current.once('moveend', () => {
      if (activationIdRef.current !== aid) return
      pendingTimeoutRef.current = setTimeout(() => {
        pendingTimeoutRef.current = null
        if (activationIdRef.current !== aid) return
        if (startCameraRotationRef.current) startCameraRotationRef.current()
      }, 300)
    })
  }, [])

  const activateMarkers = useCallback(() => {
    setLightPreset('day')
    setColorTheme('default')
    const aid = activationIdRef.current
    mapRef.current.flyTo({
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
              '/220/120',
              '/60/60'
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
          .addTo(mapRef.current)

        el.addEventListener('mouseenter', () =>
          marker.getPopup().addTo(mapRef.current)
        )
        el.addEventListener('mouseleave', () => marker.getPopup().remove())

        markersRef.current.push(marker)
      })
    }, DURATION * 0.65)
  }, [])

  const activateDataOverlay = useCallback(async () => {
    setLightPreset('night')
    setColorTheme('default')
    mapRef.current.flyTo({
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
      const map = mapRef.current
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
            'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
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
            'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1]
          }
        })
      }
    } catch (e) {
      console.error('Failed to load earthquake data:', e)
    }
  }, [])

  const activateRaster = useCallback(() => {
    setLightPreset('night')
    setColorTheme('vivid')
    rotationTypeRef.current = 'globe'
    const aid = activationIdRef.current
    const map = mapRef.current
    map.flyTo({
      center: [-28, 47],
      zoom: 2,
      pitch: 0,
      bearing: 0,
      duration: DURATION
    })
    map.once('moveend', () => {
      if (activationIdRef.current !== aid) return
      if (startCameraRotationRef.current) startCameraRotationRef.current()
    })

    map.addSource('raster-array-source', {
      type: 'raster-array',
      url: 'mapbox://rasterarrayexamples.gfs-winds',
      tileSize: 512
    })
    map.addLayer({
      id: 'wind-layer',
      type: 'raster-particle',
      source: 'raster-array-source',
      'source-layer': '10winds',
      paint: {
        'raster-particle-speed-factor': 0.4,
        'raster-particle-fade-opacity-factor': 0.9,
        'raster-particle-reset-rate-factor': 0.4,
        'raster-particle-count': 4000,
        'raster-particle-max-speed': 40,
        'raster-particle-color': [
          'interpolate',
          ['linear'],
          ['raster-particle-speed'],
          1.5,
          'rgba(134,163,171,256)',
          2.5,
          'rgba(126,152,188,256)',
          4.12,
          'rgba(110,143,208,256)',
          4.63,
          'rgba(110,143,208,256)',
          6.17,
          'rgba(15,147,167,256)',
          7.72,
          'rgba(15,147,167,256)',
          9.26,
          'rgba(57,163,57,256)',
          10.29,
          'rgba(57,163,57,256)',
          11.83,
          'rgba(194,134,62,256)',
          13.37,
          'rgba(194,134,63,256)',
          14.92,
          'rgba(200,66,13,256)',
          16.46,
          'rgba(200,66,13,256)',
          18.0,
          'rgba(210,0,50,256)',
          20.06,
          'rgba(215,0,50,256)',
          21.6,
          'rgba(175,80,136,256)',
          23.66,
          'rgba(175,80,136,256)',
          25.21,
          'rgba(117,74,147,256)',
          27.78,
          'rgba(117,74,147,256)',
          29.32,
          'rgba(68,105,141,256)',
          31.89,
          'rgba(68,105,141,256)',
          33.44,
          'rgba(194,251,119,256)',
          42.18,
          'rgba(194,251,119,256)',
          43.72,
          'rgba(241,255,109,256)',
          48.87,
          'rgba(241,255,109,256)',
          50.41,
          'rgba(256,256,256,256)',
          57.61,
          'rgba(256,256,256,256)',
          59.16,
          'rgba(0,256,256,256)',
          68.93,
          'rgba(0,256,256,256)',
          69.44,
          'rgba(256,37,256,256)'
        ]
      }
    })
  }, [])

  const activateNavigation = useCallback(() => {
    setLightPreset('dusk')
    setColorTheme('default')
    rotationTypeRef.current = 'navigation'
    const map = mapRef.current
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
      paint: { 'line-color': '#ffffff', 'line-width': 9, 'line-opacity': 0.4 }
    })
    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route-source',
      slot: 'top',
      paint: { 'line-color': '#4264FB', 'line-width': 5 }
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
        const ctx = canvas.getContext('2d')
        // Blue circle with white border
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2)
        ctx.fillStyle = '#4264FB'
        ctx.fill()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 4
        ctx.stroke()
        // White upward arrow
        ctx.beginPath()
        ctx.moveTo(size / 2, 16)
        ctx.lineTo(size - 18, size - 14)
        ctx.lineTo(size / 2, size - 20)
        ctx.lineTo(18, size - 14)
        ctx.closePath()
        ctx.fillStyle = 'white'
        ctx.fill()
        const imgData = ctx.getImageData(0, 0, size, size)
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
  }, [])

  const activateAssetTracking = useCallback(() => {
    setLightPreset('day')
    setColorTheme('default')
    rotationTypeRef.current = 'asset-tracking'
    const map = mapRef.current
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
            paint: { 'fill-color': fill },
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
              'line-dasharray': [4, 2]
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
          'line-opacity': 0.65
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
  }, [])

  const activateTerrain = useCallback(() => {
    setLightPreset('dawn')
    setColorTheme('faded')
    setIsSatellite(true)
    rotationTypeRef.current = 'terrain'
    const aid = activationIdRef.current
    const map = mapRef.current

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
        'line-opacity': 0.9
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
  }, [])

  // ─── Use Case Router ───────────────────────────────────────────────────────

  const handleUseCaseSelect = useCallback(
    (id) => {
      if (!mapLoaded) return

      // Globe View: re-clicking restarts the rotation
      if (id === 'globe') {
        cleanup()
        setActiveUseCase('globe')
        activateGlobe()
        return
      }

      if (id === activeUseCase) return

      cleanup()
      setActiveUseCase(id)

      switch (id) {
        case 'buildings':
          activate3DBuildings()
          break
        case 'markers':
          activateMarkers()
          break
        case 'data-overlay':
          activateDataOverlay()
          break
        case 'raster':
          activateRaster()
          break
        case 'navigation':
          activateNavigation()
          break
        case 'asset-tracking':
          activateAssetTracking()
          break
        case 'terrain':
          activateTerrain()
          break
      }
    },
    [
      mapLoaded,
      activeUseCase,
      cleanup,
      activateGlobe,
      activate3DBuildings,
      activateMarkers,
      activateDataOverlay,
      activateRaster,
      activateNavigation,
      activateAssetTracking,
      activateTerrain
    ]
  )

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div id='map-container' ref={mapContainerRef} />
      {/* <SceneInfo sceneId={activeUseCase} /> */}
      <UseCasePanel activeId={activeUseCase} onSelect={handleUseCaseSelect} />
      <MapControls
        lightPreset={lightPreset}
        setLightPreset={setLightPreset}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
        isSatellite={isSatellite}
        setIsSatellite={setIsSatellite}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        showLandmarks={showLandmarks}
        setShowLandmarks={setShowLandmarks}
      />
    </>
  )
}
