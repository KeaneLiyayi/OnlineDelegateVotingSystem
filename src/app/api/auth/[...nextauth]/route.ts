import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email / Student ID", type: "text", placeholder: "admin@example.com or 123456" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    await connectToDB();
                    console.log("Database connected");
                } catch (error) {
                    console.error("Database connection failed:", error);
                    throw new Error("Database connection error");
                }
                console.log(credentials)
                const allUsers = await User.find();
                console.log(allUsers);

                const user = await User.findOne({
                    $or: [{ regNo: credentials?.identifier }, { email: credentials?.identifier }]
                });
                console.log("User found:", user);

                if (!user) {
                    throw new Error("User not found");
                    console.log('hey')
                }

                if (user.password === credentials?.password) {
                    const plainUser = user.toObject();
                    return {
                        ...plainUser,
                        id: plainUser._id.toString(), // This is the ID NextAuth will use
                    };
                }else {
                    throw new Error("Invalid password");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id;
                token.faculty = user.faculty;
                token.email = user.email;
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
