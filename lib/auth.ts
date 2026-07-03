import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email || !password) return null;

        const usuario = await db.usuario.findUnique({
          where: { email },
        });

        if (!usuario || !usuario.password) return null;

        const passwordMatch = await compare(password, usuario.password);
        if (!passwordMatch) return null;

        return {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.email,
          image: usuario.imagen,
          role: usuario.rol,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email;
        if (!email) return false;

        const existingUser = await db.usuario.findUnique({
          where: { email },
        });

        const cookieStore = await cookies();
        const authFlow = cookieStore.get("auth_flow")?.value;
        cookieStore.delete("auth_flow");

        if (existingUser) {
          if (user.image && user.image !== existingUser.imagen) {
            await db.usuario.update({
              where: { id: existingUser.id },
              data: { imagen: user.image },
            });
          }

          const existingAccount = await db.cuenta.findUnique({
            where: {
              proveedor_proveedorCuentaId: {
                proveedor: account.provider,
                proveedorCuentaId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount) {
            await db.cuenta.create({
              data: {
                usuarioId: existingUser.id,
                proveedor: account.provider,
                proveedorCuentaId: account.providerAccountId,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                expiresAt: account.expires_at,
              },
            });
          }
        } else {
          if (authFlow !== "register") {
            return "/admin?error=NoAccount";
          }

          const newUser = await db.usuario.create({
            data: {
              email,
              nombre: profile?.name ?? user.name ?? "Usuario",
              imagen: user.image,
            },
          });

          await db.cuenta.create({
            data: {
              usuarioId: newUser.id,
              proveedor: account.provider,
              proveedorCuentaId: account.providerAccountId,
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              expiresAt: account.expires_at,
            },
          });
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.usuario.findUnique({
          where: { email: token.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.rol;
          token.picture = dbUser.imagen;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
