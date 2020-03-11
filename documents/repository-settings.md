All repositories in `asyncapi` organizations should be similar in structure, settings, and restrictions. Follow these guidelines to adjust settings of a new repository created in one of these organizations.

## Adjust repository options

Under the repository name, choose the **Settings** tab. The **Options** view opens as the default one in the left menu.

1. Scroll down to the **Features** section and clear these options:
    - Wikis
    - Projects

Make sure **Sponsorships** option is selected and `open_collective: asyncapi` is provided.

2. Go to the **Merge button** section and clear these options:
    - Allow merge commits
    - Allow rebase merging

Leave only the **Allow squash merging** option selected. This option combines all commits into one before merging the changes into the `master` branch.

3. Make sure option **Automatically delete head branches** is selected

## Add basic GitHub Actions configurations

Create `.github/workflows` directory and the following configurations:

* Handling of stale issues and PRs should be stored in `stale-issues-prs.yml` file with the following content:
    ```
    name: Manage stale issues and PRs

    on:
      schedule:
      - cron: "0 0 * * *"

    jobs:
      stale:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/stale@v1.1.0
          with:
            repo-token: ${{ secrets.GITHUB_TOKEN }}
            stale-issue-message: |
              This issue has been automatically marked as stale because it has not had recent activity :sleeping:
              It will be closed in 30 days if no further activity occurs. To unstale this issue, add a comment with detailed explanation. 
              Thank you for your contributions :heart:
            stale-pr-message: |
              This pull request has been automatically marked as stale because it has not had recent activity :sleeping:
              It will be closed in 30 days if no further activity occurs. To unstale this pull request, add a comment with detailed explanation. 
              Thank you for your contributions :heart:
            days-before-stale: 60
            days-before-close: 30
            stale-issue-label: stale
            stale-pr-label: stale
            exempt-issue-label: keep-open
            exempt-pr-label: keep-open
    ```

* Welcome message for first-time contributors should be stored in `welcome-first-time-contrib.yml` file with the following content:
    ```
    name: Welcome first time contributors

    on:
      pull_request:
        types: 
        - opened
      issues:
        types:
        - opened

    jobs:
      welcome:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/first-interaction@v1.0.0
        with:
            repo-token: ${{ secrets.GITHUB_TOKEN }}
            issue-message: |
              Welcome to AsyncAPI. Thanks a lot for reporting your first issue.

              Keep in mind there are also other channels you can use to interact with AsyncAPI community. For more details check out [this issue](https://github.com/asyncapi/asyncapi/issues/115).
            pr-message: |
              Welcome to AsyncAPI. Thanks a lot for creating your first pull request.

              Keep in mind there are also other channels you can use to interact with AsyncAPI community. For more details check out [this issue](https://github.com/asyncapi/asyncapi/issues/115).
    ```
