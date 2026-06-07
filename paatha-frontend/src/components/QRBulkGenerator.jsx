import React, { useState } from "react";
import { IoCloseOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { BACKEND_URL } from "../config";

const QRBulkGenerator = ({ nodes, onClose, onSuccess }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Filter nodes based on search query
  const filteredNodes = nodes.filter((node) => {
    const nameMatch = node.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const idMatch = node.id?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || idMatch;
  });

  const handleToggleSelectNode = (id) => {
    if (selectedNodeIds.includes(id)) {
      setSelectedNodeIds(selectedNodeIds.filter((nodeId) => nodeId !== id));
    } else {
      setSelectedNodeIds([...selectedNodeIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedNodeIds.length === filteredNodes.length) {
      // Clear selection
      setSelectedNodeIds([]);
    } else {
      // Select all visible filtered nodes
      setSelectedNodeIds(filteredNodes.map((n) => n.id));
    }
  };

  const handleBulkGenerate = async () => {
    if (selectedNodeIds.length === 0) {
      setErrorMsg("Please select at least one navigation node.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("paatha_token");
      const res = await fetch(`${BACKEND_URL}/api/qr/bulk-generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedNodeIds),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to bulk generate QR codes.");
      }

      // Read ZIP response as a blob and download it
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "paadha-qrcodes.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setDownloadUrl(url);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Bulk QR generation error:", err);
      setErrorMsg(err.message || "An error occurred during bulk generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl border border-gray-100 flex flex-col h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            Bulk QR Generator
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <IoCloseOutline className="w-7 h-7" />
          </button>
        </div>

        {/* Content */}
        {downloadUrl ? (
          /* Success Screen */
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6">
            <IoCheckmarkCircleOutline className="w-20 h-20 text-emerald-500 animate-bounce" />
            
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-gray-900">QRs Generated Successfully!</h4>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                All QR codes have been mapped, saved, and your ZIP archive containing {selectedNodeIds.length} QR images has started downloading.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full max-w-xs pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-sm"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Selection Screen */
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
            {errorMsg && (
              <div className="p-3 bg-red-55 text-red-600 text-xs rounded-xl text-center font-medium">
                {errorMsg}
              </div>
            )}

            {/* Search and Select All Bar */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search nodes by ID or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-4 py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
              >
                {selectedNodeIds.length === filteredNodes.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            {/* Nodes Checklist */}
            <div className="flex-1 border border-slate-150 rounded-2xl overflow-y-auto p-2 space-y-1 bg-slate-50/50">
              {filteredNodes.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">
                  No matching nodes found.
                </div>
              ) : (
                filteredNodes.map((node) => {
                  const isChecked = selectedNodeIds.includes(node.id);
                  return (
                    <label
                      key={node.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? "bg-emerald-50/80 border-emerald-200 shadow-sm"
                          : "bg-white border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectNode(node.id)}
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          {node.name || `Node ${node.id}`}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-gray-500 font-bold bg-slate-100 p-1 px-2 rounded-lg">
                        {node.id}
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Generate */}
            <div className="border-t border-gray-150 pt-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">
                {selectedNodeIds.length} node{selectedNodeIds.length !== 1 && "s"} selected
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading || selectedNodeIds.length === 0}
                  onClick={handleBulkGenerate}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  {loading ? "Generating ZIP..." : "Generate & Download ZIP"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default QRBulkGenerator;
