import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    type?: string;
    companyName?: string | null;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      type?: string;
      companyName?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    type?: string;
    companyName?: string | null;
  }
}
