import { AuthOptions, User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

interface ExtendedUser extends NextAuthUser {
  _id: string;
  faculty: string;
  role: string;
  year: number;
  hasVoted: boolean;
}

interface ExtendedToken extends JWT {
  id?: string;
  
  faculty?: string;
  role?: string;
  year?: number;
  hasVoted?: boolean;
}

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
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: any;
    }) {
      if (user) {
        token.id = user._id?.toString?.() ?? user.id;
        token.email = user.email;
        token.faculty = user.faculty;
        token.role = user.role;
        token.year = user.year;
        token.hasVoted = user.hasVoted;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: ExtendedToken }) {
      session.user = {
        ...session.user,
        id: token.id ?? "",
        email: token.email ?? "",
        faculty: token.faculty ?? "",
        role: token.role ?? "",
        year: token.year ?? 0,
        hasVoted: token.hasVoted ?? false,
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
