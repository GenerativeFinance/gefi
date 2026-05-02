import { useState, useEffect } from "react";
import { Bell, MessageSquare, AtSign, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface NotificationCount {
  total: number;
  messages: number;
  mentions: number;
  threadReplies: number;
}

interface Notification {
  id: string;
  type: "message" | "mention" | "thread_reply";
  title: string;
  message: string;
  conversationId: string;
  conversationName: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch notification count
  const { data: notificationCount } = useQuery({
    queryKey: ["/api/messaging/notifications/count"],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Fetch notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ["/api/messaging/notifications"],
    enabled: isOpen, // Only fetch when popover is open
  });

  const notificationsList = Array.isArray(notifications) ? notifications as Notification[] : [];

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/messaging/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messaging/notifications/count"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messaging/notifications"] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/messaging/notifications/read-all", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to mark all as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messaging/notifications/count"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messaging/notifications"] });
    },
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "mention":
        return <AtSign className="h-4 w-4 text-orange-500" />;
      case "thread_reply":
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const count = (notificationCount as NotificationCount)?.total || 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {count > 9 ? "9+" : count}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-96">
          {notificationsLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading notifications...
            </div>
          ) : notificationsList.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notificationsList.map((notification) => (
                <Link
                  key={notification.id}
                  href={`/messaging?conversation=${notification.conversationId}`}
                >
                  <div
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                      !notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.senderAvatar || undefined} />
                        <AvatarFallback className="text-xs">
                          {notification.senderName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {getNotificationIcon(notification.type)}
                          <p className="text-sm font-medium truncate">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            in {notification.conversationName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>

        {notificationsList.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Link href="/messaging">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View all messages
                </Button>
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}