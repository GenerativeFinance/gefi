import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface RecentAlertsProps {
  alerts: any[];
}

export default function RecentAlerts({ alerts }: RecentAlertsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest("POST", `/api/risk-alerts/${alertId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/risk-alerts"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to mark alert as read",
        variant: "destructive",
      });
    },
  });

  // Default alerts if no data
  const defaultAlerts = [
    {
      id: 1,
      type: "warning",
      title: "AI predicts recessionary trend",
      description: "Machine learning models indicate potential market downturn",
      severity: "high",
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: 2,
      type: "info",
      title: "Reduce tech stocks by 10%",
      description: "Portfolio optimization suggests reducing technology sector exposure",
      severity: "medium",
      isRead: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    },
    {
      id: 3,
      type: "error",
      title: "Abnormal crypto volatility detected",
      description: "Cryptocurrency markets showing unusual volatility patterns",
      severity: "medium",
      isRead: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    }
  ];

  const alertsList = alerts && alerts.length > 0 ? alerts : defaultAlerts;

  const getAlertIcon = (type: string, severity: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "info":
        return <Clock className="h-4 w-4 text-blue-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-400" />;
    }
  };

  const getAlertBorderColor = (type: string, severity: string) => {
    switch (type) {
      case "error":
        return "border-red-500/30";
      case "warning":
        return "border-yellow-500/30";
      case "info":
        return "border-blue-500/30";
      default:
        return "border-orange-500/30";
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-900/20";
      case "warning":
        return "bg-yellow-900/20";
      case "info":
        return "bg-blue-900/20";
      default:
        return "bg-orange-900/20";
    }
  };

  const getTimeAgo = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const handleMarkAsRead = (alertId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(alertId);
  };

  return (
    <Card className="glass">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-primary" />
          <span>Recent Alerts</span>
        </CardTitle>
        <Button variant="ghost" size="sm">
          View All <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {alertsList.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No recent alerts</p>
            <p className="text-sm text-muted-foreground mt-1">
              You'll be notified when AI detects risks or anomalies
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alertsList.slice(0, 5).map((alert) => (
              <div 
                key={alert.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-secondary/70 ${
                  getAlertBgColor(alert.type)
                } ${getAlertBorderColor(alert.type)}`}
                onClick={() => !alert.isRead && handleMarkAsRead(alert.id, {} as React.MouseEvent)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  alert.type === 'error' ? 'bg-red-500/20' :
                  alert.type === 'warning' ? 'bg-yellow-500/20' :
                  alert.type === 'info' ? 'bg-blue-500/20' : 'bg-orange-500/20'
                }`}>
                  {getAlertIcon(alert.type, alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`font-semibold text-sm ${
                        alert.type === 'error' ? 'text-red-300' :
                        alert.type === 'warning' ? 'text-yellow-300' :
                        alert.type === 'info' ? 'text-blue-300' : 'text-orange-300'
                      }`}>
                        {alert.title}
                      </h4>
                      {alert.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {alert.description}
                        </p>
                      )}
                      <p className={`text-xs mt-1 ${
                        alert.type === 'error' ? 'text-red-400' :
                        alert.type === 'warning' ? 'text-yellow-400' :
                        alert.type === 'info' ? 'text-blue-400' : 'text-orange-400'
                      }`}>
                        {getTimeAgo(alert.createdAt)}
                      </p>
                    </div>
                    {!alert.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {alertsList.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {alertsList.filter(a => !a.isRead).length} unread alerts
              </span>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Mark all as read
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
