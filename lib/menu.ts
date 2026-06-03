export type PriceMap = Record<string, string>

export interface MenuItem {
  name: string
  detail?: string
  prices: PriceMap
  badge?: string
}

export interface MenuCategory {
  name: string
  priceHeaders?: string[]
  items: MenuItem[]
  note?: string
}

export interface MenuSection {
  id: string
  label: string
  categories: MenuCategory[]
}

export const MENU: MenuSection[] = [
  {
    id: 'cave',
    label: 'La Cave',
    categories: [
      {
        name: 'Tireuses à Bières',
        priceHeaders: ['25cl', '50cl'],
        items: [
          { name: 'Blanche', detail: 'Hubster vice hood 4.5°', prices: { '25cl': '3,80€', '50cl': '7,00€' } },
          { name: 'Blonde', detail: 'Reitter hell 5°', prices: { '25cl': '3,50€', '50cl': '6,50€' } },
          { name: 'IPA', detail: 'Hubster Hop Side 6°', prices: { '25cl': '4,00€', '50cl': '7,50€' } },
          { name: 'NEIPA 6,5°', detail: 'BRP Juice Junkie 5.4°', prices: { '25cl': '4,50€', '50cl': '8,00€' } },
          { name: 'Cidre Brut 4.7°', prices: { '25cl': '4,20€', '50cl': '7,50€' } },
        ],
      },
      {
        name: 'Bouteilles & Cidres',
        priceHeaders: ['33cl'],
        items: [
          { name: 'La Chouffe', detail: '8°', prices: { '33cl': '6,50€' } },
          { name: 'Desperados', detail: '5,9°', prices: { '33cl': '5,50€' } },
          { name: 'Fugazi La Furieuse', detail: '0,9°', prices: { '33cl': '6,00€' } },
          { name: 'Cidre Appie Bio', detail: '4,7°', prices: { '33cl': '6,00€' } },
          { name: 'Sangria "La Tita" 7°', prices: { '33cl': '4,50€' } },
        ],
      },
      {
        name: 'Tireuses à Vins',
        priceHeaders: ['12cl', '50cl', '1L'],
        items: [
          { name: 'Côte du Rhône', detail: 'Vin blanc', prices: { '12cl': '4,50€', '50cl': '19€', '1L': '30€' } },
          { name: 'Viognier', detail: 'Vin blanc', prices: { '12cl': '4,50€', '50cl': '17€', '1L': '26€' } },
          { name: 'Côte du Rhône', detail: 'Vin rouge', prices: { '12cl': '4,50€', '50cl': '19€', '1L': '30€' } },
          { name: 'Pinot Noir', detail: 'Vin rouge', prices: { '12cl': '4,50€', '50cl': '17€', '1L': '26€' } },
        ],
      },
    ],
  },
  {
    id: 'menu',
    label: 'Le Menu',
    categories: [
      {
        name: 'Apéritifs & Cocktails',
        items: [
          { name: 'Kir, Suze, Martini', prices: { default: '4,50€' } },
          { name: 'Punch Maison', prices: { default: '5,50€' } },
          { name: 'Spritz', prices: { default: '9,50€' } },
          { name: 'Mocktail', detail: '0°', prices: { default: '8,50€' } },
        ],
      },
      {
        name: 'À Partager',
        items: [
          { name: 'Planche Fromage', prices: { default: '16,00€' } },
          { name: 'Planche Charcuterie', prices: { default: '16,00€' } },
          { name: 'Planche Mixte', prices: { default: '18,00€' } },
          { name: 'Pinsa Charcuterie', prices: { default: '14,50€' } },
          { name: 'Pinsa Fromage', prices: { default: '13,50€' } },
          { name: 'Saucisson Maison Duculty', detail: '300g', prices: { default: '9,50€' } },
          { name: 'Saucisse Sèche Maison Duculty', detail: '200g', prices: { default: '7,50€' } },
          { name: 'Terrine Maison', prices: { default: '6,00€' } },
          { name: 'Saint-Félicien', prices: { default: '5,50€' } },
        ],
      },
      {
        name: 'Empanadas',
        note: '20 minutes de cuisson · 3,80€/unité · Planches ×3 à 11€',
        items: [
          { name: '#2 Jambon Fromage', prices: { default: '3,80€' }, badge: 'NEW' },
          { name: '#3 Margherita Vega', prices: { default: '3,80€' }, badge: 'NEW' },
          { name: '#9 Fermier', prices: { default: '3,80€' }, badge: 'NEW' },
          { name: '#15 Chili Jalapeños', prices: { default: '3,80€' }, badge: 'NEW' },
        ],
      },
    ],
  },
  {
    id: 'bar',
    label: 'Le Bar',
    categories: [
      {
        name: 'Softs',
        items: [
          { name: 'CocaCola, CocaCola 0', prices: { default: '3,80€' } },
          { name: 'Orangina', prices: { default: '3,50€' } },
          { name: 'Limonade', prices: { default: '3,50€' } },
          { name: 'Diabolo', prices: { default: '3,80€' } },
          { name: 'Fuze Tea', prices: { default: '3,80€' } },
          { name: 'Sirop 1883', prices: { default: '2,50€' } },
          { name: 'Craft Soda', detail: 'Mona Bio — citron, fraise/framboise, pêche/abricot', prices: { default: '4,80€' } },
          { name: 'Badoit Rouge', prices: { default: '3,80€' } },
          { name: 'Jus de Fruit', detail: 'Emile Vergeois — ananas, pêche de vignes, abricot, pomme/yuzu, tomate, poire', prices: { default: '3,80€' } },
          { name: 'Ginger Beer', detail: 'Socrate — Original, Royale cassis', prices: { default: '4,80€' } },
          { name: 'Infusion Pétillante', detail: 'Symples — Detox, Energisante', prices: { default: '5,40€' } },
          { name: 'Kombucha Archipel Clémentine', prices: { default: '5,50€' } },
          { name: 'Evian, Badoit, S.Pellegrino', detail: '1L', prices: {} },
        ],
      },
      {
        name: 'Boissons Chaudes',
        items: [
          { name: 'Café, Décaféiné', prices: { default: '1,70€' } },
          { name: 'Double Expresso', prices: { default: '3,00€' } },
          { name: 'Thé, Tisane', prices: { default: '3,80€' } },
          { name: 'Chocolat Chaud', prices: { default: '3,50€' } },
          { name: 'Capuccino', prices: { default: '3,50€' } },
        ],
      },
    ],
  },
]
