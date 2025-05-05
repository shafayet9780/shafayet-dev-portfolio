import Image from "next/image";

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

interface GitHubUser {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
}

async function getData() {
  try {
    const username = process.env.GITHUB_USERNAME || "shafayet9780";
    let user: GitHubUser;
    let repos: GitHubRepo[] = [];
    
    try {
      // Fetch user data
      const userRes = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : '',
        },
        next: { revalidate: 3600 } // Revalidate every hour
      });
      
      if (!userRes.ok) {
        console.error(`GitHub API returned ${userRes.status} for user data`);
        throw new Error(`GitHub API error: ${userRes.statusText}`);
      }
      
      user = await userRes.json();
    } catch (error) {
      console.error("Error fetching GitHub user:", error);
      // Provide fallback user data
      user = {
        login: username,
        avatar_url: "/placeholder-avatar.png",
        public_repos: 0,
        followers: 0
      };
    }
    
    try {
      // Fetch repositories
      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        {
          headers: {
            Authorization: process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : '',
          },
          next: { revalidate: 3600 }
        }
      );
      
      if (!repoRes.ok) {
        console.error(`GitHub API returned ${repoRes.status} for repos data`);
        throw new Error(`GitHub API error: ${repoRes.statusText}`);
      }
      
      const reposData = await repoRes.json();
      
      // Ensure repos is an array before sorting
      if (Array.isArray(reposData)) {
        repos = reposData
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);
      } else {
        console.error("GitHub API did not return an array of repositories:", reposData);
        repos = [];
      }
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
      repos = [];
    }
    
    return { user, repos };
  } catch (error) {
    console.error("Error in getData function:", error);
    // Return fallback data
    return { 
      user: {
        login: "github-user",
        avatar_url: "/placeholder-avatar.png",
        public_repos: 0,
        followers: 0
      }, 
      repos: [] 
    };
  }
}

export default async function GitHubPage() {
  const { user, repos } = await getData();
  
  return (
    <div className="py-4">
      <h1 className="text-4xl font-bold mb-8">GitHub</h1>
      
      <div className="bg-[--article-bg] p-4 rounded-md flex flex-wrap items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Image
            src={user?.avatar_url || "/placeholder-avatar.png"}
            alt={user?.login || "GitHub User"}
            width={50}
            height={50}
            className="rounded-full mr-4"
          />
          <h3 className="text-xl font-semibold">{user?.login}</h3>
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <h3 className="text-xl font-semibold">{user?.public_repos || 0} repos</h3>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user?.followers || 0} followers</h3>
          </div>
        </div>
      </div>
      
      {repos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.map((repo) => (
            <div key={repo.id} className="bg-[--article-bg] p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-2">
                <a 
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[--accent-color] hover:underline"
                >
                  {repo.name}
                </a>
              </h3>
              <p className="text-sm mb-4 opacity-80">{repo.description || "No description provided."}</p>
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                    {repo.stargazers_count}
                  </span>
                  <span className="text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 16 16">
                      <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                    </svg>
                    {repo.forks_count}
                  </span>
                </div>
                {repo.language && (
                  <span className="text-sm px-2 py-1 bg-[--explorer-hover-bg] rounded-md">
                    {repo.language}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[--article-bg] p-6 rounded-md text-center">
          <p>No repositories found or GitHub API rate limit exceeded.</p>
          <p className="mt-2 text-sm opacity-80">
            Try again later or make sure your GitHub username and token are correctly configured.
          </p>
        </div>
      )}
    </div>
  );
}
