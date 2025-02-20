
export interface Bus {
  id: number;
  bus_name: string;
  from_location: string;
  to_location: string;
  date: string;
  departure_time: string;
  arrival_time: string;
  seats_available: number;
  total_seats: number;
  price: number;
  is_ac: boolean;
  amenities: string[];
  bus_type: string;
  bus_number: string;
  operator_name: string;
}
