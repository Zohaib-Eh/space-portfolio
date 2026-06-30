export type PlanetId = 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune'

export interface Planet {
  id: PlanetId
  name: string
  accentColor: string
}

export const planets: Planet[] = [
  { id: 'mercury', name: 'Mercury', accentColor: '#C0C0C0' },
  { id: 'venus',   name: 'Venus',   accentColor: '#E8A020' },
  { id: 'earth',   name: 'Earth',   accentColor: '#40C880' },
  { id: 'mars',    name: 'Mars',    accentColor: '#E84040' },
  { id: 'jupiter', name: 'Jupiter', accentColor: '#E86020' },
  { id: 'saturn',  name: 'Saturn',  accentColor: '#E8D020' },
  { id: 'uranus',  name: 'Uranus',  accentColor: '#60E8D8' },
  { id: 'neptune', name: 'Neptune', accentColor: '#20C8E8' },
]
