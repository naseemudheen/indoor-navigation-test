import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

const QRCreateModal = ({ nodes, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [qrType, setQrType] = useState("JUNCTION");
  const [nodeId, setNodeId] = useState("");
  const [xCoord, setXCoord] = useState("");
  const [yCoord, setYCoord] = useState("");
  const [headingDirection, setHeadingDirection] = useState("90");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [previewQr, setPreviewQr] = useState(null);

  // Auto-fill coordinates from node selection
  useEffect(() => {
    if (nodeId) {
      const selectedNode = nodes.find((n) => n.id === nodeId);
      if (selectedNode && selectedNode.coordinates) {
        setXCoord(selectedNode.coordinates[0]);
        setYCoord(selectedNode.coordinates[1]);
      }
    } else {
      setXCoord("");
      setYCoord("");
    }
  }, [nodeId, nodes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !nodeId || !qrType) {
      setErrorMsg("Please fill in all required fields (Name, Node, Type).");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    const payload = {
      name,
      description: description || null,
      qr_type: qrType,
      node_id: nodeId,
      x_coordinate: xCoord ? parseFloat(xCoord) : null,
      y_coordinate: yCoord ? parseFloat(yCoord) : null,
      heading_direction: headingDirection ? parseInt(headingDirection) : null,
      is_active: true,
    };

    try {
      const token = localStorage.getItem("paatha_token");
      const res = await fetch("http://localhost:8000/api/qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create QR Location");
      }

      const data = await res.json();
      setPreviewQr(data); // Store for preview
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error creating QR Location:", err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            {previewQr ? "QR Code Generated" : "Create QR Location"}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <IoCloseOutline className="w-7 h-7" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {previewQr ? (
            /* Success Preview Screen */
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-2xl w-full max-w-sm">
                🎉 QR Code created successfully!
              </div>
              
              <div className="border border-slate-200 p-4 rounded-3xl bg-white shadow-sm max-w-[200px]">
                <img 
                  src={`http://localhost:8000${previewQr.image_path}`} 
                  alt={previewQr.qr_code}
                  className="w-full h-auto"
                />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-gray-950">{previewQr.name}</h4>
                <p className="text-sm font-bold text-emerald-600">{previewQr.qr_code}</p>
                <p className="text-xs text-gray-500">Mapped to Node: {previewQr.node_id} | Type: {previewQr.qr_type}</p>
              </div>

              <div className="flex items-center gap-3 w-full">
                <a
                  href={`http://localhost:8000${previewQr.image_path}`}
                  download={`${previewQr.qr_code}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-colors text-sm"
                >
                  Download Image
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Form Screen */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl text-center font-medium border border-red-100">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Main Junction Corridor"
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                {/* QR Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">QR Type *</label>
                  <select
                    value={qrType}
                    onChange={(e) => setQrType(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  >
                    <option value="ENTRANCE">Entrance</option>
                    <option value="JUNCTION">Junction</option>
                    <option value="CORRIDOR">Corridor</option>
                    <option value="DEPARTMENT">Department</option>
                    <option value="STAIR">Stair</option>
                    <option value="LIFT">Lift</option>
                  </select>
                </div>
              </div>

              {/* Node Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Select Navigation Node *</label>
                <select
                  required
                  value={nodeId}
                  onChange={(e) => setNodeId(e.target.value)}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="">-- Choose a Navigation Node --</option>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name ? `${node.name} (${node.id})` : node.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional placement notes or description..."
                  rows={2}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="border-t border-gray-100 pt-4 mt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Position Information (Optional)</h4>
                
                <div className="grid grid-cols-3 gap-3">
                  {/* X Coordinate */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600">X Coord</label>
                    <input
                      type="number"
                      step="any"
                      value={xCoord}
                      onChange={(e) => setXCoord(e.target.value)}
                      placeholder="e.g. 1200"
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-emerald-500 transition-all"
                    />
                  </div>

                  {/* Y Coordinate */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600">Y Coord</label>
                    <input
                      type="number"
                      step="any"
                      value={yCoord}
                      onChange={(e) => setYCoord(e.target.value)}
                      placeholder="e.g. 850"
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-emerald-500 transition-all"
                    />
                  </div>

                  {/* Heading Direction */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600">Heading (°)</label>
                    <input
                      type="number"
                      min="0"
                      max="359"
                      value={headingDirection}
                      onChange={(e) => setHeadingDirection(e.target.value)}
                      placeholder="e.g. 90"
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/10 transition-colors text-sm"
                >
                  {loading ? "Generating..." : "Generate QR"}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default QRCreateModal;
