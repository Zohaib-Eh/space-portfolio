export type PlanetId = 'mercury' | 'venus' | 'mars' | 'jupiter' | 'neptune' | 'saturn'

export interface Planet {
  id: PlanetId
  name: string
  accentColor: string
}

export const planets: Planet[] = [
  { id: 'mercury', name: 'Mercury', accentColor: '#C0C0C0' },
  { id: 'venus',   name: 'Venus',   accentColor: '#E8A020' },
  { id: 'mars',    name: 'Mars',    accentColor: '#E84040' },
  { id: 'jupiter', name: 'Jupiter', accentColor: '#E86020' },
  { id: 'neptune', name: 'Neptune', accentColor: '#20C8E8' },
  { id: 'saturn',  name: 'Saturn',  accentColor: '#E8D020' },
]
