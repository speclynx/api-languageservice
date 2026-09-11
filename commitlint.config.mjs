/*
Assistant session locators identify a private working session and do not belong in a public
history. The rule lives here rather than in the CI workflow because .husky/commit-msg runs
`commitlint -e`: this refuses the commit as it is written, before anything is pushed. The
lint-commit-messages job runs the same commitlint over every commit in a pull request, so one
definition covers the local hook and the branch that bypassed it with --no-verify.

Amending a pushed commit is not a clean remedy — the pre-amend object stays fetchable by SHA —
so the only effective place to catch this is before the commit exists.
 */
const assistantSessionMetadata =
  /claude-session:|claude\.ai\/\S*session|co-authored-by:\s*claude|generated with\s+.?claude/i;

export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'no-assistant-session-metadata': ({ raw }) => [
          !assistantSessionMetadata.test(raw ?? ''),
          'commit message must not name an assistant session',
        ],
      },
    },
  ],
  rules: {
    'header-max-length': [2, 'always', 69],
    'scope-case': [
      2,
      'always',
      [
        'camel-case',
        'kebab-case',
        'upper-case',
        'lower-case',
        'pascal-case',
        'sentence-case',
        'snake-case',
        'start-case',
      ],
    ],
    'subject-case': [0, 'always'],
    'no-assistant-session-metadata': [2, 'always'],
  },
};
