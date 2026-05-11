import Image from "next/image";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  pushed_at: string | null;
  topics?: string[];
}

interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface GitHubContributions {
  calendar: ContributionCalendar;
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  totalRepositories: number;
  restrictedContributions: number;
  source: "github" | "repo-updates";
}

interface PrivateRepoStats {
  count: number;
  updatedRecently: number;
  languages: [string, number][];
}

interface GitHubUser {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  html_url?: string;
}

const habitSignals = [
  "maintenance",
  "experimentation",
  "documentation",
  "automation",
  "open-source learning",
];

function githubHeaders() {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function getData() {
  const username = process.env.GITHUB_USERNAME || "shafayet9780";
  let user: GitHubUser = {
    login: username,
    avatar_url: "/placeholder-avatar.png",
    public_repos: 0,
    followers: 0,
  };
  let repos: GitHubRepo[] = [];
  let privateRepoStats: PrivateRepoStats | null = null;

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: githubHeaders(),
      next: { revalidate: 3600 },
    });

    if (!userRes.ok) {
      throw new Error(`GitHub user request failed: ${userRes.status}`);
    }

    user = await userRes.json();
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
  }

  try {
    const repoRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: githubHeaders(),
        next: { revalidate: 3600 },
      },
    );

    if (!repoRes.ok) {
      throw new Error(`GitHub repository request failed: ${repoRes.status}`);
    }

    const reposData: unknown = await repoRes.json();

    if (Array.isArray(reposData)) {
      repos = reposData as GitHubRepo[];
    }
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
  }

  if (process.env.GITHUB_TOKEN) {
    try {
      const privateRepoRes = await fetch(
        "https://api.github.com/user/repos?visibility=private&affiliation=owner,collaborator,organization_member&per_page=100&sort=updated",
        {
          headers: githubHeaders(),
          next: { revalidate: 3600 },
        },
      );

      if (!privateRepoRes.ok) {
        throw new Error(
          `GitHub private repository request failed: ${privateRepoRes.status}`,
        );
      }

      const privateReposData: unknown = await privateRepoRes.json();

      if (Array.isArray(privateReposData)) {
        const privateRepos = privateReposData as GitHubRepo[];
        const recentThreshold = Date.now() - 90 * 24 * 60 * 60 * 1000;

        privateRepoStats = {
          count: privateRepos.length,
          updatedRecently: privateRepos.filter(
            (repo) => new Date(repo.updated_at).getTime() >= recentThreshold,
          ).length,
          languages: getTopLanguages(privateRepos),
        };
      }
    } catch (error) {
      console.error("Error fetching private GitHub repository stats:", error);
    }
  }

  const contributions =
    (await getGitHubContributions(username)) || getFallbackContributions(repos);

  return { user, repos, contributions, privateRepoStats };
}

function formatDate(value: string | null) {
  if (!value) return "Not recently pushed";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getTopLanguages(repos: GitHubRepo[]) {
  const counts = new Map<string, number>();

  repos.forEach((repo) => {
    if (!repo.language) return;
    counts.set(repo.language, (counts.get(repo.language) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

async function getGitHubContributions(
  username: string,
): Promise<GitHubContributions | null> {
  if (!process.env.GITHUB_TOKEN) return null;

  try {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 364);

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: githubHeaders(),
      body: JSON.stringify({
        query: `
          query Contributions($login: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $login) {
              contributionsCollection(from: $from, to: $to) {
                totalCommitContributions
                totalIssueContributions
                totalPullRequestContributions
                totalRepositoryContributions
                restrictedContributionsCount
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                      weekday
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          login: username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL request failed: ${response.status}`);
    }

    const payload = await response.json();
    const collection = payload?.data?.user?.contributionsCollection;

    if (!collection) return null;

    return {
      calendar: collection.contributionCalendar,
      totalCommits: collection.totalCommitContributions,
      totalPullRequests: collection.totalPullRequestContributions,
      totalIssues: collection.totalIssueContributions,
      totalRepositories: collection.totalRepositoryContributions,
      restrictedContributions: collection.restrictedContributionsCount,
      source: "github",
    };
  } catch (error) {
    console.error("Error fetching GitHub contribution calendar:", error);
    return null;
  }
}

function getFallbackContributions(repos: GitHubRepo[]): GitHubContributions {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());

  const counts = new Map<string, number>();
  repos.forEach((repo) => {
    const date = new Date(repo.updated_at);
    date.setHours(0, 0, 0, 0);

    if (date >= start && date <= today) {
      const key = date.toISOString().slice(0, 10);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  });

  const weeks: ContributionWeek[] = [];
  const cursor = new Date(start);

  while (cursor <= today) {
    const week: ContributionWeek = { contributionDays: [] };

    for (let weekday = 0; weekday < 7; weekday += 1) {
      const key = cursor.toISOString().slice(0, 10);
      week.contributionDays.push({
        date: key,
        contributionCount: counts.get(key) || 0,
        weekday,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    weeks.push(week);
  }

  const totalContributions = Array.from(counts.values()).reduce(
    (sum, count) => sum + count,
    0,
  );

  return {
    calendar: {
      totalContributions,
      weeks,
    },
    totalCommits: 0,
    totalPullRequests: 0,
    totalIssues: 0,
    totalRepositories: 0,
    restrictedContributions: 0,
    source: "repo-updates",
  };
}

function getActivityClass(count: number) {
  if (count >= 10) return "bg-(--accent-color)";
  if (count >= 6) return "bg-[rgba(var(--accent-rgb),0.72)]";
  if (count >= 3) return "bg-[rgba(var(--accent-rgb),0.48)]";
  if (count >= 1) return "bg-[rgba(var(--accent-rgb),0.26)]";
  return "bg-(--explorer-hover-bg)";
}

export default async function GitHubPage() {
  const { user, repos, contributions, privateRepoStats } = await getData();
  const recentlyUpdated = repos
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, 6);
  const mostStarred = repos
    .slice()
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4);
  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0,
  );
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const topLanguages = getTopLanguages(repos);

  return (
    <div className="relative overflow-hidden pb-14">
      <div className="pointer-events-none absolute inset-0 workstation-grid opacity-25" />
      <div className="pointer-events-none absolute right-10 top-6 h-72 w-72 rounded-full bg-[rgba(var(--accent-rgb),0.12)] blur-3xl" />

      <section className="relative grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="font-mono text-xs text-(--accent-color)">
            github.credibility
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] text-(--text-color) sm:text-6xl">
            Repository signals, kept focused.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-(--text-color) opacity-70">
            Public activity, technical range, and maintenance habits. Useful
            proof, kept away from the homepage.
          </p>
        </div>

        <aside className="overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-xl">
          <div className="flex h-10 items-center justify-between border-b border-(--explorer-border) bg-(--titlebar-bg)/85 px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28ca41]" />
            </div>
            <p className="font-mono text-xs text-(--text-color) opacity-55">
              profile.remote
            </p>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4">
              <Image
                src={user.avatar_url || "/placeholder-avatar.png"}
                alt={`${user.login} GitHub avatar`}
                width={64}
                height={64}
                className="rounded-lg border border-(--explorer-border)"
              />
              <div>
                <h2 className="text-xl font-bold text-(--text-color)">
                  {user.login}
                </h2>
                <a
                  href={user.html_url || `https://github.com/${user.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-(--accent-color) hover:underline"
                >
                  open on GitHub
                </a>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ["repos", user.public_repos],
                ["followers", user.followers],
                ["stars", totalStars],
                ["forks", totalForks],
                ["private", privateRepoStats?.count ?? "token required"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-3"
                >
                  <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                    {label}
                  </p>
                  <p className="mt-1 text-lg font-bold text-(--text-color)">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="relative grid gap-6 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-xl">
          <div className="mb-5 flex flex-col gap-2 border-b border-(--explorer-border) pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs text-(--accent-color)">
                github.activity
              </p>
              <h2 className="mt-2 text-2xl font-bold text-(--text-color)">
                Daywise activity matrix
              </h2>
            </div>
            <p className="font-mono text-[11px] text-(--text-color) opacity-50">
              daywise / last 12 months
            </p>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-[740px] gap-2">
              <div className="grid grid-rows-7 gap-1.5 pt-6 font-mono text-[10px] text-(--text-color) opacity-45">
                {["", "Mon", "", "Wed", "", "Fri", ""].map((day, index) => (
                  <span key={`${day}-${index}`} className="h-3.5 leading-3.5">
                    {day}
                  </span>
                ))}
              </div>
              <div className="grid grid-flow-col grid-rows-7 gap-1.5">
                {contributions.calendar.weeks.flatMap((week) =>
                  week.contributionDays.map((day) => (
                    <div
                      key={day.date}
                      className={`h-3.5 w-3.5 rounded-[3px] border border-(--explorer-border) ${getActivityClass(
                        day.contributionCount,
                      )}`}
                      title={`${day.date}: ${day.contributionCount} contributions`}
                    />
                  )),
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 border-t border-(--explorer-border) pt-4 sm:grid-cols-5">
            {[
              ["total", contributions.calendar.totalContributions],
              ["commits", contributions.totalCommits],
              ["prs", contributions.totalPullRequests],
              ["issues", contributions.totalIssues],
              ["private", contributions.restrictedContributions],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                  {label}
                </p>
                <p className="mt-1 text-lg font-bold text-(--text-color)">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-xl">
          <p className="font-mono text-xs text-(--accent-color)">
            habits.detected
          </p>
          <h2 className="mt-2 text-2xl font-bold text-(--text-color)">
            Engineering habits
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {habitSignals.map((habit) => (
              <span
                key={habit}
                className="rounded-full border border-(--explorer-border) bg-(--main-bg)/55 px-3 py-1.5 font-mono text-[11px] text-(--text-color) opacity-75"
              >
                {habit}
              </span>
            ))}
          </div>

          <div className="mt-6 border-t border-(--explorer-border) pt-5">
            <p className="font-mono text-xs text-(--accent-color)">
              private.repo.stats
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-3">
                <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                  private repos
                </p>
                <p className="mt-1 text-lg font-bold text-(--text-color)">
                  {privateRepoStats?.count ?? "token required"}
                </p>
              </div>
              <div className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-3">
                <p className="font-mono text-[10px] uppercase text-(--text-color) opacity-45">
                  active 90d
                </p>
                <p className="mt-1 text-lg font-bold text-(--text-color)">
                  {privateRepoStats?.updatedRecently ?? "token required"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-(--explorer-border) pt-5">
            <p className="font-mono text-xs text-(--accent-color)">
              language.range
            </p>
            <div className="mt-4 space-y-3">
              {topLanguages.length > 0 ? (
                topLanguages.map(([language, count]) => (
                  <div key={language}>
                    <div className="flex justify-between gap-4 font-mono text-xs">
                      <span className="text-(--text-color) opacity-75">
                        {language}
                      </span>
                      <span className="text-(--accent-color)">
                        {count} repos
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-(--explorer-hover-bg)">
                      <div
                        className="h-full rounded-full bg-(--accent-color)"
                        style={{
                          width: `${Math.max(
                            18,
                            (count / topLanguages[0][1]) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-(--text-color) opacity-65">
                  Language data appears when public repositories are available.
                </p>
              )}
            </div>
          </div>
        </aside>
      </section>

      <section className="relative py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs text-(--accent-color)">
              repo.signal.board
            </p>
            <h2 className="mt-2 text-3xl font-bold text-(--text-color)">
              Recently maintained repos
            </h2>
          </div>
          <p className="font-mono text-xs text-(--text-color) opacity-50">
            sorted by update recency
          </p>
        </div>

        {recentlyUpdated.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recentlyUpdated.map((repo) => (
              <article
                key={repo.id}
                className="group rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-lg transition-colors hover:border-(--accent-color)"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-(--text-color) transition-colors group-hover:text-(--accent-color)"
                    >
                      {repo.name}
                    </a>
                    <p className="mt-2 font-mono text-[11px] text-(--text-color) opacity-50">
                      pushed {formatDate(repo.pushed_at || repo.updated_at)}
                    </p>
                  </div>
                  {repo.language && (
                    <span className="rounded-md border border-(--explorer-border) px-2 py-1 font-mono text-[11px] text-(--accent-color)">
                      {repo.language}
                    </span>
                  )}
                </div>

                <p className="mt-4 line-clamp-3 min-h-18 text-sm leading-6 text-(--text-color) opacity-70">
                  {repo.description || "No description provided."}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-(--explorer-border) pt-4 font-mono text-xs text-(--text-color) opacity-65">
                  <span>{repo.stargazers_count} stars</span>
                  <span>{repo.forks_count} forks</span>
                  <span>open repo</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-6 text-center shadow-xl">
            <p className="font-mono text-sm text-(--text-color) opacity-70">
              Repository signals are unavailable. They will render when GitHub
              responds or credentials are configured.
            </p>
          </div>
        )}
      </section>

      {mostStarred.length > 0 && (
        <section className="relative py-10">
          <div className="rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-xl">
            <p className="font-mono text-xs text-(--accent-color)">
              credibility.top-repos
            </p>
            <h2 className="mt-2 text-2xl font-bold text-(--text-color)">
              Repository highlights
            </h2>
            <div className="mt-5 grid gap-3">
              {mostStarred.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid gap-3 rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-4 transition-colors hover:border-(--accent-color) md:grid-cols-[1fr_auto_auto]"
                >
                  <span className="font-semibold text-(--text-color)">
                    {repo.name}
                  </span>
                  <span className="font-mono text-xs text-(--text-color) opacity-60">
                    {repo.language || "mixed"}
                  </span>
                  <span className="font-mono text-xs text-(--accent-color)">
                    {repo.stargazers_count} stars
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
