import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { GitBranch, GitCommit, GitMerge, GitPullRequest, Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function VersionControl() {
  const repositories = [
    {
      name: "portfolio-optimizer",
      description: "AI-powered portfolio optimization algorithm",
      branch: "main",
      commits: 156,
      lastCommit: "2 hours ago",
      status: "active"
    },
    {
      name: "risk-assessment-model",
      description: "Monte Carlo risk analysis framework",
      branch: "feature/var-calculation",
      commits: 89,
      lastCommit: "1 day ago",
      status: "development"
    },
    {
      name: "trading-algorithm",
      description: "High-frequency trading system",
      branch: "main",
      commits: 234,
      lastCommit: "3 hours ago",
      status: "active"
    }
  ];

  const branches = [
    {
      name: "main",
      type: "main",
      commits: 156,
      lastCommit: "2 hours ago",
      author: "Guillaume Lauzier",
      protected: true
    },
    {
      name: "feature/performance-optimization",
      type: "feature",
      commits: 8,
      lastCommit: "4 hours ago",
      author: "Guillaume Lauzier",
      protected: false
    },
    {
      name: "hotfix/memory-leak",
      type: "hotfix",
      commits: 3,
      lastCommit: "1 day ago",
      author: "Data Team",
      protected: false
    }
  ];

  const pullRequests = [
    {
      id: "#47",
      title: "Implement advanced backtesting metrics",
      author: "Guillaume Lauzier",
      status: "open",
      branch: "feature/backtesting-metrics",
      target: "main",
      commits: 12,
      files: 8,
      created: "2 days ago",
      reviews: { approved: 2, requested: 1 }
    },
    {
      id: "#46",
      title: "Fix portfolio rebalancing algorithm",
      author: "AI Team",
      status: "approved",
      branch: "hotfix/rebalancing",
      target: "main",
      commits: 5,
      files: 3,
      created: "1 day ago",
      reviews: { approved: 3, requested: 0 }
    },
    {
      id: "#45",
      title: "Add cryptocurrency support",
      author: "Guillaume Lauzier",
      status: "draft",
      branch: "feature/crypto-support",
      target: "develop",
      commits: 24,
      files: 15,
      created: "5 days ago",
      reviews: { approved: 0, requested: 0 }
    }
  ];

  const commits = [
    {
      hash: "a1b2c3d",
      message: "Optimize portfolio allocation algorithm performance",
      author: "Guillaume Lauzier",
      time: "2 hours ago",
      branch: "main",
      files: 4
    },
    {
      hash: "e4f5g6h",
      message: "Add unit tests for risk calculation module",
      author: "Guillaume Lauzier",
      time: "4 hours ago",
      branch: "feature/testing",
      files: 7
    },
    {
      hash: "i7j8k9l",
      message: "Update dependencies and fix security vulnerabilities",
      author: "Security Team",
      time: "1 day ago",
      branch: "main",
      files: 12
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Version Control</h1>
            <p className="text-muted-foreground mt-2">
              Manage your AI model repositories, branches, and collaborative development
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <GitBranch className="h-4 w-4 mr-2" />
              Create Branch
            </Button>
            <Button variant="outline">
              <GitPullRequest className="h-4 w-4 mr-2" />
              New Pull Request
            </Button>
          </div>
        </div>

        <Tabs defaultValue="repositories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
            <TabsTrigger value="commits">Commits</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="repositories" className="space-y-6">
            <div className="grid gap-4">
              {repositories.map((repo, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{repo.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={repo.status === "active" ? "default" : "secondary"}>
                          {repo.status}
                        </Badge>
                        <Button size="sm">
                          <GitBranch className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-4 w-4" />
                        <span>{repo.branch}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitCommit className="h-4 w-4" />
                        <span>{repo.commits} commits</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Last commit: {repo.lastCommit}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="branches" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Input placeholder="Search branches..." className="max-w-sm" />
              <Button variant="outline">
                <GitBranch className="h-4 w-4 mr-2" />
                New Branch
              </Button>
            </div>
            <div className="grid gap-4">
              {branches.map((branch, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <GitBranch className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{branch.name}</span>
                            <Badge variant={branch.type === "main" ? "default" : "secondary"}>
                              {branch.type}
                            </Badge>
                            {branch.protected && (
                              <Badge variant="destructive">Protected</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{branch.commits} commits</span>
                            <span>by {branch.author}</span>
                            <span>{branch.lastCommit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <GitMerge className="h-4 w-4 mr-2" />
                          Merge
                        </Button>
                        <Button size="sm" variant="outline">
                          <GitPullRequest className="h-4 w-4 mr-2" />
                          Pull Request
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pull-requests" className="space-y-6">
            <div className="grid gap-4">
              {pullRequests.map((pr, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-600">{pr.id}</span>
                          <CardTitle className="text-lg">{pr.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>by {pr.author}</span>
                          <span>{pr.created}</span>
                          <span>{pr.branch} → {pr.target}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          pr.status === "open" ? "default" : 
                          pr.status === "approved" ? "success" : 
                          "secondary"
                        }>
                          {pr.status === "open" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {pr.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {pr.status === "draft" && <XCircle className="h-3 w-3 mr-1" />}
                          {pr.status}
                        </Badge>
                        <Button size="sm">
                          View PR
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <GitCommit className="h-4 w-4" />
                        <span>{pr.commits} commits</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{pr.files} files changed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{pr.reviews.approved} approved</span>
                      </div>
                      {pr.reviews.requested > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span>{pr.reviews.requested} review requested</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="commits" className="space-y-6">
            <div className="grid gap-4">
              {commits.map((commit, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <GitCommit className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-semibold">{commit.message}</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="font-mono">{commit.hash}</span>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{commit.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{commit.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitBranch className="h-3 w-3" />
                              <span>{commit.branch}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{commit.files} files</Badge>
                        <Button size="sm" variant="outline">
                          View Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Repository Settings</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure version control preferences and repository settings
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Branch</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>main</option>
                    <option>develop</option>
                    <option>master</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Merge Strategy</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Merge Commit</option>
                    <option>Squash and Merge</option>
                    <option>Rebase and Merge</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-delete Branches</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>After merge</option>
                    <option>Never</option>
                    <option>After 30 days</option>
                  </select>
                </div>
                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}