import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import clientPromise from "./mongodb";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  // Google, Github, likewise
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "email and password",
      credentials: {
        email: {
          label: "Email",
          placeholder: "email@email.com",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },},
        async authorize(credentials,req) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please provide valid credentials");
          }
          const client = await MongoClient.connect(
            process.env.MONGODB_URI as string
          );
          const db = client.db();
      //     const user = await db
      //       .collection("users")
      //       .findOne({ email: credentials.email });
      //     if (user) {
      //       return user as any;
      //     } else {
      //       return null;
      //     }
       
      // },
      try {
        // Find user by email
        const user = await db.collection("users").findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }
  
        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
  
        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }
  
        // Close connection and return user
        await client.close();
        return user as any; // Return essential user data
      } catch (error:any) {
        await client.close();
        throw new Error("Authorization failed");
      }
    },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  adapter: MongoDBAdapter(clientPromise) ,
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

