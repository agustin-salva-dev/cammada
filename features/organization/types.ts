export interface TimelineEvent {
  period: string;
  title: string;
  description: string;
}

export interface OrganizationPillar {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ContactChannel {
  id: string;
  title: string;
  description: string;
  email: string;
  icon: string;
}

export type ContactFormStatus = "idle" | "loading" | "success" | "error";
