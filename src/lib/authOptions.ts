// src/lib/authOptions.ts

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email / Student ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectToDB();
        const user = await User.findOne({
          $or: [
            { regNo: credentials?.identifier },
            { email: credentials?.identifier }
          ]
        });

        if (!user) throw new Error("User not found");
        if (user.password !== credentials?.password) throw new Error("Invalid password");

        const plainUser = user.toObject();
        return {
          ...plainUser,
          id: plainUser._id.toString(),
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
        token.faculty = user.faculty;
        token.role = user.role;
        token.year = user.year;
        token.hasVoted = user.hasVoted;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        email: token.email as string,
        faculty: token.faculty as string,
        role: token.role as string,
        year: token.year as number,
        hasVoted: token.hasVoted as boolean,
      };
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  }
};
