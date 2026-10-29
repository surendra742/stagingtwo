// Publish the built site to the `gh-pages` branch (served by GitHub Pages).
//   npm run deploy
// Builds into dist/, then force-pushes dist/ as a single commit to origin/gh-pages.
import { execSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';

const run = (cmd, cwd = '.') => execSync(cmd, { cwd, stdio: 'inherit' });
const remote = execSync('git remote get-url origin').toString().trim();
const sha = execSync('git rev-parse --short HEAD').toString().trim();

run('node build.mjs');
writeFileSync('dist/.nojekyll', ''); // serve files as-is, no Jekyll processing
rmSync('dist/.git', { recursive: true, force: true });
run('git init -q -b gh-pages', 'dist');
run('git add -A', 'dist');
run(`git commit -q -m "Deploy ${sha}"`, 'dist');
run(`git push -f ${remote} gh-pages`, 'dist');
rmSync('dist/.git', { recursive: true, force: true });

const [, user, repo] = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/) || [];
console.log(`\n✓ Deployed ${sha} → https://${user}.github.io/${repo}/`);
