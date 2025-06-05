import { getUserIssues } from "@/actions/issues";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import IssueCard from "@/app/(main)/project/_components/issue-card";
import { Issue } from "@/types/modelType";
type UserIssuesProps = {
  userId: string;
};
const UserIssues = async ({ userId }: UserIssuesProps) => {
  const issues = await getUserIssues(userId);
  if (issues.length === 0) {
    return null;
  }

  const assignedIssues = issues.filter(
    (issue) => issue?.assignee?.clerkUserId === userId
  );
  const reportedIssues = issues.filter(
    (issue) => issue.reporter.clerkUserId === userId
  );
  return (
    <div>
      <h1 className="text-4xl font-bold gradient-title mb-4">My Issues</h1>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList>
          <TabsTrigger value="assigned">Assigned to You</TabsTrigger>
          <TabsTrigger value="reported">Reported by You</TabsTrigger>
        </TabsList>
        <TabsContent value="assigned">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid issues={assignedIssues} />
          </Suspense>
        </TabsContent>
        <TabsContent value="reported">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid issues={reportedIssues} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};
type IssueGridProps = {
  issues: Issue[];
};

function IssueGrid({ issues }: IssueGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} showStatus />
      ))}
    </div>
  );
}

export default UserIssues;
