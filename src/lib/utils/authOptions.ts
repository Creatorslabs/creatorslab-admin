import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Admin, IAdmin } from "@/lib/models/Admin";
import { verifyPassword } from "../auth";
import connectDB from "../connectDB";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const admin = await Admin.findOne({
          email: credentials.email,
        }).lean<IAdmin>();
        if (!admin || !admin.password) {
          throw new Error("Invalid credentials.");
        }

        const isValid = await verifyPassword(
          credentials.password,
          admin.password
        );
        if (!isValid) {
          throw new Error("Invalid credentials.");
        }

        if (admin.status === "Banned") {
          throw new Error("Access denied. Admin is banned.");
        }

        if (admin.status === "Restricted") {
          throw new Error("Access denied. Admin is restricted.");
        }

        return {
          id: (admin._id as string).toString(),
          email: admin.email,
          name: admin.name,
          role: "admin",
          status: admin.status,
          image: admin.image ?? "",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const admin = await Admin.findOne({ email: user.email });
        if (admin) {
          admin.lastLogin = new Date();
          await admin.save();
        }
      } catch (error) {
        console.error("Failed to update lastLogin:", error);
      }

      return true; // allow sign-in
    },
    async jwt({ token, user }) {
      if (user) {
        // On initial login
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image ?? "";

        await connectDB();
        const admin = await Admin.findOne({ email: user.email }).lean<IAdmin>();
        if (admin) {
          token.role = admin.role;
          token.status = admin.status;
          token.image = admin.image ?? "";
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          image: token.image,
          role: token.role,
          status: token.status as "Active" | "Restricted" | "Banned",
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
