import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "@/database";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "Custom Login",
      credentials: {
        email: {
          label: "Correo:",
          type: "Email",
          placeholder: "correo@email.com",
        },
        password: {
          label: "Contraseña:",
          type: "password",
          placeholder: "Contraseña",
        },
      },
      async authorize(credentials) {
        console.log({ credentials });
        //todo: validar contra base de datos

        return await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        );
      },
    }),
    GithubProvider({
      clientId: "0c22934d5ba3aec6d8ad",
      clientSecret: "87e71bd4657092cb87702a9f7dffc61176a9fc6c",
    }),
    // ...add more providers here
  ],

  //* Custom Pages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  //*Callbacks
  jwt: {
    //secret: process.env.JWT_SECRET_SEED, //deprecated
  },

  session: {
    maxAge: 2592000, // 30d
    strategy: "jwt",
    updateAge: 86400, //Cada dia
  },

  callbacks: {
    async jwt({ token, account, user }) {
      //console.log({ token, account, user });

      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case "oauth":
            token.user = await dbUsers.oAuthToDbUser(
              user?.email || "",
              user?.name || ""
            );
            break;
          case "credentials":
            token.user = user;
            break;
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      //console.log({ session, token, user });
      session.accessToken = token.accessToken as any;
      session.user = token.user as any;

      return session;
    },
  },
};

export default NextAuth(authOptions);
