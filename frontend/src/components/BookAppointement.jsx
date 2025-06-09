import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";

const BookAppointement = () => {
  const [date, setDate] = useState(new Date());
  const [slot, setSlot] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const isPastDay = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    day.setHours(0, 0, 0, 0);
    return day < today;
  };
  useEffect(() => {
    getTime();
  }, []);
  const getTime = () => {
    const timeList = [];
    for (let i = 10; i <= 12; i++) {
      timeList.push({ time: i + ":00 AM" });
      timeList.push({ time: i + ":30 AM" });
    }
    for (let i = 1; i <= 6; i++) {
      timeList.push({ time: i + ":00 PM" });
      timeList.push({ time: i + ":30 PM" });
    }
    setSlot(timeList);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
          Book Appointment
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Book Appointment</DialogTitle>
          <DialogDescription>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
                {/* calender */}
                <div className="flex flex-col gap-3  items-baseline">
                  <h2 className="flex gap-2 items-center">
                    <CalendarDays className="text-blue-600 h-5 w-5" />
                    Select Date
                  </h2>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) =>
                      selectedDate && setDate(selectedDate)
                    }
                    disabled={isPastDay}
                    className="rounded-lg border text-gray-900"
                  />
                </div>
                {/* slot*/}
                <div className="mt-3 md:mt-0">
                  <h2 className="flex gap-2 items-center mb-3">
                    <Clock className="text-blue-600 h-5 w-5" />
                    Select Time Slot
                  </h2>
                  <div className="grid grid-cols-3 gap-2 border rounded-lg p-4">
                    {slot?.map((value, index) => (
                      <h2
                        key={index}
                        onClick={() => setSelectedTimeSlot(value.time)}
                        className={`p-2 border rounded-full text-center cursor-pointer hover:bg-blue-600 hover:text-white ${
                          value.time === selectedTimeSlot
                            ? "bg-blue-600 text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {value.time}
                      </h2>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-end mt-4">
              <DialogClose asChild>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-900"
                    disabled={!(date && selectedTimeSlot)}
                    onClick={() => {
                      console.log("Selected Date:", date);
                      console.log("Selected Slot:", selectedTimeSlot);
                      // Call your backend API or state update here
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointement;
