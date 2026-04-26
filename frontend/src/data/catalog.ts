import type { Product, Category } from '../types'

export interface CategoryMeta {
  id: Category | 'all'
  label: string
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'all',             label: 'Todos' },
  { id: 'rodilleras',      label: 'Rodilleras' },
  { id: 'tobilleras',      label: 'Tobilleras' },
  { id: 'munequeras',      label: 'Muñequeras' },
  { id: 'coderas',         label: 'Coderas' },
  { id: 'fajas',           label: 'Fajas & Espalda' },
  { id: 'inmovilizadores', label: 'Inmovilizadores' },
  { id: 'otros',           label: 'Otros' },
]

export const CAT_LABELS: Record<string, string> = {
  rodilleras: 'Rodilleras',
  tobilleras: 'Tobilleras',
  munequeras: 'Muñequeras',
  coderas: 'Coderas',
  fajas: 'Fajas & Espalda',
  inmovilizadores: 'Inmovilizadores',
  otros: 'Otros',
}

export const CATALOG: Product[] = [
  // RODILLERAS
  { id: '000A',  code: '000A',   name: 'Rodillera Orificio Abierta Universal',         cat: 'rodilleras', variants: ['CORTA', 'LARGA'] },
  { id: '01',    code: '01',     name: 'Rodillera Tubular Lisa',                        cat: 'rodilleras', sizes: [1, 2, 3, 4, 5] },
  { id: '02',    code: '02',     name: 'Rodillera Tubular Orificio',                    cat: 'rodilleras', sizes: [1, 2, 3, 4, 5] },
  { id: '04',    code: '04',     name: 'Rodillera Orificio y Velcro',                   cat: 'rodilleras', sizes: [1, 2, 3, 4, 5] },
  { id: '04A',   code: '04A',    name: 'Rodillera Orificio y Velcro Abierta',           cat: 'rodilleras', sizes: [1, 2, 3, 4, 5] },
  { id: '05',    code: '05',     name: 'Rodillera Orificio Velcro Flejes Laterales',    cat: 'rodilleras', sizes: [1, 2, 3, 4, 5] },
  { id: '05A',   code: '05A',    name: 'Rodillera Velcro Flejes Lat. Abierta',          cat: 'rodilleras', sizes: [1, 2, 3, 4, 5] },
  { id: '06',    code: '06',     name: 'Rodillera Orificio Velcro Monocentrica',        cat: 'rodilleras', sizes: [1, 2, 3, 4, 5] },
  { id: '06A',   code: '06A',    name: 'Rodillera Velcro Monocentrica Abierta',         cat: 'rodilleras', sizes: [1, 2, 3, 4, 5] },
  { id: '120',   code: '120',    name: 'Suspensor Bajo Rodilla',                        cat: 'rodilleras', sizes: [1, 2, 3] },
  { id: '121D',  code: '121',    name: 'Suspensor Sobre Rodilla Derecho',               cat: 'rodilleras', sizes: [1, 2, 3] },
  { id: '121I',  code: '121',    name: 'Suspensor Sobre Rodilla Izquierdo',             cat: 'rodilleras', sizes: [1, 2, 3] },
  { id: '134',   code: '134',    name: 'Cincha Rotuliana',                              cat: 'rodilleras', sizes: [1, 2, 3] },
  { id: '015',   code: '015',    name: 'Muslera',                                       cat: 'rodilleras', sizes: [1, 2, 3, 4, 5] },
  // TOBILLERAS
  { id: '030',   code: '030',    name: 'Tobillera Corta',                               cat: 'tobilleras', sizes: [1, 2, 3, 4] },
  { id: '031',   code: '031',    name: 'Tobillera Larga',                               cat: 'tobilleras', sizes: [1, 2, 3, 4] },
  { id: '031A',  code: '031A',   name: 'Tobillera Larga Abierta',                       cat: 'tobilleras', sizes: [1, 2, 3, 4] },
  { id: '033',   code: '033',    name: 'Tobillera Ajuste en 8',                         cat: 'tobilleras', sizes: [1, 2, 3, 4] },
  { id: '034A',  code: '034A',   name: 'Tobillera Ballena y Cordón',                    cat: 'tobilleras', sizes: [1, 2, 3, 4] },
  { id: '036',   code: '036',    name: 'Inmovilizador de Tobillo',                      cat: 'tobilleras', sizes: [1, 2, 3, 4] },
  { id: '055',   code: '055',    name: 'Gemelera',                                      cat: 'tobilleras', sizes: [1, 2, 3, 4, 5] },
  { id: '039D',  code: '039',    name: 'Corrector de Juanetes Derecho',                 cat: 'tobilleras', sizes: [1, 2] },
  { id: '039I',  code: '039',    name: 'Corrector de Juanetes Izquierdo',               cat: 'tobilleras', sizes: [1, 2] },
  // MUÑEQUERAS
  { id: '040',   code: '040',    name: 'Muñequera con Velcro',                          cat: 'munequeras', sizes: [0, 1, 2, 3] },
  { id: '041',   code: '041',    name: 'Muñequera Boomerang con Pulgar',                cat: 'munequeras', sizes: [0, 1, 2, 3] },
  { id: '042',   code: '042',    name: 'Muñequera Boomerang con Fleje',                 cat: 'munequeras', sizes: [0, 1, 2, 3] },
  { id: '043',   code: '043',    name: 'Muñequera Dedo Libre',                          cat: 'munequeras', sizes: [0, 1, 2, 3] },
  { id: '045D',  code: '045',    name: 'Inmovilizador Muñeca Largo Derecho',            cat: 'munequeras', sizes: [1, 2, 3] },
  { id: '045I',  code: '045',    name: 'Inmovilizador Muñeca Largo Izquierdo',          cat: 'munequeras', sizes: [1, 2, 3] },
  { id: '046',   code: '046',    name: 'Inmov. Muñeca con Inmov. de Pulgar',            cat: 'munequeras', universal: true },
  { id: '047D',  code: '047',    name: 'Inmovilizador Muñeca Corto Derecho',            cat: 'munequeras', sizes: [1, 2, 3] },
  { id: '047I',  code: '047',    name: 'Inmovilizador Muñeca Corto Izquierdo',          cat: 'munequeras', sizes: [1, 2, 3] },
  // CODERAS
  { id: '050',   code: '050',    name: 'Codera Larga',                                  cat: 'coderas', sizes: [1, 2, 3] },
  { id: '051',   code: '051',    name: 'Codera Larga con Orificio y Velcro',            cat: 'coderas', sizes: [1, 2, 3] },
  { id: '052',   code: '052',    name: 'Codera Anticodo-Tenista',                       cat: 'coderas', sizes: [1, 2, 3, 4] },
  { id: '053',   code: '053',    name: 'Codera Larga con Orificio',                     cat: 'coderas', sizes: [1, 2, 3] },
  // FAJAS Y ESPALDA
  { id: '020',   code: '020',    name: 'Faja Lumbar',                                   cat: 'fajas', sizes: [1, 2, 3, 4, 5] },
  { id: '021',   code: '021',    name: 'Faja Intercostal',                              cat: 'fajas', sizes: [1, 2, 3, 4, 5] },
  { id: '022',   code: '022',    name: 'Faja Lumbar con Ballenas',                      cat: 'fajas', sizes: [1, 2, 3, 4, 5] },
  { id: '023',   code: '023',    name: 'Faja Doble Ajuste con Ballenas',                cat: 'fajas', sizes: [1, 2, 3, 4, 5] },
  { id: '624',   code: '624',    name: 'Faja Alta Compresión 24cm',                     cat: 'fajas', sizes: ['T1', 'T2', 'T3', 'T4', 'T5'] },
  { id: '628',   code: '628',    name: 'Faja Alta Compresión 28cm',                     cat: 'fajas', sizes: ['T1', 'T2', 'T3', 'T4', 'T5'] },
  { id: '060',   code: '060',    name: 'Calza Reductora',                               cat: 'fajas', sizes: [1, 2, 3, 4] },
  { id: '027',   code: '027',    name: 'Corrector Postural de Espalda',                 cat: 'fajas', sizes: [1, 2, 3] },
  { id: '026',   code: '026',    name: 'Hombrera Universal',                            cat: 'fajas', universal: true },
  { id: '024',   code: '024',    name: 'Soporte de Clavícula (Strap)',                  cat: 'fajas', sizes: [0, 1, 2, 3] },
  { id: 'CABEST',code: 'CABEST', name: 'Cabestrillo Velpeau Vietnam',                  cat: 'fajas', universal: true },
  // INMOVILIZADORES
  { id: 'INM50', code: 'INM.50', name: 'Inmovilizador de Rodilla Velour 50cm',          cat: 'inmovilizadores', sizes: [0, 1, 2, 3, 4] },
  { id: 'INM60', code: 'INM.60', name: 'Inmovilizador de Rodilla Velour 60cm',          cat: 'inmovilizadores', sizes: [0, 1, 2, 3, 4] },
  { id: 'INM65', code: 'INM.65', name: 'Inmovilizador de Rodilla Velour 65cm',          cat: 'inmovilizadores', sizes: [0, 1, 2, 3, 4] },
  { id: 'TPANEL',code: 'TPANEL', name: 'Inmov. Rodilla Tripanel Velour 55cm',           cat: 'inmovilizadores', universal: true },
  { id: 'FUNDA', code: 'FUNDA',  name: 'Funda Bota Walker Velour 8mm',                  cat: 'inmovilizadores', sizes: [0, 1, 2, 3, 4] },
  // OTROS
  { id: 'MASCAR',code: 'MASC',   name: 'Máscara Simple',                               cat: 'otros', universal: true },
  { id: 'MASCB', code: 'MASCB',  name: 'Máscara con Babero',                           cat: 'otros', universal: true },
  { id: 'TAPAB', code: 'TAPAB',  name: 'Tapaboca',                                     cat: 'otros', universal: true },
]
