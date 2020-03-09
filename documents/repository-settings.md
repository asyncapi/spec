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