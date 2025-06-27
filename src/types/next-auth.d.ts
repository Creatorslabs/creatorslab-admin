import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      image: string;
      email: string;
      status: "Active" | "Restricted" | "Banned";
      role?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    image: string;
    email: string;
    status: "Active" | "Restricted" | "Banned";
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    image: string;
    status: "Active" | "Restricted" | "Banned";
    role?: string;
  }
}
