import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    dni: string;
    firstName: string;
    lastName: string;
    role: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }

}