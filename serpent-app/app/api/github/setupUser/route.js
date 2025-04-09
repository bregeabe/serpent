import { existsSync } from 'fs';
import { upsertGithubRepo, doesGithubRepoExist, getRepoIdFromName, upsertGithubProfile, doesGithubProfileExist, upsertGithubCommit, doesGithubCommitExist } from '../../../../db/utils/github/handle-saving';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return new Response(JSON.stringify({ error: 'Username is required' }), { status: 400 });
    }

    const token = process.env.GITHUB_API_TOKEN;

    try {
        const profileUrl = `https://api.github.com/users/${username}`;
        const profileResponse = await fetch(profileUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${token}`,
            },
        });

        if (!profileResponse.ok) {
            return new Response(JSON.stringify({ error: 'Error fetching profile' }), { status: profileResponse.status });
        }

        const profileData = await profileResponse.json();
        const existingProfileId = await doesGithubProfileExist(profileData.id);
        const profileId = existingProfileId || uuidv4();

        const userProfile = {
            profile_id: profileId,
            github_id: profileData.id,
            user_id: process.env.USER_ID,
            username: profileData.login,
            name: profileData.name || null,
            url: profileData.html_url,
            bio: profileData.bio || null,
            num_repos: profileData.public_repos || 0,
            followers: profileData.followers || 0,
            following: profileData.following || 0,
            account_created: profileData.created_at
                ? new Date(profileData.created_at).toISOString().slice(0, 19).replace("T", " ")
                : null,
        };

        await upsertGithubProfile(userProfile);

        const reposUrl = `https://api.github.com/users/${username}/repos`;
        const reposResponse = await fetch(reposUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${token}`,
            },
        });

        if (!reposResponse.ok) {
            return new Response(JSON.stringify({ error: 'Error fetching repos' }), { status: reposResponse.status });
        }

        const repos = await reposResponse.json();
        const repoDataList = await Promise.all(repos.map(async (repo) => {
            const existingRepoId = await doesGithubRepoExist(repo.name);

            return {
                repo_id: existingRepoId || uuidv4(),
                profile_id: profileId,
                name: repo.name,
                url: repo.html_url,
            };
        }));

        for (const repoData of repoDataList) {
            await upsertGithubRepo(repoData);
        }

        for (const repo of repos) {
            const repoId = await getRepoIdFromName(repo.name);
            if (!repoId) continue;

            const commitsUrl = `https://api.github.com/repos/${username}/${repo.name}/commits`;
            const commitsResponse = await fetch(commitsUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${token}`,
                },
            });

            if (!commitsResponse.ok) {
                console.warn(`Warning: Error fetching commits for ${repo.name}`);
                continue;
            }

            const commits = await commitsResponse.json();
            const commitDataList = await Promise.all(commits.map(async (commit) => {
                const commitSha = commit.sha;
                const existingCommit = await doesGithubCommitExist(commitSha);

                if (existingCommit) {
                    return null;
                }

                return {
                    commit_id: existingCommit,
                    repo_id: repoId,
                    sha: commit.sha,
                    url: commit.html_url,
                    message: commit.commit.message || null,
                    date: commit.commit.author.date
                        ? new Date(commit.commit.author.date).toISOString().slice(0, 19).replace("T", " ")
                        : null,
                    committer_username: commit.commit.committer?.name || null,
                    committer_id: commit.committer?.id || null,
                };
            }));

            const validCommitDataList = commitDataList.filter((c) => c !== null);
            for (const commitData of validCommitDataList) {
                await upsertGithubCommit(commitData);
            }
        }

        return new Response(JSON.stringify({ success: true, profileId, repoCount: repoDataList.length, commitsInserted: 'Completed' }), { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
