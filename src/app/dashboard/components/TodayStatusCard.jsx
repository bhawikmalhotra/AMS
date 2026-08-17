"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { checkInAction, checkOutAction } from "../employee/actions";

export default function TodayStatusCard({ todayRecord }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCheckIn = () => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await checkInAction();
      if (!res.success) {
        setErrorMsg(res.error);
      }
    });
  };

  const handleCheckOut = () => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await checkOutAction();
      if (!res.success) {
        setErrorMsg(res.error);
      }
    });
  };

  // Determine Current Status Badge styling
  let statusText = "Not Checked In";
  let statusBadgeClass = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";

  if (todayRecord) {
    if (todayRecord.checkOut) {
      statusText = "Completed for Today";
      statusBadgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    } else {
      statusText = todayRecord.status === "LATE" ? "Checked In (Late)" : "Checked In";
      statusBadgeClass = todayRecord.status === "LATE" 
        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  }

  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Today's Attendance</CardTitle>
            <CardDescription>{todayFormatted}</CardDescription>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass}`}>
            {statusText}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Time summary grid */}
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4 text-center">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Check In</p>
            <p className="mt-1 text-lg font-semibold">
              {todayRecord ? formatTime(todayRecord.checkIn) : "--:--"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Check Out</p>
            <p className="mt-1 text-lg font-semibold">
              {todayRecord?.checkOut ? formatTime(todayRecord.checkOut) : "--:--"}
            </p>
          </div>
        </div>

        {/* Action Error Message */}
        {errorMsg && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
            {errorMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!todayRecord ? (
            <Button
              onClick={handleCheckIn}
              disabled={isPending}
              className="w-full font-medium"
            >
              {isPending ? "Checking In..." : "Check In Now"}
            </Button>
          ) : !todayRecord.checkOut ? (
            <Button
              onClick={handleCheckOut}
              disabled={isPending}
              variant="outline"
              className="w-full font-medium border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            >
              {isPending ? "Checking Out..." : "Check Out Now"}
            </Button>
          ) : (
            <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed">
              Day Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
