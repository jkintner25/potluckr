
export interface Event {
  _id: string;
  title: string;
  datetime: string;
  theme?: string;
  address?: string;
  instructions?: string;
  mains?: {
    name: string;
    dish: string;
  }[];
  sides?: {
    name: string;
    dish: string;
  }[];
  desserts?: {
    name: string;
    dish: string;
  }[];
  drinks?: {
    name: string;
    dish: string;
  }[];
  misc?: {
    name: string;
    dish: string;
  }[];
}

export interface DishEntry {
  type: string;
  dish: string;
  name: string;
};
