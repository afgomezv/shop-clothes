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
      async authorize(credentials, req) {
        console.log({ credentials });
        //todo: validar contra base de datos

        const user = await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        );
        if (user) {
          return {
            id: user._id, //* Supongo que `_id` es el campo de identificación
            email: user.email,
            role: user.role,
            name: user.name,
          };
        } else {
          //* Si no se encuentra un usuario válido, devolver null
          return null;
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.CLIENT_SECRET ?? "",
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
