import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from '../users/entities/user.entity'
import { Product } from '../products/entities/product.entity'

const ADMIN_EMAIL    = 'adherneo@hotmail.com'
const ADMIN_PASSWORD = 'admin123123'

const PRODUCTS: { code: string; name: string; category: string; sizes: string[] }[] = [
  // Rodilleras
  { code: '000A',   name: 'Rodillera Orificio Abierta Universal',       category: 'rodilleras',      sizes: ['CORTA','LARGA'] },
  { code: '01',     name: 'Rodillera Tubular Lisa',                      category: 'rodilleras',      sizes: ['1','2','3','4','5'] },
  { code: '02',     name: 'Rodillera Tubular Orificio',                  category: 'rodilleras',      sizes: ['1','2','3','4','5'] },
  { code: '04',     name: 'Rodillera Orificio y Velcro',                 category: 'rodilleras',      sizes: ['1','2','3','4','5'] },
  { code: '04A',    name: 'Rodillera Orificio y Velcro Abierta',         category: 'rodilleras',      sizes: ['1','2','3','4','5'] },
  { code: '05',     name: 'Rodillera Orificio Velcro Flejes Laterales',  category: 'rodilleras',      sizes: ['1','2','3','4','5'] },
  { code: '05A',    name: 'Rodillera Velcro Flejes Lat. Abierta',        category: 'rodilleras',      sizes: ['1','2','3','4','5'] },
  { code: '06',     name: 'Rodillera Orificio Velcro Monocentrica',      category: 'rodilleras',      sizes: ['1','2','3','4','5'] },
  { code: '06A',    name: 'Rodillera Velcro Monocentrica Abierta',       category: 'rodilleras',      sizes: ['1','2','3','4','5'] },
  { code: '120',    name: 'Suspensor Bajo Rodilla',                      category: 'rodilleras',      sizes: ['1','2','3'] },
  { code: '121D',   name: 'Suspensor Sobre Rodilla Derecho',             category: 'rodilleras',      sizes: ['1','2','3'] },
  { code: '121I',   name: 'Suspensor Sobre Rodilla Izquierdo',           category: 'rodilleras',      sizes: ['1','2','3'] },
  { code: '134',    name: 'Cincha Rotuliana',                            category: 'rodilleras',      sizes: ['1','2','3'] },
  { code: '015',    name: 'Muslera',                                     category: 'rodilleras',      sizes: ['1','2','3','4','5'] },
  // Tobilleras
  { code: '030',    name: 'Tobillera Corta',                             category: 'tobilleras',      sizes: ['1','2','3','4'] },
  { code: '031',    name: 'Tobillera Larga',                             category: 'tobilleras',      sizes: ['1','2','3','4'] },
  { code: '031A',   name: 'Tobillera Larga Abierta',                     category: 'tobilleras',      sizes: ['1','2','3','4'] },
  { code: '033',    name: 'Tobillera Ajuste en 8',                       category: 'tobilleras',      sizes: ['1','2','3','4'] },
  { code: '034A',   name: 'Tobillera Ballena y Cordón',                  category: 'tobilleras',      sizes: ['1','2','3','4'] },
  { code: '036',    name: 'Inmovilizador de Tobillo',                    category: 'tobilleras',      sizes: ['1','2','3','4'] },
  { code: '055',    name: 'Gemelera',                                    category: 'tobilleras',      sizes: ['1','2','3','4','5'] },
  { code: '039D',   name: 'Corrector de Juanetes Derecho',               category: 'tobilleras',      sizes: ['1','2'] },
  { code: '039I',   name: 'Corrector de Juanetes Izquierdo',             category: 'tobilleras',      sizes: ['1','2'] },
  // Muñequeras
  { code: '040',    name: 'Muñequera con Velcro',                        category: 'munequeras',      sizes: ['0','1','2','3'] },
  { code: '041',    name: 'Muñequera Boomerang con Pulgar',              category: 'munequeras',      sizes: ['0','1','2','3'] },
  { code: '042',    name: 'Muñequera Boomerang con Fleje',               category: 'munequeras',      sizes: ['0','1','2','3'] },
  { code: '043',    name: 'Muñequera Dedo Libre',                        category: 'munequeras',      sizes: ['0','1','2','3'] },
  { code: '045D',   name: 'Inmovilizador Muñeca Largo Derecho',          category: 'munequeras',      sizes: ['1','2','3'] },
  { code: '045I',   name: 'Inmovilizador Muñeca Largo Izquierdo',        category: 'munequeras',      sizes: ['1','2','3'] },
  { code: '046',    name: 'Inmov. Muñeca con Inmov. de Pulgar',          category: 'munequeras',      sizes: ['UNIVERSAL'] },
  { code: '047D',   name: 'Inmovilizador Muñeca Corto Derecho',          category: 'munequeras',      sizes: ['1','2','3'] },
  { code: '047I',   name: 'Inmovilizador Muñeca Corto Izquierdo',        category: 'munequeras',      sizes: ['1','2','3'] },
  // Coderas
  { code: '050',    name: 'Codera Larga',                                category: 'coderas',         sizes: ['1','2','3'] },
  { code: '051',    name: 'Codera Larga con Orificio y Velcro',          category: 'coderas',         sizes: ['1','2','3'] },
  { code: '052',    name: 'Codera Anticodo-Tenista',                     category: 'coderas',         sizes: ['1','2','3','4'] },
  { code: '053',    name: 'Codera Larga con Orificio',                   category: 'coderas',         sizes: ['1','2','3'] },
  // Fajas
  { code: '020',    name: 'Faja Lumbar',                                 category: 'fajas',           sizes: ['1','2','3','4','5'] },
  { code: '021',    name: 'Faja Intercostal',                            category: 'fajas',           sizes: ['1','2','3','4','5'] },
  { code: '022',    name: 'Faja Lumbar con Ballenas',                    category: 'fajas',           sizes: ['1','2','3','4','5'] },
  { code: '023',    name: 'Faja Doble Ajuste con Ballenas',              category: 'fajas',           sizes: ['1','2','3','4','5'] },
  { code: '624',    name: 'Faja Alta Compresión 24cm',                   category: 'fajas',           sizes: ['T1','T2','T3','T4','T5'] },
  { code: '628',    name: 'Faja Alta Compresión 28cm',                   category: 'fajas',           sizes: ['T1','T2','T3','T4','T5'] },
  { code: '060',    name: 'Calza Reductora',                             category: 'fajas',           sizes: ['1','2','3','4'] },
  { code: '027',    name: 'Corrector Postural de Espalda',               category: 'fajas',           sizes: ['1','2','3'] },
  { code: '026',    name: 'Hombrera Universal',                          category: 'fajas',           sizes: ['UNIVERSAL'] },
  { code: '024',    name: 'Soporte de Clavícula (Strap)',                category: 'fajas',           sizes: ['0','1','2','3'] },
  { code: 'CABEST', name: 'Cabestrillo Velpeau Vietnam',                 category: 'fajas',           sizes: ['UNIVERSAL'] },
  // Inmovilizadores
  { code: 'INM.50', name: 'Inmovilizador de Rodilla Velour 50cm',        category: 'inmovilizadores', sizes: ['0','1','2','3','4'] },
  { code: 'INM.60', name: 'Inmovilizador de Rodilla Velour 60cm',        category: 'inmovilizadores', sizes: ['0','1','2','3','4'] },
  { code: 'INM.65', name: 'Inmovilizador de Rodilla Velour 65cm',        category: 'inmovilizadores', sizes: ['0','1','2','3','4'] },
  { code: 'TPANEL', name: 'Inmov. Rodilla Tripanel Velour 55cm',         category: 'inmovilizadores', sizes: ['UNIVERSAL'] },
  { code: 'FUNDA',  name: 'Funda Bota Walker Velour 8mm',                category: 'inmovilizadores', sizes: ['0','1','2','3','4'] },
  // Otros
  { code: 'MASC',   name: 'Máscara Simple',                             category: 'otros',           sizes: ['UNIVERSAL'] },
  { code: 'MASCB',  name: 'Máscara con Babero',                         category: 'otros',           sizes: ['UNIVERSAL'] },
  { code: 'TAPAB',  name: 'Tapaboca',                                   category: 'otros',           sizes: ['UNIVERSAL'] },
]

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)    private readonly users: Repository<User>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin()
    await this.seedProducts()
  }

  private async seedAdmin() {
    const exists = await this.users.findOne({ where: { email: ADMIN_EMAIL } })
    if (exists) return
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
    await this.users.save(this.users.create({
      name: 'AdherNeo Admin',
      email: ADMIN_EMAIL,
      passwordHash: hash,
      role: 'admin',
    }))
  }

  private async seedProducts() {
    const count = await this.products.count()
    if (count > 0) return
    const rows = PRODUCTS.map((p) =>
      this.products.create({ ...p, price: 999999, isActive: true }),
    )
    await this.products.save(rows)
  }
}
