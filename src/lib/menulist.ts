import {
  LayoutDashboard,
  Users,
  ListTodo,
  Activity,
  Shield,
  User,
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
        { href: "/profile", label: "Profile", icon: User },
      ];
    case "Admin":
      return [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/users", label: "Users", icon: Users },
        { href: "/tasks", label: "Tasks", icon: ListTodo },
        { href: "/engagement", label: "Engagement", icon: Activity },
        { href: "/admins", label: "Admin", icon: Shield },
        { href: "/profile", label: "Profile", icon: User },
      ];
    case "Moderator":
      return [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/tasks", label: "Tasks", icon: ListTodo },
        { href: "/engagement", label: "Engagement", icon: Activity },
        { href: "/profile", label: "Profile", icon: User },
      ];
    case "Support":
      return [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/users", label: "Users", icon: Users },
        { href: "/profile", label: "Profile", icon: User },
      ];
    default:
      return [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/profile", label: "Profile", icon: User },
      ];
  }
}
