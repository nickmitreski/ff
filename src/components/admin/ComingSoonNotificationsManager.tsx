import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Trash2, CheckCircle, Clock, Users, Gamepad2 } from 'lucide-react';

interface ComingSoonNotification {
  id: string;
  email: string;
  feature_name: string;
  created_at: string;
  notified: boolean;
  notified_at: string | null;
}

interface ComingSoonNotificationsManagerProps {
  notifications: ComingSoonNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<ComingSoonNotification[]>>;
}

const ComingSoonNotificationsManager: React.FC<ComingSoonNotificationsManagerProps> = ({
  notifications,
  setNotifications
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique feature names for filtering
  const featureNames = Array.from(new Set(notifications.map(n => n.feature_name))).sort();

  // Filter notifications based on search and feature selection
  const filteredNotifications = notifications.filter(notification => {
    const matchesFeature = selectedFeature === 'all' || notification.feature_name === selectedFeature;
    const matchesSearch = notification.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.feature_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFeature && matchesSearch;
  });

  // Group notifications by feature
  const notificationsByFeature = notifications.reduce((acc, notification) => {
    if (!acc[notification.feature_name]) {
      acc[notification.feature_name] = [];
    }
    acc[notification.feature_name].push(notification);
    return acc;
  }, {} as Record<string, ComingSoonNotification[]>);

  // Mark notification as sent
  const markAsNotified = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('coming_soon_notifications')
        .update({ 
          notified: true, 
          notified_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, notified: true, notified_at: new Date().toISOString() }
            : notification
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as notified');
    } finally {
      setLoading(false);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('coming_soon_notifications')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    } finally {
      setLoading(false);
    }
  };

  // Get stats
  const totalNotifications = notifications.length;
  const pendingNotifications = notifications.filter(n => !n.notified).length;
  const sentNotifications = notifications.filter(n => n.notified).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-white tracking-tight flex items-center gap-3">
            <Mail size={28} className="text-blue-400" />
            Coming Soon Notifications
          </h2>
          <p className="text-gray-400 mt-1">Manage email notifications for upcoming features</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-blue-400" />
            <div>
              <div className="text-white text-2xl font-light">{totalNotifications}</div>
              <div className="text-gray-500 text-sm">Total Subscribers</div>
            </div>
          </div>
        </div>
        <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-yellow-400" />
            <div>
              <div className="text-white text-2xl font-light">{pendingNotifications}</div>
              <div className="text-gray-500 text-sm">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-green-400" />
            <div>
              <div className="text-white text-2xl font-light">{sentNotifications}</div>
              <div className="text-gray-500 text-sm">Notified</div>
            </div>
          </div>
        </div>
        <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3">
            <Gamepad2 size={20} className="text-purple-400" />
            <div>
              <div className="text-white text-2xl font-light">{featureNames.length}</div>
              <div className="text-gray-500 text-sm">Features</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by email or feature name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedFeature}
            onChange={(e) => setSelectedFeature(e.target.value)}
            className="w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Features</option>
            {featureNames.map((featureName: string) => (
              <option key={featureName} value={featureName}>{featureName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-black/30 rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredNotifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-black/20">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {notification.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {notification.feature_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {notification.notified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" />
                        Notified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock size={12} className="mr-1" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {!notification.notified && (
                        <button
                          onClick={() => markAsNotified(notification.id)}
                          disabled={loading}
                          className="text-green-400 hover:text-green-300 disabled:opacity-50"
                          title="Mark as notified"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        disabled={loading}
                        className="text-red-400 hover:text-red-300 disabled:opacity-50"
                        title="Delete notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredNotifications.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            {searchTerm || selectedFeature !== 'all' ? 'No notifications match your filters' : 'No notifications yet'}
          </div>
        )}
      </div>

      {/* Feature Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(notificationsByFeature).map(([featureName, featureNotifications]) => (
          <div key={featureName} className="bg-black/30 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Gamepad2 size={16} className="text-purple-400" />
              <h3 className="text-white font-medium">{featureName}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total:</span>
                <span className="text-white">{featureNotifications.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pending:</span>
                <span className="text-yellow-400">{featureNotifications.filter((n: ComingSoonNotification) => !n.notified).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Notified:</span>
                <span className="text-green-400">{featureNotifications.filter((n: ComingSoonNotification) => n.notified).length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoonNotificationsManager; 