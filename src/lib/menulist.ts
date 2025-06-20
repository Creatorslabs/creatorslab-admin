import {
  LayoutDashboard,
  Users,
  ListTodo,
  Activity,
  LucideIcon,
} from "lucide-react";

type Menu = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function getMenuList(): Menu[] {
  return [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/users",
      label: "Users",
      icon: Users,
    },
    {
      href: "/tasks",
      label: "Tasks",
      icon: ListTodo,
    },
    {
      href: "/engagement",
      label: "Engagement",
      icon: Activity,
    },
  ];
}
