import React, { useState, useEffect } from "react";
import { 
  IoSearchOutline, 
  IoFilterOutline, 
  IoCloudDownloadOutline, 
  IoPrintOutline, 
  IoAddOutline, 
  IoTrashOutline, 
  IoEyeOutline, 
  IoDuplicateOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoCloseOutline
} from "react-icons/io5";
import QRCreateModal from "./QRCreateModal";
import QRBulkGenerator from "./QRBulkGenerator";
import { BACKEND_URL } from "../config";

const QRManagementPage = ({ nodes, onQrChange }) => {
  const [qrs, setQrs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [qrType, setQrType] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive"
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openBulk, setOpenBulk] = useState(false);
  
  const [selectedQrForEdit, setSelectedQrForEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null); // id of QR being deleted

  const fetchQrs = async () => {
    setLoading(true);
    try {
      const activeParam = statusFilter === "active" ? "true" : statusFilter === "inactive" ? "false" : "";
      const query = new URLSearchParams({
        page: page.toString(),
        size: "10",
        ...(search && { search }),
        ...(qrType && { qr_type: qrType }),
        ...(activeParam && { is_active: activeParam })
      });

      const res = await fetch(`${BACKEND_URL}/api/qr?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setQrs(data.items || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
        if (onQrChange) {
          onQrChange();
        }
      }
    } catch (err) {
      console.error("Error fetching QR locations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrs();
  }, [page, search, qrType, statusFilter]);

  // Handle pagination search resets
  useEffect(() => {
    setPage(1);
  }, [search, qrType, statusFilter]);

  const handleDeleteQr = async (id) => {
    if (!window.confirm("Are you sure you want to delete this QR location? This will perform a soft delete.")) return;
    
    setIsDeleting(id);
    try {
      const token = localStorage.getItem("paatha_token");
      const res = await fetch(`${BACKEND_URL}/api/qr/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (res.ok) {
        fetchQrs();
      }
    } catch (err) {
      console.error("Error deleting QR location:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePrintSheet = async () => {
    try {
      window.open(`${BACKEND_URL}/api/qr/print-sheet`, "_blank");
    } catch (err) {
      console.error("Error downloading print sheet:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-800 p-6 overflow-y-auto">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">QR Code Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Map navigation nodes to physical QR code placements, generate coordinates, and export print sheets.
          </p>
        </div>
        
        {/* Bulk Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handlePrintSheet}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all"
          >
            <IoPrintOutline className="w-4 h-4" />
            Print QR Sheet
          </button>
          
          <button
            onClick={() => setOpenBulk(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all"
          >
            <IoDuplicateOutline className="w-4 h-4" />
            Bulk QR Generator
          </button>

          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/10 transition-all"
          >
            <IoAddOutline className="w-4 h-4" />
            Create QR
          </button>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 bg-white p-4 rounded-2xl border border-slate-150 shadow-sm">
        {/* Search */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="Search by name, code, or node ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
          />
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        </div>

        {/* QR Type Filter */}
        <div className="relative">
          <select
            value={qrType}
            onChange={(e) => setQrType(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-emerald-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">All QR Types</option>
            <option value="ENTRANCE">Entrance</option>
            <option value="JUNCTION">Junction</option>
            <option value="CORRIDOR">Corridor</option>
            <option value="DEPARTMENT">Department</option>
            <option value="STAIR">Stair</option>
            <option value="LIFT">Lift</option>
          </select>
          <IoFilterOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-emerald-500 transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          <IoFilterOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* QR List Table */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden flex flex-col min-h-[300px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
            Loading QR locations...
          </div>
        ) : qrs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-400 py-12">
            No QR locations matching the current filters.
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-150">
                  <th className="px-5 py-3.5">QR Code</th>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Node ID</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {qrs.map((qr) => (
                  <tr key={qr.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-700">
                      {qr.qr_code}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{qr.name}</div>
                      {qr.description && (
                        <div className="text-[10px] text-slate-400 mt-0.5 max-w-[200px] truncate">
                          {qr.description}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold tracking-wide">
                        {qr.qr_type}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-500 font-semibold">
                      {qr.node_id}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {qr.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold">
                          <IoCheckmarkCircle className="w-3.5 h-3.5 text-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 rounded-full font-bold">
                          <IoCloseCircle className="w-3.5 h-3.5 text-rose-400" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Download Image */}
                        {qr.image_path && (
                          <a
                            href={`${BACKEND_URL}${qr.image_path}`}
                            download={`${qr.qr_code}.png`}
                            title="Download PNG"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
                          >
                            <IoCloudDownloadOutline className="w-4 h-4" />
                          </a>
                        )}

                        {/* View Preview */}
                        {qr.image_path && (
                          <button
                            onClick={() => setSelectedQrForEdit(qr)}
                            title="View Preview"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
                          >
                            <IoEyeOutline className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete QR */}
                        <button
                          onClick={() => handleDeleteQr(qr.id)}
                          disabled={isDeleting === qr.id}
                          title="Soft Delete"
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-50 transition-all"
                        >
                          <IoTrashOutline className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-150 bg-slate-50/50">
            <span className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">
              Page {page} of {pages} ({total} total)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white bg-slate-50 transition-all"
              >
                <IoChevronBackOutline className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={page >= pages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white bg-slate-50 transition-all"
              >
                <IoChevronForwardOutline className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {openCreate && (
        <QRCreateModal
          nodes={nodes}
          onClose={() => setOpenCreate(false)}
          onSuccess={() => {
            fetchQrs();
            setOpenCreate(false);
          }}
        />
      )}

      {openBulk && (
        <QRBulkGenerator
          nodes={nodes}
          onClose={() => setOpenBulk(false)}
          onSuccess={() => {
            fetchQrs();
            setOpenBulk(false);
          }}
        />
      )}

      {selectedQrForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white p-6 shadow-2xl rounded-3xl text-center space-y-4 border border-gray-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm">QR Code Preview</h4>
              <button 
                onClick={() => setSelectedQrForEdit(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <IoCloseOutline className="w-5 h-5" />
              </button>
            </div>
            
            <div className="border border-slate-200 p-4 rounded-2xl bg-white shadow-sm max-w-[170px] mx-auto">
              <img 
                src={`${BACKEND_URL}${selectedQrForEdit.image_path}`} 
                alt={selectedQrForEdit.qr_code}
                className="w-full h-auto"
              />
            </div>
            
            <div className="space-y-1">
              <h5 className="font-bold text-slate-900 text-sm">{selectedQrForEdit.name}</h5>
              <p className="font-bold text-emerald-600 text-xs font-mono">{selectedQrForEdit.qr_code}</p>
              <p className="text-[10px] text-slate-500">
                Node: {selectedQrForEdit.node_id} | Type: {selectedQrForEdit.qr_type}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default QRManagementPage;
