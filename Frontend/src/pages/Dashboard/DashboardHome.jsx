import { useState, useEffect } from 'react';
import { musicService } from '../../services/musicService';
import { Music, ListMusic, Activity } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-stream-card p-6 rounded-lg border border-stream-border/5 shadow-sm hover:border-stream-highlight/50 transition-colors">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-stream-text-secondary text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-4 rounded-full ${color} bg-opacity-10 text-white bg-stream-highlight`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const ArtistDashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await musicService.getArtistStats();
        setStats(res.stats);
        setError(null);
      } catch (err) {
        setError('Failed to fetch artist stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;
  if (error) return <EmptyState icon={Activity} title="Error" description={error} />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Artist Dashboard</h1>
      <p className="text-stream-text-secondary mb-8">Welcome back, {user?.username}. Here is your content overview.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <StatCard 
          title="My Total Songs" 
          value={stats?.totalSongs || 0} 
          icon={Music} 
        />
        <StatCard 
          title="My Total Playlists/Albums" 
          value={stats?.totalPlaylists || 0} 
          icon={ListMusic} 
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recently Uploaded Songs</h2>
        {stats?.recentSongs?.length === 0 ? (
           <div className="bg-stream-card p-8 rounded-lg text-center text-stream-text-secondary border border-stream-border/5">
             You haven't uploaded any songs yet. Head over to Upload Song to get started!
           </div>
        ) : (
          <div className="bg-stream-card rounded-lg overflow-hidden border border-stream-border/5 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stream-border/10 bg-stream-elevated text-stream-text-secondary text-sm">
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Upload Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentSongs?.map((song) => (
                  <tr key={song._id} className="border-b border-stream-border/5 hover:bg-stream-elevated/50 transition-colors">
                    <td className="p-4 font-medium">{song.title}</td>
                    <td className="p-4 text-stream-text-secondary">
                        {new Date(parseInt(song._id.toString().substring(0, 8), 16) * 1000).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDashboardHome;
