const getAllRepositoriesForUser = `
  SELECT r.name, r.url
  FROM users u
  JOIN github_profiles p ON u.user_id = p.user_id
  JOIN github_repos r ON p.profile_id = r.profile_id
  WHERE u.username = ?;
`;

const getAllCommitsForRepository = `
  SELECT c.sha, c.message, c.date
  FROM github_repos r
  JOIN github_commits c ON r.repo_id = c.repo_id
  WHERE r.name = ?;
`;

const getUserGitHubProfileInfo = `
  SELECT p.username, p.bio, p.num_repos, p.followers, p.following
  FROM users u
  JOIN github_profiles p ON u.user_id = p.user_id
  WHERE u.username = ?;
`;

module.exports = {
  getAllRepositoriesForUser,
  getAllCommitsForRepository,
  getUserGitHubProfileInfo,
};
