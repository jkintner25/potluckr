
import type { DishTagKey } from './dishTags'

export interface Dish {
  id?: string;
  name: string;
  dish: string;
  tags?: DishTagKey[];
}

export interface Event {
  _id: string;
  title: string;
  datetime: string;
  theme?: string;
  address?: string;
  instructions?: string;
  mains?: Dish[];
  sides?: Dish[];
  desserts?: Dish[];
  drinks?: Dish[];
  misc?: Dish[];
}

export interface DishEntry extends Dish {
  type: string;
};
