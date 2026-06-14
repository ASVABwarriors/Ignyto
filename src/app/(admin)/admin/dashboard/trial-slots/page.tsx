"use client";

import { useState, useEffect } from "react";
import { getTrialDates, addTrialDate, deleteTrialDate, addTrialTimeSlot, deleteTrialTimeSlot } from "@/app/actions/trial-slots";

export default function TrialSlotsPage() {
  const [dates, setDates] = useState<any[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newTimes, setNewTimes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = async () => {
    const res = await getTrialDates();
    if (res.success && res.dates) {
      setDates(res.dates);
    }
  };

  const handleAddDate = async () => {
    if (!newDate) return;
    await addTrialDate(newDate);
    setNewDate("");
    fetchDates();
  };

  const handleDeleteDate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this date?")) return;
    await deleteTrialDate(id);
    fetchDates();
  };

  const handleAddTime = async (dateId: string) => {
    const time = newTimes[dateId];
    if (!time) return;
    await addTrialTimeSlot(dateId, time);
    setNewTimes({ ...newTimes, [dateId]: "" });
    fetchDates();
  };

  const handleDeleteTime = async (id: string) => {
    await deleteTrialTimeSlot(id);
    fetchDates();
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Manage Free Trial Slots</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex gap-4">
        <input 
          type="date" 
          value={newDate} 
          onChange={(e) => setNewDate(e.target.value)}
          className="border p-2 rounded-lg flex-1"
        />
        <button 
          onClick={handleAddDate}
          className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:opacity-90"
        >
          Add New Date
        </button>
      </div>

      <div className="space-y-6">
        {dates.map((date) => (
          <div key={date.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
              <h2 className="text-xl font-bold">{new Date(date.dateStr).toLocaleDateString()}</h2>
              <button onClick={() => handleDeleteDate(date.id)} className="text-red-500 hover:underline text-sm font-semibold">
                Delete Date
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {date.timeSlots.map((slot: any) => (
                <div key={slot.id} className="bg-primary-light text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  {slot.timeStr}
                  <button onClick={() => handleDeleteTime(slot.id)} className="text-primary hover:text-red-500 ml-1">
                    ×
                  </button>
                </div>
              ))}
              {date.timeSlots.length === 0 && <span className="text-gray-400 text-sm italic">No time slots added yet.</span>}
            </div>

            <div className="flex gap-4 max-w-sm">
              <input 
                type="time" 
                value={newTimes[date.id] || ""}
                onChange={(e) => setNewTimes({ ...newTimes, [date.id]: e.target.value })}
                className="border p-2 rounded-lg flex-1 text-sm"
              />
              <button 
                onClick={() => handleAddTime(date.id)}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 text-sm"
              >
                Add Time
              </button>
            </div>
          </div>
        ))}
        {dates.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No trial dates have been created yet.
          </div>
        )}
      </div>
    </div>
  );
}
