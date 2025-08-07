import React, { useEffect, useState } from 'react';

interface SeoAuditRequest {
  id: string;
  created_at: string;
  website_url: string;
  email: string;
  notes: string | null;
  audit_status: string;
  contact_status: string;
}

const statusOptions = [
  { value: 'no audit yet', label: 'No Audit Yet' },
  { value: 'audit done', label: 'Audit Done' },
];
const contactOptions = [
  { value: 'not contacted yet', label: 'Not Contacted Yet' },
  { value: 'contacted', label: 'Contacted' },
];

import { config } from '../../lib/config';

  const supabaseUrl = `${config.supabase.url}/rest/v1/seo_audit_requests`;
const supabaseHeaders = {
  'Content-Type': 'application/json',
      'apikey': config.supabase.anonKey,
};

const SeoAudits: React.FC = () => {
  const [requests, setRequests] = useState<SeoAuditRequest[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<{ [id: string]: string }>({});
  const [notesSaved, setNotesSaved] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(supabaseUrl + '?order=created_at.desc', {
        headers: supabaseHeaders,
      });
      if (!res.ok) throw new Error('Failed to fetch requests');
      const data = await res.json();
      setRequests(data);
      // Initialize notesDraft with current notes
      const draft: { [id: string]: string } = {};
      data.forEach((req: SeoAuditRequest) => {
        draft[req.id] = req.notes || '';
      });
      setNotesDraft(draft);
    } catch (err: any) {
      setError(err.message || 'Error loading requests');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this request?')) return;
    setDeleting(id);
    setError(null);
    try {
      const res = await fetch(supabaseUrl + `?id=eq.${id}`, {
        method: 'DELETE',
        headers: supabaseHeaders,
      });
      if (!res.ok) throw new Error('Failed to delete');
      setRequests(reqs => reqs.filter(r => r.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error deleting');
    }
    setDeleting(null);
  }

  async function handleUpdate(id: string, updates: Partial<SeoAuditRequest>) {
    setEditing(id);
    setError(null);
    try {
      const res = await fetch(supabaseUrl + `?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...supabaseHeaders, 'Prefer': 'return=representation' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update');
      const [updated] = await res.json();
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, ...updated } : r));
    } catch (err: any) {
      setError(err.message || 'Error updating');
    }
    setEditing(null);
  }

  async function handleSaveNotes(id: string) {
    setEditing(id);
    setError(null);
    try {
      await handleUpdate(id, { notes: notesDraft[id] });
      setNotesSaved(s => ({ ...s, [id]: true }));
      setTimeout(() => setNotesSaved(s => ({ ...s, [id]: false })), 1500);
    } catch (err) {
      // error already handled in handleUpdate
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">SEO Audit Requests</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-gray-400">No SEO audit requests yet.</div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-[#181818] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-400">{new Date(req.created_at).toLocaleString()}</span>
                  <div className="font-semibold text-lg text-white mt-1">{req.website_url}</div>
                  <div className="text-gray-300 text-sm">{req.email}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    className="px-3 py-1 text-xs rounded bg-[#0CF2A0]/20 text-[#0CF2A0] hover:bg-[#0CF2A0]/40 transition-colors"
                    onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                  >
                    {expanded === req.id ? 'Close' : 'Open'}
                  </button>
                  <button
                    className="px-3 py-1 text-xs rounded bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                    onClick={() => handleDelete(req.id)}
                    disabled={deleting === req.id}
                  >
                    {deleting === req.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
              {expanded === req.id && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Notes</label>
                    <textarea
                      className="w-full bg-black border border-gray-800 rounded p-2 text-white text-sm"
                      value={notesDraft[req.id] || ''}
                      onChange={e => setNotesDraft(d => ({ ...d, [req.id]: e.target.value }))}
                      rows={2}
                      disabled={editing === req.id}
                    />
                    <button
                      className="mt-2 px-4 py-1 bg-[#0CF2A0] text-black rounded hover:bg-[#07C280] transition-colors text-xs font-medium"
                      onClick={() => handleSaveNotes(req.id)}
                      disabled={editing === req.id}
                    >
                      {editing === req.id ? 'Saving...' : 'Save Notes'}
                    </button>
                    {notesSaved[req.id] && <span className="ml-2 text-green-400 text-xs">Saved!</span>}
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Audit Status</label>
                      <select
                        className="bg-black border border-gray-800 rounded p-2 text-white text-sm"
                        value={req.audit_status}
                        onChange={e => handleUpdate(req.id, { audit_status: e.target.value })}
                        disabled={editing === req.id}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Contact Status</label>
                      <select
                        className="bg-black border border-gray-800 rounded p-2 text-white text-sm"
                        value={req.contact_status}
                        onChange={e => handleUpdate(req.id, { contact_status: e.target.value })}
                        disabled={editing === req.id}
                      >
                        {contactOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeoAudits; 