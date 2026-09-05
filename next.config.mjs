import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const isGithubPages = process.env.GITHUB_ACTIONS === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const repoOwner = process.env.GITHUB_REPOSITORY?.split('/')[0];
const isUserOrOrgPage = repoName?.endsWith('.github.io');
const basePath = isGithubPages && repoName && !isUserOrOrgPage ? `/${repoName}` : '';
const defaultSiteUrl =
  isGithubPages && repoOwner ? `https://${repoOwner}.github.io${basePath}` : 'http://localhost:3000';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  basePath,
  env: {
    DEFAULT_SITE_URL: defaultSiteUrl,
  },
};

export default withMDX(config);
