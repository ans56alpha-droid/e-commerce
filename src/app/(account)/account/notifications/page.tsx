"use client";

import { useEffect, useState, useActionState } from "react";
import { Bell, CheckCheck, Clock } from "lucide-react";

import {
  getNotificationsAction,
  markAllNotificationsReadAction,
  deleteNotificationAction,
} from "@/actions/notification";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import ConfirmAction from "@/components/ui/confirm-action";
import EmptyState from "@/components/shared/empty-state";
import ErrorState from "@/components/shared/error-state";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const [markAllState, markAllAction, markAllPending] = useActionState(
    markAllNotificationsReadAction,
    { success: false }
  );

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (markAllState.success) {
      loadNotifications();
    }
  }, [markAllState.success]);

  async function loadNotifications() {
    setLoading(true);
    setError(null);
    try {
      const result = await getNotificationsAction();
      if (result.success) {
        setNotifications(result.notifications as unknown as Notification[]);
        setUnreadCount(result.unreadCount);
      } else {
        setError(result.message ?? "Failed to load notifications");
      }
    } catch {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorState description={error} onRetry={loadNotifications} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-2 text-muted-foreground">
            Stay updated on your orders and account activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <form action={markAllAction}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={markAllPending}
            >
              <CheckCheck className="mr-2 h-4 w-4" aria-hidden="true" />
              {markAllPending ? "Marking..." : "Mark all as read"}
            </Button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You're all caught up! Notifications about your orders and account will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onAction={loadNotifications}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onAction,
}: {
  notification: Notification;
  onAction: () => void;
}) {
  const [deleteState, _deleteFormAction, _deletePending] = useActionState(
    deleteNotificationAction,
    { success: false }
  );

  useEffect(() => {
    if (deleteState.success) {
      onAction();
    }
  }, [deleteState.success, onAction]);

  return (
    <Card
      className={`transition-colors ${
        notification.isRead
          ? "opacity-60"
          : "border-l-4 border-l-primary"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="mt-0.5">
            <Bell
              className={`h-4 w-4 ${
                notification.isRead
                  ? "text-muted-foreground"
                  : "text-primary"
              }`}
              aria-hidden="true"
            />
          </div>

          <div className="space-y-1">
            <p className="font-medium">{notification.title}</p>
            <p className="text-sm text-muted-foreground">
              {notification.message}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {timeAgo(notification.createdAt)}
            </div>
          </div>
        </div>

        <div className="shrink-0">
          {!notification.isRead && (
            <span className="mb-2 inline-block h-2 w-2 rounded-full bg-primary" />
          )}

          <ConfirmAction
            action={deleteNotificationAction}
            fields={[
              { name: "notificationId", value: notification._id },
            ]}
            confirmMessage="Delete this notification?"
            confirmLabel="Delete"
            variant="destructive"
          />
        </div>
      </div>
    </Card>
  );
}
