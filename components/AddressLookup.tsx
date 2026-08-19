"use client";

import { useState } from "react";

interface AddressLookupProps {
  postcode: string;
  onPostcodeChange: (value: string) => void;
  addressLine: string;
  onAddressLineChange: (value: string) => void;
}

const inputClasses =
  "mt-1 w-full rounded-md border border-border-muted bg-white px-3 py-2 text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss";
const labelClasses = "block text-sm font-medium text-charcoal";

export default function AddressLookup({
  postcode,
  onPostcodeChange,
  addressLine,
  onAddressLineChange,
}: AddressLookupProps) {
  const [addresses, setAddresses] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  async function handleFindAddress() {
    if (!postcode.trim()) {
      setError("Enter a postcode first.");
      return;
    }

    setLoading(true);
    setError(null);
    setAddresses(null);

    try {
      const res = await fetch(`/api/address-lookup?postcode=${encodeURIComponent(postcode)}`);
      const data = await res.json();

      if (res.status === 501) {
        setNotConfigured(true);
        setManualMode(true);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Address lookup failed.");
      }

      if (!data.addresses || data.addresses.length === 0) {
        setError("No addresses found for that postcode.");
      } else {
        setAddresses(data.addresses);
      }
    } catch (err: any) {
      setError(err?.message ?? "Address lookup failed. Please enter the address manually.");
    } finally {
      setLoading(false);
    }
  }

  function selectAddress(address: string) {
    onAddressLineChange(address);
    setAddresses(null);
  }

  return (
    <div>
      <label htmlFor="postcode" className={labelClasses}>
        Postcode
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id="postcode"
          type="text"
          required
          placeholder="SW1A 1AA"
          value={postcode}
          onChange={(e) => {
            onPostcodeChange(e.target.value);
            setAddresses(null);
            setError(null);
          }}
          className={`${inputClasses} mt-0 sm:w-40`}
        />
        {!notConfigured && (
          <button
            type="button"
            onClick={handleFindAddress}
            disabled={loading}
            className="whitespace-nowrap rounded-md border border-moss px-3 py-2 text-sm font-medium text-moss transition hover:bg-moss hover:text-cream disabled:opacity-60"
          >
            {loading ? "Looking up…" : "Find address"}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}

      {addressLine && !manualMode && (
        <p className="mt-2 text-sm text-charcoal">
          <span className="text-charcoal/50">Address:</span> {addressLine}{" "}
          <button
            type="button"
            onClick={() => selectAddress("")}
            className="ml-1 text-xs text-moss underline underline-offset-2"
          >
            change
          </button>
        </p>
      )}

      {addresses && addresses.length > 0 && (
        <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-border-muted bg-white">
          {addresses.map((address, i) => (
            <button
              key={i}
              type="button"
              onClick={() => selectAddress(address)}
              className="block w-full border-b border-border-muted px-3 py-2 text-left text-sm text-charcoal last:border-0 hover:bg-cream"
            >
              {address}
            </button>
          ))}
        </div>
      )}

      {!manualMode && !addressLine && (
        <button
          type="button"
          onClick={() => setManualMode(true)}
          className="mt-2 text-xs font-medium text-moss underline underline-offset-2"
        >
          Can&apos;t find the address? Enter it manually
        </button>
      )}

      {manualMode && (
        <div className="mt-2">
          <label htmlFor="addressLine" className={labelClasses}>
            Address{" "}
            {notConfigured && (
              <span className="font-normal text-charcoal/50">
                — exact address lookup isn&apos;t set up yet
              </span>
            )}
          </label>
          <input
            id="addressLine"
            type="text"
            placeholder="e.g. 10 Downing Street, London"
            value={addressLine}
            onChange={(e) => onAddressLineChange(e.target.value)}
            className={inputClasses}
          />
        </div>
      )}
    </div>
  );
}
