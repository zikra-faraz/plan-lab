import { SprintStatus, IssueStatus, IssuePriority, Role } from "@prisma/client";

export type User = {
  id: string;
  clerkUserId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  organizations?: UserOrganization[]; // user memberships with roles
  createdIssues?: Issue[];
  assignedIssues?: Issue[];
  createdAt: Date;
  updatedAt: Date;
};

export type Organization = {
  id: string;
  name: string;
  projects?: Project[];
  members?: UserOrganization[];
  createdAt: Date;
  updatedAt: Date;
};

export type UserOrganization = {
  id: string;
  userId: string;
  organizationId: string;
  role: Role;
  invitedAt?: Date | null;
  joinedAt?: Date | null;
  inviteToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  organization?: Organization;
};

export type Project = {
  id: string;
  name: string;
  key: string;
  description?: string | null;
  organizationId: string;
  organization?: Organization;
  sprints?: Sprint[];
  issues?: Issue[];
  createdAt: Date;
  updatedAt: Date;
};

export type Sprint = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
  projectId: string;
  project?: Project;
  issues?: Issue[];
  createdAt: Date;
  updatedAt: Date;
};

export type Issue = {
  id: string;
  title: string;
  description?: string | null;
  status: IssueStatus;
  order: number;
  priority: IssuePriority;
  assigneeId?: string | null;
  assignee?: User | null;
  reporterId: string;
  reporter: User;
  projectId: string;
  project?: Project;
  sprintId?: string | null;
  sprint?: Sprint | null;
  createdAt: Date;
  updatedAt: Date;
};
