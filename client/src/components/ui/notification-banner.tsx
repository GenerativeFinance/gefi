import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Bell, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import notificationsData from '@/data/notifications.json';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionUrl: string;
  actionText: string;
  date: string;
  image: string;
}

export function NotificationBanner() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    // Load dismissed notifications from localStorage
    const dismissed = localStorage.getItem('gefi_dismissed_notifications');
    if (dismissed) {
      setDismissedIds(JSON.parse(dismissed));
    }

    // Filter out dismissed notifications and sort by priority and date
    const activeNotifications = (notificationsData as Notification[])
      .filter(notification => !dismissedIds.includes(notification.id))
      .sort((a, b) => {
        // Sort by priority first (high > medium > low)
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        // Then by date (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 3); // Show up to 3 notifications

    setNotifications(activeNotifications);
  }, [dismissedIds]);

  const dismissNotification = (id: string) => {
    const newDismissedIds = [...dismissedIds, id];
    setDismissedIds(newDismissedIds);
    localStorage.setItem('gefi_dismissed_notifications', JSON.stringify(newDismissedIds));
  };

  const nextNotification = () => {
    setCurrentIndex((prev) => (prev + 1) % notifications.length);
  };

  const prevNotification = () => {
    setCurrentIndex((prev) => (prev - 1 + notifications.length) % notifications.length);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_release':
        return '🚀';
      case 'feature_update':
        return '✨';
      case 'compliance':
        return '⚖️';
      case 'improvement':
        return '📈';
      case 'security':
        return '🔒';
      default:
        return '📢';
    }
  };

  if (notifications.length === 0) return null;

  const currentNotification = notifications[currentIndex];

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-4xl px-4">
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <Badge className={getPriorityColor(currentNotification.priority)}>
                {currentNotification.priority.toUpperCase()}
              </Badge>
              <Badge variant="outline">{currentNotification.category}</Badge>
              {notifications.length > 1 && (
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} of {notifications.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={prevNotification}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={nextNotification}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => dismissNotification(currentNotification.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                {getTypeIcon(currentNotification.type)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1">
                {currentNotification.title}
              </h3>
              <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                {currentNotification.message}
              </p>
              
              <div className="flex items-center gap-3">
                <Link href={currentNotification.actionUrl}>
                  <Button size="sm" className="gap-2">
                    {currentNotification.actionText}
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
                <span className="text-xs text-muted-foreground">
                  {new Date(currentNotification.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}