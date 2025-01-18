const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
  };
const schemaName = process.env.SCHEMA_NAME;

const users = `
CREATE TABLE IF NOT EXISTS users (
  user_id char(36) NOT NULL PRIMARY KEY,
  google_id char(36),
  first_name varchar(50) NOT NULL,
  last_name varchar(50),
  email varchar(100) UNIQUE,
  username varchar(50) NOT NULL UNIQUE,
  password varchar(100),
  github_username varchar(100),
  leetcode_username varchar(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const posts = `
CREATE TABLE IF NOT EXISTS posts (
  post_id char(36) NOT NULL PRIMARY KEY,
  user_id char(36) NOT NULL,
  title TEXT,
  duration TIMESTAMP,
  chartData TEXT,
  public BOOLEAN,
  medals TEXT,
  posted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key (user_id) references users(user_id)
);
`;

const sessions = `
CREATE TABLE IF NOT EXISTS sessions (
  session_id char(36) NOT NULL PRIMARY KEY,
  user_id char(36) NOT NULL,
  post_id char(36) NOT NULL,
  start TIMESTAMP,
  end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key (user_id) references users(user_id),
  foreign key (post_id) references posts(post_id)
);
`;

const github_profiles = `
CREATE TABLE IF NOT EXISTS github_profiles (
  profile_id char(36) NOT NULL PRIMARY KEY,
  github_id INT NOT NULL UNIQUE,
  user_id char(36) NOT NULL,
  username varchar(100) NOT NULL,
  name varchar(100),
  url TEXT,
  bio TEXT,
  num_repos INT,
  followers INT,
  following INT,
  account_created TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key (user_id) references users(user_id)
);
`;

const github_repos = `
CREATE TABLE IF NOT EXISTS github_repos (
  repo_id char(36) NOT NULL PRIMARY KEY,
  profile_id char(36) NOT NULL,
  name varchar(100) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key (profile_id) references github_profiles(profile_id)
);
`;

const github_commits = `
CREATE TABLE IF NOT EXISTS github_commits (
  commit_id char(36) NOT NULL PRIMARY KEY,
  repo_id char(36) NOT NULL,
  sha char(64) NOT NULL,
  url TEXT NOT NULL,
  message TEXT,
  date TIMESTAMP,
  comitter_username varchar(100),
  committer_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key (repo_id) references github_repos(repo_id)
);
`;

const leetcode_profiles = `
CREATE TABLE IF NOT EXISTS leetcode_profiles (
  profile_id char(36) NOT NULL PRIMARY KEY,
  user_id char(36) NOT NULL,
  username varchar(100) NOT NULL,
  name varchar(100),
  url TEXT,
  bio TEXT,
  user_rank INT,
  company char(36),
  school char(36),
  badges TEXT,
  websites TEXT,
  skills TEXT,
  rep INT,
  view_count INT,
  active_years TEXT,
  streak INT,
  active_days INT,
  solution_count INT,
  total_submitted INT,
  total_accepted INT,
  easy_submitted INT,
  easy_accepted INT,
  medium_submitted INT,
  medium_accepted INT,
  hard_submitted INT,
  hard_accepted INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key (user_id) references users(user_id)
);
`;

const leetcode_submissions = `
CREATE TABLE IF NOT EXISTS leetcode_submissions (
  submissions_id char(36) NOT NULL PRIMARY KEY,
  profile_id char(36) NOT NULL,
  problem TEXT,
  status TEXT,
  language TEXT,
  difficulty TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key (profile_id) references leetcode_profiles(profile_id)
);
`;

const leetcode_languages = `
CREATE TABLE IF NOT EXISTS leetcode_languages (
  language_id char(36) NOT NULL PRIMARY KEY,
  profile_id char(36) NOT NULL,
  name TEXT,
  solved INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key (profile_id) references leetcode_profiles(profile_id)
);
`;

const leetcode_solutions = `
CREATE TABLE IF NOT EXISTS leetcode_solutions (
  solution_id char(36) NOT NULL PRIMARY KEY,
  profile_id char(36) NOT NULL,
  name TEXT,
  url TEXT,
  views INT,
  question TEXT,
  upvotes INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key (profile_id) references leetcode_profiles(profile_id)
);
`;

const other_activities = `
CREATE TABLE IF NOT EXISTS other_activities (
  activity_id char(36) NOT NULL PRIMARY KEY,
  name TEXT,
  type char(36) NOT NULL,
  description TEXT,
  public BOOLEAN,
  upvotes INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const user_activities = `
CREATE TABLE IF NOT EXISTS user_activities (
  user_activity_id char(36) NOT NULL PRIMARY KEY,
  activity_id char(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key (activity_id) references other_activities(activity_id)
);
`;

const intervals = `
CREATE TABLE IF NOT EXISTS intervals (
  interval_id char(36) NOT NULL PRIMARY KEY,
  session_id char(36) NOT NULL,
  start TIMESTAMP,
  end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key (session_id) references sessions(session_id)
);
`;

const intervalActivity = `
CREATE TABLE IF NOT EXISTS intervalActivity (
  interval_activity_id char(36) NOT NULL PRIMARY KEY,
  interval_id char(36) NOT NULL,
  commit_id char(36),
  solution_id char(36),
  activity_id char(36),
  submission_id char(36),
  start TIMESTAMP,
  end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foreign key (interval_id) references intervals(interval_id),
  foreign key (activity_id) references other_activities(activity_id)
);
`;





async function setupDatabase() {
  try {

    console.log(`attempting connection to database...`)
    const connection = await mysql.createConnection(dbConfig);
    console.log(`success`);

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${schemaName}\`;`);
    console.log(`'${schemaName}' db created`);

    await connection.changeUser({ database: schemaName });

    // GENERAL SECTION
    console.log(`creating users table`)
    await connection.query(users);
    console.log('users table created');

    console.log(`creating posts table`)
    await connection.query(posts);
    console.log('posts table created');

    console.log(`creating sessions table`)
    await connection.query(sessions);
    console.log('sessions table created');

    // GITHUB SECTION
    console.log(`creating github_profiles table`)
    await connection.query(github_profiles);
    console.log('github_profiles table created');

    console.log(`creating github_repos table`)
    await connection.query(github_repos);
    console.log('github_repos table created');

    console.log(`creating github_commits table`)
    await connection.query(github_commits);
    console.log('github_commits table created');

    // LEETCODE SECTION
    console.log(`creating leetcode_profiles table`)
    await connection.query(leetcode_profiles);
    console.log('leetcode_profiles table created');

    console.log(`creating leetcode_submissions table`)
    await connection.query(leetcode_submissions);
    console.log('leetcode_submissions table created');

    console.log(`creating leetcode_languages table`)
    await connection.query(leetcode_languages);
    console.log('leetcode_languages table created');

    console.log(`creating leetcode_solutions table`)
    await connection.query(leetcode_solutions);
    console.log('leetcode_solutions table created');

    // MISC

    console.log(`creating other_activities table`)
    await connection.query(other_activities);
    console.log('other_activities table created');

    console.log(`creating user_activities table`)
    await connection.query(user_activities);
    console.log('user_activities table created');

    console.log(`creating intervals table`)
    await connection.query(intervals);
    console.log('intervals table created');

    console.log(`creating intervalActivity table`)
    await connection.query(intervalActivity);
    console.log('intervalActivity table created');

    await connection.end();
    console.log('db initialized, exiting.');
  } catch (error) {
    console.error('error initializing database:', error.message);
  }
}

setupDatabase();
