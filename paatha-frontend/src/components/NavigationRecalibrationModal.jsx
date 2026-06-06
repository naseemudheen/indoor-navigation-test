import React, { useState } from "react";
import { IoCloseOutline, IoLocateOutline, IoAlertCircleOutline } from "react-icons/io5";
import QRScanner from "./QRScanner";

const NavigationRecalibrationModal = ({ sessionId, onClose, onRecalibrated }) => {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleScanSuccess = async (qrCode) => {
    setScanning(false);
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("http://localhost:8000/api/navigation/recalibrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_route_id: sessionId,
          qr_code: qrCode,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Recalibration failed. Invalid QR code.");
      }

      const data = await res.json();
      
      // Successfully recalibrated!
      // Pass the updated route and current node ID back
      if (onRecalibrated) {
        onRecalibrated(data.route, data.current_node_id);
      }
      onClose();
    } catch (err) {
      console.error("Recalibration API error:", err);
      setErrorMsg(err.message || "An unexpected error occurred during recalibration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm overflow-hidden bg-white shadow-2xl rounded-3xl border border-gray-150 p-6 flex flex-col gap-4 text-center">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h4 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
            <IoLocateOutline className="text-emerald-500 w-5 h-5 animate-pulse" />
            Recalibrate Position
          </h4>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <IoCloseOutline className="w-6 h-6" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-center gap-2 text-left font-medium">
            <IoAlertCircleOutline className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <p className="text-xs text-gray-500 leading-relaxed">
          If your navigation dot appears out of sync, scan any nearby Paadha QR plaque to sync your real-time position.
        </p>

        {loading ? (
          <div className="py-8 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <span className="text-xs text-gray-500 font-semibold">Recalculating route...</span>
          </div>
        ) : (
          <button
            onClick={() => setScanning(true)}
            className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/10 transition-all text-sm flex items-center justify-center gap-2"
          >
            <IoLocateOutline className="w-5 h-5" />
            Scan QR Now
          </button>
        )}

        {scanning && (
          <QRScanner
            onScanSuccess={handleScanSuccess}
            onClose={() => setScanning(false)}
          />
        )}

      </div>
    </div>
  );
};

export default NavigationRecalibrationModal;
