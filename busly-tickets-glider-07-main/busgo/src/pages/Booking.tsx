
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Bus,
  Calendar,
  Clock,
  IndianRupee,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PaymentMethod = "card" | "upi";

const Booking = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
  });

  const { data: bus, isLoading } = useQuery({
    queryKey: ["bus", busId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("buses")
        .select("*")
        .eq("id", busId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handlePayment = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please login to complete booking",
          variant: "destructive",
        });
        return;
      }

      // In a real application, integrate with a payment gateway here
      // For demo purposes, we'll simulate a successful payment
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        bus_id: busId,
        num_seats: selectedSeats,
        booking_date: new Date().toISOString(),
      });

      if (error) throw error;

      // Update available seats
      const { error: updateError } = await supabase
        .from("buses")
        .update({ seats_available: bus.seats_available - selectedSeats })
        .eq("id", busId);

      if (updateError) throw updateError;

      toast({
        title: "Booking Successful",
        description: "Your tickets have been booked successfully!",
      });

      navigate("/bookings");
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Failed to complete booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!bus) {
    return <div className="container mx-auto px-4 py-8">Bus not found</div>;
  }

  const totalAmount = bus.price * selectedSeats;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bus Details */}
        <Card>
          <CardHeader>
            <CardTitle>Bus Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{bus.bus_name}</h3>
              <span className="bg-primary/20 px-2 py-1 rounded">
                {bus.is_ac ? "AC" : "Non-AC"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bus className="h-4 w-4" />
              <span>{bus.operator_name}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{bus.departure_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{bus.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              <span className="text-xl font-bold">₹{bus.price}</span>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Seats
              </label>
              <Select
                value={selectedSeats.toString()}
                onValueChange={(value) => setSelectedSeats(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: Math.min(bus.seats_available, 6) },
                    (_, i) => i + 1
                  ).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "seat" : "seats"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className="mr-2" /> Card
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === "upi" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setPaymentMethod("upi")}
                >
                  <Smartphone className="mr-2" /> UPI
                </Button>
              </div>
            </div>

            {paymentMethod === "card" ? (
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Card Number"
                  value={paymentDetails.cardNumber}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      cardNumber: e.target.value,
                    })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        expiryDate: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="password"
                    placeholder="CVV"
                    value={paymentDetails.cvv}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        cvv: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            ) : (
              <Input
                type="text"
                placeholder="Enter UPI ID"
                value={paymentDetails.upiId}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    upiId: e.target.value,
                  })
                }
              />
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span>Total Amount</span>
                <span className="text-xl font-bold">₹{totalAmount}</span>
              </div>
              <Button className="w-full" onClick={handlePayment}>
                Pay ₹{totalAmount}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Booking;
