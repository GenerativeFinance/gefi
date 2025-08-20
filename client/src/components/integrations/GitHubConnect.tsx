import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, PlugZap, Unplug, Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Status = { connected: boolean };

interface GitHubConnectProps {
  onConnectedChange?: (connected: boolean) => void;
  variant?: 'default' | 'compact';
}

export default function GitHubConnect({ onConnectedChange, variant = 'default' }: GitHubConnectProps) {
  const [status, setStatus] = useState<Status>({ connected: false });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refresh = async () => {
    try {
      const r = await fetch('/api/integrations/github/status');
      const j = await r.json();
      setStatus(j);
      onConnectedChange?.(!!j.connected);
    } catch (error) {
      console.error('Failed to check GitHub status:', error);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const connect = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/integrations/github/install-url');
      const j = await r.json();
      if (j?.url) {
        window.location.href = j.url;
      } else {
        toast({
          title: "Connection Error",
          description: "Failed to get GitHub authorization URL",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to GitHub",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setLoading(true);
    try {
      await fetch('/api/integrations/github/disconnect', { method: 'POST' });
      await refresh();
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from GitHub",
      });
    } catch (error) {
      toast({
        title: "Disconnection Error",
        description: "Failed to disconnect from GitHub",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <Github className="h-4 w-4" />
        {status.connected ? (
          <Button variant="outline" size="sm" onClick={disconnect} disabled={loading}>
            <Unplug className="h-3 w-3 mr-1" />
            Disconnect
          </Button>
        ) : (
          <Button size="sm" onClick={connect} disabled={loading}>
            <PlugZap className="h-3 w-3 mr-1" />
            Connect GitHub
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        {status.connected ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Github className="h-5 w-5 text-muted-foreground" />
        )}
        <div>
          <div className="font-semibold flex items-center gap-2">
            <Github className="h-4 w-4" />
            GitHub
          </div>
          <div className="text-sm text-muted-foreground">
            {status.connected ? 'Connected - Access your repositories' : 'Connect to manage your repositories'}
          </div>
        </div>
      </div>
      {status.connected ? (
        <Button variant="outline" onClick={disconnect} disabled={loading}>
          <Unplug className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      ) : (
        <Button onClick={connect} disabled={loading}>
          <PlugZap className="h-4 w-4 mr-2" />
          Connect
        </Button>
      )}
    </div>
  );
}