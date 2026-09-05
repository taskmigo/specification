export const appName = 'Taskmigo';
export const docsRoute = '/';
export const docsImageRoute = '/og';
export const docsContentRoute = '/llms.mdx';

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: 'taskmigo',
  repo: 'specification',
  branch: 'next',
};

export function withBasePath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
}
