import React, { useState, useCallback } from 'react';
import { DesignRequest } from '../AdminPage';
import { supabase } from '../../lib/supabase';

interface DesignRequestListProps {
  designRequests: DesignRequest[];
  setDesignRequests: React.Dispatch<React.SetStateAction<DesignRequest[]>>;
}

const DesignRequestList: React.FC<DesignRequestListProps> = ({ designRequests, setDesignRequests }) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ [id: string]: string }>({});
  const [statuses, setStatuses] = useState<{ [id: string]: string }>({});
  const [localRequests, setLocalRequests] = useState(designRequests);

  // Sort newest first
  const sorted = [...localRequests].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleStatusChange = useCallback(async (id: string, newStatus: string) => {
    setUpdatingId(id);
    setStatuses(prev => ({ ...prev, [id]: newStatus }));
    
    try {
      await supabase().from('design_requests').update({ status: newStatus }).eq('id', id);
      setLocalRequests(requests => requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
      setDesignRequests(requests => requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingId(null);
    }
  }, [setDesignRequests]);

  const handleNotesChange = (id: string, value: string) => {
    setNotes(prev => ({ ...prev, [id]: value }));
  };

  const handleNotesBlur = useCallback(async (id: string) => {
    setUpdatingId(id);
    
    try {
      await supabase().from('design_requests').update({ admin_notes: notes[id] }).eq('id', id);
      setLocalRequests(requests => requests.map(r => r.id === id ? { ...r, admin_notes: notes[id] } : r));
      setDesignRequests(requests => requests.map(r => r.id === id ? { ...r, admin_notes: notes[id] } : r));
    } catch (error) {
      console.error('Error updating notes:', error);
    } finally {
      setUpdatingId(null);
    }
  }, [notes, setDesignRequests]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this design request?')) return;
    
    setUpdatingId(id);
    
    try {
      const { error } = await supabase().from('design_requests').delete().eq('id', id);
      
      if (error) {
        console.error('Error deleting design request:', error);
        alert('Failed to delete design request. Please try again.');
        return;
      }
      
      setLocalRequests(requests => requests.filter(r => r.id !== id));
      setDesignRequests(requests => requests.filter(r => r.id !== id));
    } catch (err) {
      console.error('Unexpected error deleting design request:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  }, [setDesignRequests]);

  const handleRespondedCheckbox = useCallback(async (id: string, checked: boolean) => {
    const newStatus = checked ? 'responded' : 'new';
    await handleStatusChange(id, newStatus);
  }, [handleStatusChange]);

  return (
    <div className="space-y-4">
      {sorted.map((request) => (
        <div key={request.id} className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-light tracking-tight">{request.email}</h3>
              <p className="text-green-400 text-sm">{request.service_type}</p>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <span className="text-sm text-gray-500 block">
                {new Date(request.timestamp).toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(statuses[request.id] ?? request.status ?? 'new') === 'responded'}
                    onChange={e => handleRespondedCheckbox(request.id, e.target.checked)}
                    disabled={updatingId === request.id}
                  />
                  Responded
                </label>
                <select
                  className="bg-[#222] text-white border border-gray-700 rounded px-2 py-1 text-sm"
                  value={statuses[request.id] ?? request.status ?? 'new'}
                  onChange={e => handleStatusChange(request.id, e.target.value)}
                  disabled={updatingId === request.id}
                >
                  <option value="new">new</option>
                  <option value="responded">responded</option>
                </select>
                <button
                  className="ml-2 text-xs text-red-400 hover:text-red-200 border border-red-400 hover:border-red-200 rounded px-2 py-1 transition-colors"
                  onClick={() => handleDelete(request.id)}
                  disabled={updatingId === request.id}
                >
                  Delete
                </button>
              </div>
              {updatingId === request.id && (
                <span className="ml-2 text-xs text-gray-400 animate-pulse">Saving...</span>
              )}
            </div>
          </div>
          {request.request_details && (
            <p className="text-gray-300 mb-4">{request.request_details}</p>
          )}
          <div className="mb-2">
            <label className="block text-xs text-gray-400 mb-1">Admin Notes:</label>
            <textarea
              className="w-full bg-[#222] text-white border border-gray-700 rounded px-2 py-1 text-sm"
              rows={2}
              value={notes[request.id] ?? request.admin_notes ?? ''}
              onChange={e => handleNotesChange(request.id, e.target.value)}
              onBlur={() => handleNotesBlur(request.id)}
              disabled={updatingId === request.id}
              placeholder="Add notes..."
            />
          </div>
          {request.responded_at && (
            <div className="text-sm text-gray-500 border-t border-gray-800 pt-4 mt-4">
              Responded on {new Date(request.responded_at).toLocaleString()}
              {request.response_by && ` by ${request.response_by}`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DesignRequestList; 