import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { IoCloseOutline, IoCameraOutline } from "react-icons/io5";

const QRScanner = ({ onScanSuccess, onClose }) => {
  const [activeTab, setActiveTab] = useState("camera"); // "camera" | "manual"
  const [qrList, setQrList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [scannerStarted, setScannerStarted] = useState(false);
  const scannerRef = useRef(null);
  const html5QrcodeRef = useRef(null);

  // Fetch QRs for the manual simulator
  useEffect(() => {
    const fetchQrs = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/api/qr?size=100");
        if (res.ok) {
          const data = await res.json();
          setQrList(data.items || []);
        }
      } catch (err) {
        console.error("Error fetching QRs for simulation:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQrs();
  }, []);

  // Initialize camera scanner
  useEffect(() => {
    if (activeTab !== "camera") {
      stopScanner();
      return;
    }

    const startScanner = async () => {
      setErrorMsg(null);
      try {
        // Delay scanner instantiation slightly to ensure DOM element is mounted
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        if (!document.getElementById("reader")) return;
        
        const html5Qrcode = new Html5Qrcode("reader");
        html5QrcodeRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Successfully scanned QR Code
            stopScanner();
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Quietly handle scan failure (polling)
          }
        );
        setScannerStarted(true);
      } catch (err) {
        console.error("Camera startup failed:", err);
        setErrorMsg("Failed to start camera. Make sure camera permission is allowed and HTTPS is active.");
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [activeTab]);

  const stopScanner = () => {
    if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
      html5QrcodeRef.current
        .stop()
        .then(() => {
          console.log("Scanner stopped successfully.");
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err);
        });
    }
    setScannerStarted(false);
  };

  const handleManualSelect = (qrCode) => {
    onScanSuccess(qrCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-3xl border border-gray-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <IoCameraOutline className="text-emerald-500 w-6 h-6" />
            Scan QR Code
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <IoCloseOutline className="w-7 h-7" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1 m-4 rounded-xl">
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "camera"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Use Camera
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "manual"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Simulation (Dev Tool)
          </button>
        </div>

        {/* Scanner Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {activeTab === "camera" ? (
            <div className="flex flex-col items-center justify-center">
              <div 
                id="reader" 
                ref={scannerRef}
                className="w-full aspect-square max-w-[280px] bg-slate-100 border border-dashed border-gray-300 rounded-2xl overflow-hidden relative"
              >
                {!scannerStarted && !errorMsg && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                    Initializing camera...
                  </div>
                )}
              </div>
              
              {errorMsg && (
                <div className="mt-4 p-3 bg-red-55 text-red-600 text-xs rounded-xl text-center font-medium">
                  {errorMsg}
                </div>
              )}
              
              <p className="mt-4 text-xs text-center text-gray-500 font-medium">
                Hold your device steady in front of the Paadha QR code plaque.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">
                Select an active QR code location from the map database to simulate a successful scan.
              </p>

              {loading ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  Loading QR locations...
                </div>
              ) : qrList.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">
                  No active QR codes found. Create one in the Admin Dashboard under QR Management first!
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-[40vh] overflow-y-auto pr-1">
                  {qrList.map((qr) => (
                    <button
                      key={qr.id}
                      onClick={() => handleManualSelect(qr.qr_code)}
                      className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-100 rounded-xl text-left transition-all group"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-emerald-700 text-sm">
                          {qr.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Node ID: {qr.node_id} | Type: {qr.qr_type}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide text-emerald-700 bg-emerald-100/70 rounded-full group-hover:bg-emerald-200">
                        {qr.qr_code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default QRScanner;
