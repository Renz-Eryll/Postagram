// app/notifications/page.tsx

import NotificationsClient from "./NotificationClient";

export const metadata = {
  title: "Notifications",
  description: "View your notifications on Postagram.",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
