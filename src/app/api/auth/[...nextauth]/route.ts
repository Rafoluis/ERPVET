/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Adapter } from 'next-auth/adapters';

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        dni: { label: 'DNI', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const user = await prisma.usuario.findFirst({
          where: {
            dni: credentials.dni,
          },
          include: {
            roles: {
              include: {
                rol: true,
              },
            },
          },
        });

        if (!user || user?.roles[0].rol.nombre === 'PACIENTE') {
          throw new Error("No user found");
        }

        if (user && user.password === credentials.password) {
          return {
            id: user.id_usuario.toString(),
            dni: user.dni,
            firstName: user.nombre,
            lastName: user.apellido,
            role: user.roles[0].rol.nombre,
            email: user.email,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/',
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
