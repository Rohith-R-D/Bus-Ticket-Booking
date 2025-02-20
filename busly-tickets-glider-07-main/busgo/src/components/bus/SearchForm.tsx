
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SearchFormProps = {
  fromLocation: string;
  toLocation: string;
  date: string;
  busType: string;
  onFromLocationChange: (value: string) => void;
  onToLocationChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onBusTypeChange: (value: string) => void;
  popularCities: string[];
};

export const SearchForm = ({
  fromLocation,
  toLocation,
  date,
  busType,
  onFromLocationChange,
  onToLocationChange,
  onDateChange,
  onBusTypeChange,
  popularCities,
}: SearchFormProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-none text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Search Buses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Input
              placeholder="From"
              value={fromLocation}
              onChange={(e) => onFromLocationChange(e.target.value)}
              className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
            />
            {fromLocation && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
                {popularCities
                  .filter(city => 
                    city.toLowerCase().includes(fromLocation.toLowerCase()) &&
                    city.toLowerCase() !== fromLocation.toLowerCase()
                  )
                  .map(city => (
                    <div
                      key={city}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                      onClick={() => onFromLocationChange(city)}
                    >
                      {city}
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          <div className="relative">
            <Input
              placeholder="To"
              value={toLocation}
              onChange={(e) => onToLocationChange(e.target.value)}
              className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
            />
            {toLocation && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
                {popularCities
                  .filter(city => 
                    city.toLowerCase().includes(toLocation.toLowerCase()) &&
                    city.toLowerCase() !== toLocation.toLowerCase()
                  )
                  .map(city => (
                    <div
                      key={city}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                      onClick={() => onToLocationChange(city)}
                    >
                      {city}
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          <Input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-white/20 border-white/20 text-white"
            min={format(new Date(), "yyyy-MM-dd")}
          />
          
          <Select
            value={busType}
            onValueChange={onBusTypeChange}
          >
            <SelectTrigger className="bg-white/20 border-white/20 text-white">
              <SelectValue placeholder="Bus Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Sleeper">Sleeper</SelectItem>
              <SelectItem value="Seater">Seater</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
