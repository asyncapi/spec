This document is the best practice guide that contains the rules to follow when working with AsyncAPI repositories.

### Basic rules

Each contributor and maintainer in AsyncAPI must follow this workflow:

* Work on forked repositories.
* Create branches on the fork and avoid working directly on the `master` branch.

## Prepare the fork

A fork is a copy of the repository from which you raise pull requests to propose changes to the original repository.
The unified AsyncAPI contribution workflow that bases on forks allows both the members of the AsyncAPI organization and the external contributors to contribute code and content through the same process. This keeps the main repositories branches clean as contributors create branches only on the forked repositories.

## Configure your fork

The document refers to the original repository as the upstream repository and to the forked repository as the origin repository. We assume you already have a fork of the upstream and you `git clone` it already.

### Working on a Fork on local

> If you perform such configuration for the first time, it is recommended to do it manually to understand all the steps. Next time you do it you can write a script for it or use something like [this](https://gist.github.com/derberg/87319e9c486e4a6c9bef5b629ab0d386)

Configure a `remote` repository that points to the upstream repository. This allows you to synchronize changes you make on the fork with the original repository.

In the terminal, navigate to the location of your fork and perform the following steps:

1.  Run the `git remote -v` command to list the current configured remote repository for your fork.
The result is as follows:
    ```
    origin  https://github.com/{your-username}/{your-fork}.git (fetch)
    origin  https://github.com/{your-username}/{your-fork}.git (push)
    ```
    See the example:
    ```
    origin	https://github.com/i000000/asyncapi.git (fetch)
    origin	https://github.com/i000000/asyncapi.git (push)
    ```

2. Specify a new remote upstream repository to synchronize with the fork:
    ```
    git remote add upstream https://github.com/{original-owner}/{original-repository}.git
    ```
    See the example:
    ```
    git remote add upstream https://github.com/asyncapi/asyncapi.git
    ```
3. Run the `git fetch upstream master` command to fetch all branches.
4. Set up the local `master` branch to track the remote `master` branch from the upstream repository:
    ```
    git branch -u upstream/master master
    ```

Now, each time you rebase or check out the `master` branch, you refer to the `master` branch of the upstream repository. In other words, when you create a branch from local up-to-date `master` means creating a branch from latest upstream `master`.

To verify that your local `master` branch points to the `upstream/master`, run the `git branch -vv` command. The result is similar to the following:
```
* master           c2226e0 [upstream/master] Update the README.md document
```

### Working on a Fork in GitHub UI

In case you are a contributor who suggests minor changes using GitHub UI, it is recommended to use a [Pull bot](https://probot.github.io/apps/pull). This bot keeps your fork up to date by creating and merging a pull request with latest changes into the `master `branch of your fork.

## Start Contributing

After you set up your fork, start contributing code and content.

Follow these steps:

1. Create a branch on your fork.

2. Commit changes. Always provide clear commit messages to track commit changes easier.

3. Push the changes to the remote forked repository.

    >**NOTE:** Before you push local changes, make sure you are on the branch you are currently working on. Do not push any changes from the `master` branch.

    If you push local changes from the terminal to your remote fork for the first time, use this command:
    ```
    git push -u origin {branch-name}
    ```
    Use the `git push` command to push any further commits made on your local branch to a remote repository.  

4. Create a pull request from the branch of your forked repository to the `master` branch of the upstream repository and wait for the maintainers' review.
