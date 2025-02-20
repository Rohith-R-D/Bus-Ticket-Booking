
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { SearchForm } from "@/components/bus/SearchForm";
import { BusCard } from "@/components/bus/BusCard";

type BusType = {
  id: number;
  bus_name: string;
  operator_name: string;
  from_location: string;
  to_location: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  seats_available: number;
  total_seats: number;
  is_ac: boolean;
  bus_type: string;
  amenities: string[];
  date: string;
};

const popularCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
];

const Search = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [filters, setFilters] = useState({
    busType: "all",
    acType: "all",
  });

  const { data: buses, isLoading } = useQuery({
    queryKey: ["buses", fromLocation, toLocation, date],
    queryFn: async () => {
      console.log("Fetching buses with params:", { fromLocation, toLocation, date });
      
      let query = supabase
        .from("buses")
        .select("*")
        .gte("seats_available", 1);

      if (fromLocation) {
        query = query.ilike("from_location", `%${fromLocation}%`);
      }
      if (toLocation) {
        query = query.ilike("to_location", `%${toLocation}%`);
      }
      if (date) {
        query = query.eq("date", date);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching buses:", error);
        throw error;
      }
      
      console.log("Fetched buses:", data);
      return data as BusType[];
    },
  });

  const filteredBuses = buses?.filter((bus) => {
    if (filters.busType !== "all" && bus.bus_type !== filters.busType) {
      return false;
    }
    if (filters.acType !== "all") {
      const isAc = filters.acType === "ac";
      if (bus.is_ac !== isAc) {
        return false;
      }
    }
    return true;
  });

  const handleBook = async (busId: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please login to book tickets",
          variant: "destructive",
        });
        return;
      }

      navigate(`/booking/${busId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop')`,
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <SearchForm
          fromLocation={fromLocation}
          toLocation={toLocation}
          date={date}
          busType={filters.busType}
          onFromLocationChange={setFromLocation}
          onToLocationChange={setToLocation}
          onDateChange={setDate}
          onBusTypeChange={(value) =>
            setFilters((prev) => ({ ...prev, busType: value }))
          }
          popularCities={popularCities}
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="text-white">Loading buses...</p>
          ) : filteredBuses?.length === 0 ? (
            <p className="text-white">No buses found for the selected criteria.</p>
          ) : (
            filteredBuses?.map((bus) => (
              <BusCard key={bus.id} bus={bus} onBook={handleBook} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
