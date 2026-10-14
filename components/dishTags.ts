export const dishTags = [
  { key: 'milk', badge: 'Milk', label: 'Contains milk', description: 'Milk or dairy ingredients', group: 'allergen' },
  { key: 'eggs', badge: 'Egg', label: 'Contains eggs', description: 'Egg ingredients', group: 'allergen' },
  { key: 'peanuts', badge: 'Peanut', label: 'Contains peanuts', description: 'Peanut ingredients', group: 'allergen' },
  { key: 'tree_nuts', badge: 'Tree nut', label: 'Contains tree nuts', description: 'Tree nut ingredients, such as almonds or walnuts', group: 'allergen' },
  { key: 'soy', badge: 'Soy', label: 'Contains soy', description: 'Soy or soybean ingredients', group: 'allergen' },
  { key: 'wheat', badge: 'Wheat', label: 'Contains wheat', description: 'Wheat ingredients', group: 'allergen' },
  { key: 'sesame', badge: 'Sesame', label: 'Contains sesame', description: 'Sesame ingredients', group: 'allergen' },
  { key: 'fish', badge: 'Fish', label: 'Contains fish', description: 'Fish ingredients', group: 'allergen' },
  { key: 'shellfish', badge: 'Shellfish', label: 'Contains crustacean shellfish', description: 'Crustacean shellfish, such as shrimp or crab', group: 'allergen' },
  { key: 'gluten_free', badge: 'GF', label: 'Gluten-free', description: 'Made without gluten-containing ingredients', group: 'preparation' },
  { key: 'dairy_free', badge: 'DF', label: 'Dairy-free', description: 'Made without dairy ingredients', group: 'preparation' },
  { key: 'vegetarian', badge: 'Veg', label: 'Vegetarian', description: 'Made without meat or fish', group: 'preparation' },
  { key: 'vegan', badge: 'Vegan', label: 'Vegan', description: 'Made without animal-derived ingredients', group: 'preparation' },
] as const

export type DishTagKey = typeof dishTags[number]['key']
