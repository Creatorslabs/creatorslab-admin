import {
  LayoutDashboard,
  Users,
  ListTodo,
  Activity,
  Shield,
} from "lucide-react";

export function getMenuList(role: string) {
  switch (role) {
    case "Super Admin":
      return [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/users", label: "Users", icon: Users },
        { href: "/tasks", label: "Tasks", icon: ListTodo },
        { href: "/engagement", label: "Engagement", icon: Activity },
        { href: "/admins", label: "Admin", icon: Shield },
      ];
    case "Admin":
      return [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/users", label: "Users", icon: Users },
        { href: "/tasks", label: "Tasks", icon: ListTodo },
        { href: "/engagement", label: "Engagement", icon: Activity },
        { href: "/admins", label: "Admin", icon: Shield },
      ];
    case "Moderator":
      return [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/tasks", label: "Tasks", icon: ListTodo },
        { href: "/engagement", label: "Engagement", icon: Activity },
      ];
    case "Support":
      return [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/users", label: "Users", icon: Users },
      ];
    default:
      return [{ href: "/", label: "Dashboard", icon: LayoutDashboard }];
  }
}
