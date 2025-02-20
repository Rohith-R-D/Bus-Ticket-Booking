
import { Bus, Calendar, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BusCardProps = {
  bus: {
    id: number;
    bus_name: string;
    operator_name: string;
    departure_time: string;
    date: string;
    price: number;
    seats_available: number;
    is_ac: boolean;
    bus_type: string;
  };
  onBook: (busId: number) => void;
};

export const BusCard = ({ bus, onBook }: BusCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-none text-white hover:bg-white/20 transition-all">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{bus.bus_name}</span>
          <span className="text-sm font-normal bg-primary/20 px-2 py-1 rounded">
            {bus.is_ac ? "AC" : "Non-AC"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bus className="h-4 w-4" />
              <span>{bus.operator_name}</span>
            </div>
            <span>{bus.bus_type}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{bus.departure_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{bus.date}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              <span className="text-xl font-bold">₹{bus.price}</span>
            </div>
            <span className="text-sm">
              {bus.seats_available} seats left
            </span>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => onBook(bus.id)}
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
