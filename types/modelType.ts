import { SprintStatus, IssueStatus, IssuePriority } from "@prisma/client";

export type User = {
  id: string;
  clerkUserId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: Date; // serialized from Prisma DateTime
  updatedAt: Date;
};
// export type assignee = {
//   id: string;
//   clerkUserId: string;
//   email: string;
//   name: string;
//   imageUrl: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

export type Issue = {
  id: string;
  title: string;
  description?: string | null;
  status: IssueStatus; // or IssueStatus if you have enum types defined in TS
  order: number;
  priority: IssuePriority; // or IssuePriority enum in TS
  assignee: User | null;
  assigneeId?: string | null;
  reporter: User;
  reporterId: string;
  projectId: string;
  sprintId?: string | null;
  createdAt: Date; // DateTime from Prisma is usually serialized as string in JSON
  updatedAt: Date;
};

export type Sprint = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: SprintStatus; // or SprintStatus enum
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  issues?: Issue[]; // optional array of issues linked to sprint
};
