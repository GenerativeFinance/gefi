import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import GitHubConnect from "@/components/integrations/GitHubConnect";
import { GitBranch, GitCommit, GitMerge, GitPullRequest, Clock, User, CheckCircle, XCircle, AlertCircle, ExternalLink, Github, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  default_branch: string;
  description?: string;
  forks_count?: number;
  stargazers_count?: number;
  pushed_at?: string;
  private?: boolean;
};

type GitHubBranch = {
  name: string;
  commit: { sha: string };
  protected: boolean;
};

type GitHubPullRequest = {
  id: number;
  number: number;
  title: string;
  state: string;
  user: { login: string };
  head: { ref: string };
  base: { ref: string };
  created_at: string;
  merged_at?: string;
  draft: boolean;
};

type GitHubCommit = {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
};

export default function VersionControl() {
  const [connected, setConnected] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [branches, setBranches] = useState<GitHubBranch[]>([]);
  const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState(false);
  const [createBranchOpen, setCreateBranchOpen] = useState(false);
  const [createPROpen, setCreatePROpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [baseBranch, setBaseBranch] = useState('');
  const [prTitle, setPrTitle] = useState('');
  const [prHead, setPrHead] = useState('');
  const [prBase, setPrBase] = useState('');
  const [prBody, setPrBody] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (connected) {
      loadRepos();
    }
  }, [connected]);

  useEffect(() => {
    if (selectedRepo) {
      loadRepoData(selectedRepo);
    }
  }, [selectedRepo]);

  const loadRepos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/integrations/github/repos');
      if (response.ok) {
        const data = await response.json();
        setRepos(data);
        if (data.length > 0) {
          setSelectedRepo(data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRepoData = async (repo: GitHubRepo) => {
    setLoading(true);
    try {
      const [branchesRes, prsRes, commitsRes] = await Promise.all([
        fetch(`/api/integrations/github/repos/${repo.owner.login}/${repo.name}/branches`),
        fetch(`/api/integrations/github/repos/${repo.owner.login}/${repo.name}/pulls`),
        fetch(`/api/integrations/github/repos/${repo.owner.login}/${repo.name}/commits`)
      ]);

      if (branchesRes.ok) {
        const branchData = await branchesRes.json();
        setBranches(branchData);
        setBaseBranch(repo.default_branch);
        setPrBase(repo.default_branch);
      }
      if (prsRes.ok) {
        const prData = await prsRes.json();
        setPullRequests(prData);
      }
      if (commitsRes.ok) {
        const commitData = await commitsRes.json();
        setCommits(commitData);
      }
    } catch (error) {
      console.error('Failed to load repo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBranch = async () => {
    if (!selectedRepo || !newBranchName || !baseBranch) return;

    try {
      const response = await fetch(`/api/integrations/github/repos/${selectedRepo.owner.login}/${selectedRepo.name}/branches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: baseBranch, newBranch: newBranchName })
      });

      if (response.ok) {
        toast({ title: "Success", description: `Branch '${newBranchName}' created successfully` });
        setCreateBranchOpen(false);
        setNewBranchName('');
        loadRepoData(selectedRepo);
      } else {
        const error = await response.json();
        toast({ title: "Error", description: error.message || "Failed to create branch", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create branch", variant: "destructive" });
    }
  };

  const createPullRequest = async () => {
    if (!selectedRepo || !prTitle || !prHead || !prBase) return;

    try {
      const response = await fetch(`/api/integrations/github/repos/${selectedRepo.owner.login}/${selectedRepo.name}/pulls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: prTitle, head: prHead, base: prBase, body: prBody })
      });

      if (response.ok) {
        toast({ title: "Success", description: `Pull request '${prTitle}' created successfully` });
        setCreatePROpen(false);
        setPrTitle(''); setPrHead(''); setPrBody('');
        loadRepoData(selectedRepo);
      } else {
        const error = await response.json();
        toast({ title: "Error", description: error.message || "Failed to create pull request", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create pull request", variant: "destructive" });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            {connected && selectedRepo && (
              <>
                <Dialog open={createBranchOpen} onOpenChange={setCreateBranchOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <GitBranch className="h-4 w-4 mr-2" />
                      Create Branch
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Branch</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="branch-name">Branch Name</Label>
                        <Input
                          id="branch-name"
                          value={newBranchName}
                          onChange={(e) => setNewBranchName(e.target.value)}
                          placeholder="feature/new-feature"
                        />
                      </div>
                      <div>
                        <Label htmlFor="base-branch">Base Branch</Label>
                        <Select value={baseBranch} onValueChange={setBaseBranch}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.name} value={branch.name}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={createBranch} disabled={!newBranchName || !baseBranch}>
                        Create Branch
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={createPROpen} onOpenChange={setCreatePROpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <GitPullRequest className="h-4 w-4 mr-2" />
                      New Pull Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Pull Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="pr-title">Title</Label>
                        <Input
                          id="pr-title"
                          value={prTitle}
                          onChange={(e) => setPrTitle(e.target.value)}
                          placeholder="Add new feature"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pr-head">Head Branch</Label>
                        <Select value={prHead} onValueChange={setPrHead}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select head branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.name} value={branch.name}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pr-base">Base Branch</Label>
                        <Select value={prBase} onValueChange={setPrBase}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.name} value={branch.name}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pr-body">Description (optional)</Label>
                        <Input
                          id="pr-body"
                          value={prBody}
                          onChange={(e) => setPrBody(e.target.value)}
                          placeholder="Describe your changes..."
                        />
                      </div>
                      <Button onClick={createPullRequest} disabled={!prTitle || !prHead || !prBase}>
                        Create Pull Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>

        {!connected ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  Connect GitHub
                </CardTitle>
                <p className="text-muted-foreground">
                  Connect your GitHub account to manage repositories, branches, and collaborative development directly from GeFi.
                </p>
              </CardHeader>
              <CardContent>
                <GitHubConnect onConnectedChange={setConnected} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {repos.length > 0 && (
              <div className="mb-6">
                <Label htmlFor="repo-select">Repository</Label>
                <Select value={selectedRepo?.id.toString()} onValueChange={(value) => {
                  const repo = repos.find(r => r.id.toString() === value);
                  if (repo) setSelectedRepo(repo);
                }}>
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {repos.map((repo) => (
                      <SelectItem key={repo.id} value={repo.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4" />
                          {repo.full_name}
                          {repo.private && <Badge variant="secondary">Private</Badge>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}

        {connected && repos.length > 0 && (
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
                {repos.map((repo) => (
                  <Card key={repo.id} className={selectedRepo?.id === repo.id ? "ring-2 ring-primary" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Github className="h-5 w-5" />
                            {repo.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {repo.private ? (
                            <Badge variant="secondary">Private</Badge>
                          ) : (
                            <Badge variant="outline">Public</Badge>
                          )}
                          <Button 
                            size="sm" 
                            variant={selectedRepo?.id === repo.id ? "default" : "outline"}
                            onClick={() => setSelectedRepo(repo)}
                          >
                            {selectedRepo?.id === repo.id ? "Selected" : "Select"}
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={`https://github.com/${repo.full_name}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              GitHub
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <GitBranch className="h-4 w-4" />
                          <span>{repo.default_branch}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{repo.forks_count} forks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{repo.stargazers_count} stars</span>
                        </div>
                        {repo.pushed_at && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Updated: {formatDate(repo.pushed_at)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="branches" className="space-y-6">
              {selectedRepo ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Input placeholder="Search branches..." className="max-w-sm" />
                    <Button variant="outline" onClick={() => setCreateBranchOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Branch
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {branches.map((branch) => (
                      <Card key={branch.name}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <GitBranch className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{branch.name}</span>
                                  <Badge variant={branch.name === selectedRepo.default_branch ? "default" : "secondary"}>
                                    {branch.name === selectedRepo.default_branch ? "main" : "branch"}
                                  </Badge>
                                  {branch.protected && (
                                    <Badge variant="destructive">Protected</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span className="font-mono text-xs">{branch.commit.sha.slice(0, 7)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => {
                                setPrHead(branch.name);
                                setCreatePROpen(true);
                              }}>
                                <GitPullRequest className="h-4 w-4 mr-2" />
                                Pull Request
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Select a repository to view branches</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pull-requests" className="space-y-6">
              {selectedRepo ? (
                <div className="grid gap-4">
                  {pullRequests.length > 0 ? pullRequests.map((pr) => (
                    <Card key={pr.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-blue-600">#{pr.number}</span>
                              <CardTitle className="text-lg">{pr.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>by {pr.user.login}</span>
                              <span>{formatDate(pr.created_at)}</span>
                              <span>{pr.head.ref} → {pr.base.ref}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              pr.state === "open" ? (pr.draft ? "secondary" : "default") : 
                              pr.state === "closed" ? (pr.merged_at ? "default" : "destructive") : 
                              "secondary"
                            } className={pr.merged_at ? "bg-green-600 hover:bg-green-700 text-white" : ""}>
                              {pr.state === "open" && !pr.draft && <AlertCircle className="h-3 w-3 mr-1" />}
                              {pr.merged_at && <CheckCircle className="h-3 w-3 mr-1" />}
                              {pr.draft && <XCircle className="h-3 w-3 mr-1" />}
                              {pr.draft ? "Draft" : pr.merged_at ? "Merged" : pr.state}
                            </Badge>
                            <Button size="sm" variant="outline" asChild>
                              <a href={`https://github.com/${selectedRepo.full_name}/pull/${pr.number}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View PR
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )) : (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No pull requests found</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Select a repository to view pull requests</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="commits" className="space-y-6">
              {selectedRepo ? (
                <div className="grid gap-4">
                  {commits.length > 0 ? commits.map((commit) => (
                    <Card key={commit.sha}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                              <GitCommit className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <div className="font-semibold">{commit.commit.message}</div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="font-mono">{commit.sha.slice(0, 7)}</span>
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{commit.commit.author.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDate(commit.commit.author.date)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={`https://github.com/${selectedRepo.full_name}/commit/${commit.sha}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Changes
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No commits found</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Select a repository to view commits</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>GitHub Integration</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Manage your GitHub connection and integration settings
                    </p>
                  </CardHeader>
                  <CardContent>
                    <GitHubConnect onConnectedChange={setConnected} />
                  </CardContent>
                </Card>

                {selectedRepo && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Repository Information</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Details about the selected repository
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Repository Name</Label>
                          <p className="text-sm text-muted-foreground">{selectedRepo.name}</p>
                        </div>
                        <div>
                          <Label>Owner</Label>
                          <p className="text-sm text-muted-foreground">{selectedRepo.owner.login}</p>
                        </div>
                        <div>
                          <Label>Default Branch</Label>
                          <p className="text-sm text-muted-foreground">{selectedRepo.default_branch}</p>
                        </div>
                        <div>
                          <Label>Visibility</Label>
                          <p className="text-sm text-muted-foreground">
                            {selectedRepo.private ? "Private" : "Public"}
                          </p>
                        </div>
                      </div>
                      {selectedRepo.description && (
                        <div>
                          <Label>Description</Label>
                          <p className="text-sm text-muted-foreground">{selectedRepo.description}</p>
                        </div>
                      )}
                      <Button variant="outline" asChild>
                        <a href={`https://github.com/${selectedRepo.full_name}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on GitHub
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}