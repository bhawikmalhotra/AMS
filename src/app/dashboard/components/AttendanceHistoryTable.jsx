"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AttendanceHistoryTable({ history = [] }) {
  const [showAll, setShowAll] = useState(false);

  // Show only 1st 5 records by default, or all if showAll is true
  const displayedHistory = showAll ? history : history.slice(0, 5);

  const formatDate = (dateObj) => {
    return new Date(dateObj).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "--";
    const diffMs = new Date(checkOut) - new Date(checkIn);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PRESENT":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "LATE":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "ABSENT":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Attendance History</CardTitle>
          <CardDescription>
            {history.length > 5 && !showAll
              ? `Showing latest 5 of ${history.length} records`
              : `Total ${history.length} records logged`}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No attendance records found yet. Check in today to start tracking!
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4 rounded-l-md">Date</th>
                    <th className="py-3 px-4">Check In</th>
                    <th className="py-3 px-4">Check Out</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4 rounded-r-md">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {displayedHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{formatDate(record.date)}</td>
                      <td className="py-3 px-4">{formatTime(record.checkIn)}</td>
                      <td className="py-3 px-4">{formatTime(record.checkOut)}</td>
                      <td className="py-3 px-4 font-mono text-xs">{calculateDuration(record.checkIn, record.checkOut)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${getStatusBadge(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Show More / Show Less Button */}
            {history.length > 5 && (
              <div className="pt-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="font-medium"
                >
                  {showAll ? "Show Less" : `Show More (${history.length - 5} hidden)`}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
