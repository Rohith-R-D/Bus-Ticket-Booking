
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Bus, Search, User } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')`,
      }}
    >
      <nav className="p-4 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bus className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">BusGo</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/search")}
            >
              <Search className="h-4 w-4 mr-2" />
              Search Buses
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/login");
              }}
            >
              <User className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 animate-fade-in">
          Book Your Journey Today
        </h1>
        <p className="text-xl md:text-2xl text-center mb-12 max-w-2xl text-gray-200">
          Find and book bus tickets for your next adventure. Choose from hundreds of routes with AC, Non-AC, Sleeper, and Seater options.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
            onClick={() => navigate("/search")}
          >
            <Search className="mr-2 h-5 w-5" />
            Search Buses
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg"
            onClick={() => navigate("/bookings")}
          >
            <Bus className="mr-2 h-5 w-5" />
            My Bookings
          </Button>
        </div>
      </main>

      <footer className="bg-black/30 backdrop-blur-sm text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 BusGo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
