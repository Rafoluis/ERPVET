 
 
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
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
        });

        if (user && user.password === credentials.password) {
          return {
            id: user.id_usuario.toString(),
            dni: user.dni,
            firstName: user.nombre,
            lastName: user.apellido,
            role: user.tipo_usuario,
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
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({token, user}){
      if (user) {
        token.id = user.id; // Agrega datos personalizados al token
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session ({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    }
  },

  pages: {
    signIn: "/auth/login",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
