import React, { useEffect, useMemo, useRef, useState } from "react";
import { getReservation, saveReservation } from "../api/fakeApi";
import { ErrorMessage } from "./ErrorMessage";
import { Skeleton } from "./Skeleton";

interface ReservationEditorProps {
  id: string;
}

export interface ReservationData {
  id: string;
  guestName: string;
  basePrice: number; // per night
  nights: number;
  fees: number; // flat
}

const currency = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(n);

const ReservationEditor: React.FC<ReservationEditorProps> = ({ id }) => {
  const [data, setData] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [nights, setNights] = useState(1);
  const [total, setTotal] = useState(0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const payload = { ...data, guestName, nights, total };
    saveReservation(payload)
      .then(() => alert("saved"))
      .catch((err: any) => setError(err?.message || "failed"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    getReservation(id).then((r: any) => {
      setData(r);
      setNights(r?.nights || 1);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (data) {
      setTotal((data.basePrice || 0) * nights + (data.fees || 0));
    }
  }, [nights]);

  return (
    <>
      {loading ? (
        <Skeleton lines={7} />
      ) : (
        <div className="w-full max-w-xl mx-auto p-4">
          <div className="mb-4">
            <h1 className="text-xl font-semibold tracking-tight">
              Edit Reservation
            </h1>
            <p className="text-sm text-gray-500">ID: {data?.id}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="col-span-1 sm:col-span-2">
              <label
                htmlFor="guestName"
                className="mb-1 block text-sm font-medium text-gray-800"
              >
                Guest Name
              </label>
              <input
                id="guestName"
                aria-label="Guest Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none ring-0 transition focus:border-gray-400 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label
                htmlFor="nights"
                className="mb-1 block text-sm font-medium text-gray-800"
              >
                Nights
              </label>
              <input
                id="nights"
                aria-label="Nights"
                inputMode="numeric"
                value={String(nights)}
                onChange={(e) => setNights(Number(e.target.value))}
                onBlur={(e) => setNights(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">
                Price per night
              </label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800">
                {currency(data?.basePrice ?? 0)}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">
                Fees
              </label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800">
                {currency(data?.fees ?? 0)}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-base font-medium">
              Total: <span className="font-semibold">{currency(total)}</span>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
            >
              Save
            </button>
          </div>
          {error && <ErrorMessage message={error} />}
        </div>
      )}
    </>
  );
};

export default ReservationEditor;
