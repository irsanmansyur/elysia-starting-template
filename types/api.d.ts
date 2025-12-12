declare namespace Api {
  type User = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    role: "user" | "admin" | "super-admin";
  };
  type Site = {
    id: string;
    siteName: string;
    pubKey: string;
    privateKey: string;
    domain?: string | null | undefined;
    subdomain: string;
    createdAt: Date;
    updatedAt: Date;
  };
  type Page = {
    id: string;
    siteId: string;
    userId: string;
    title: string;
    pathname: string;
    content: string;
    status: "on" | "off";
    createdAt: Date;
    updatedAt: Date;
  };
  type Setting = {
    value: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
