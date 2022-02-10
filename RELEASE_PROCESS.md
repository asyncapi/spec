# Release Process of the AsyncAPI Specification

This document is meant to explain the release process of the AsyncAPI specification. It aims to describe all details of the process so that any member of the community can jump in and help coordinate.

It covers:
- **[Who?](#who)** - who is responsible for doing what in a release
- **[When?](#when)** - when releases happen
- **[What?](#what)** - what is covered by this document
- **[How?](#how)** - a description of the steps needed for a release

---
## Who?

### "Release coordinator"

AsyncAPI specification release involves not only spec release but also the release of AsyncAPI-maintained tools. Therefore it requires a single person called `release coordinator` to ensure the release goes well throughout all phases. The release coordinator is responsible for working through the process described below.

The release coordinator doesn't have to do all the work alone. The release coordinator needs to find the right people to do the work required for a given phase and engage as many people as needed.

Each release can have a different release coordinator. If you are interested and would like to know more, [join our Slack workspace](https://www.asyncapi.com/slack-invite) and visit the `11_how-to-contribute` channel.

### Code owners

Many of the steps needed to release a new version of the AsyncAPI specification (e.g. merging, creating branches, creating releases) need support from administrators for individual github.com/asyncapi repositories.

Each respository contains a `CODEOWNERS` file (e.g. https://github.com/asyncapi/parser-js/blob/master/CODEOWNERS) that identifies the people who can help.

---
## When?

### Release cadence

AsyncAPI releases happen regularly in the following months:
- January
- April
- June
- September

Regular releases concern only major and minor releases. We do not decide up front if the next release is major or minor. This decision depends on the proposals for changes in the specification and how much they affect specification and tooling in a given release cycle.

Patch releases are automatically released and published.

### Release date philosophy

The release is scheduled for a given month, not a specific day. We will release once everything is ready, and won't wait until the last day of the month with the release.

We release often, so anything that isn't ready can wait until the next release (e.g. it can be released in June if the change will not make it in April). Our priority is the quality, and not quantity, of the features. Quality means that changes for a release is properly delivered in as many tools as possible with very good documentation and examples.

---
## What?

### Repositories

Github repositories that need to be updated at the same time to enable a release, in a coordinated way, are:
- [spec](https://github.com/asyncapi/spec) - the specification file
- [spec-json-schemas](https://github.com/asyncapi/spec-json-schemas) - the JSON schema
- [parser-js](https://github.com/asyncapi/parser-js) - the JavaScript parser
- [website](https://github.com/asyncapi/website) - the website

---
## How?

The steps described here are not intended to be strictly chronological. For a single release, it might make sense to start some pieces of work in a slightly different order. The intention of the steps here is meant to give release coordinators a rough idea of the sequence involved.

### Step 1 - kick off call

A nice way to start a new release is to do one or more of the initial steps on an open live call/meeting.

This isn't a required step, but possible benefits include:
- raising awareness of the upcoming release
- giving a new release coordinator support and initial direction to help them get started
- allowing potential future release coordinators to see what is involved

Examples of arranging a contribution call like this can be found in the [community repository](https://github.com/asyncapi/community/issues?q=is%3Aissue+label%3Ameeting+contributor-first+)


### Step 2 - create a release issue

To allow the community to see what is currently being considered for inclusion in a release, and to give easy, at-a-glance visibility over the progress, create a new Github issue in the [spec](https://github.com/asyncapi/spec) repository.

This issue should be updated as each of the following steps are completed.

A [template for a new release issue](https://github.com/asyncapi/spec/blob/master/.github/ISSUE_TEMPLATE/release.md) is available.

An example is the [release issue for the 2.3.0](https://github.com/asyncapi/spec/issues/675) release.

### Step 3 - create release branches

Release branches must have a year and a month of the release as prefix: {YEAR_OF_RELEASE}-{MONTH_OF_RELEASE}-release.

For example, a release created in September 2021 has a `2021-09-release` release branch.

<img src="./assets/release_process/create_branch.png" alt="This image shows part of the GitHub UI that shows how you can create a new branch using default branch as a base." height="300">

At the beginning of the release cycle, we need to have a new release branch created in the following repositories:
- [spec](https://github.com/asyncapi/spec) where contributor works with the specification file,
- [spec-json-schemas](https://github.com/asyncapi/spec-json-schemas) where contributor pushes changes to JSON Schema of the spec,
- [parser-js](https://github.com/asyncapi/parser-js) where contributor makes necessary changes in the JavaScript Parser.

The [release coordinator](#%22release-coordinator%22) should decide what the branch name needs to be, and contact the [code owners](#code-owners) for each repository to ask them to create the branches for them.


### Step 4 - update release branches

Once [release branches are created](#step-3---create-release-branches), there are some initial changes that need to be made.

The process for doing this is the same for each of these:
- the [release coordinator](#%22release-coordinator%22) should create a fork of the relevant repository for these changes
- the commit message for the change should start with `chore:`
- the change should be contributed in a pull request targeting the [release branch](#step-3---create-release-branches)
- the [release coordinator](#%22release-coordinator%22) will need to ask the [code owners](#code-owners) for the relevant repository to approve and merge this pull request

#### Update version numbers in official examples
Repository: [spec](https://github.com/asyncapi/spec)

Examples are located in the `examples/` folder in the [spec](https://github.com/asyncapi/spec) repository. They should all be updated to the new version number.

An example of doing this is:
- this [commit from the 2.3.0 release](https://github.com/dalelane/spec/commit/8c521539cd875470ea8e89cf3ab7ffd81be64788)
- this [pull request from the 2.3.0 release](https://github.com/asyncapi/spec/pull/676)

#### Create a new JSON schema file for the new version
Repository: [spec-json-schemas](https://github.com/asyncapi/spec-json-schemas)

The new file should be created in the `schemas/` folder in the [spec-json-schemas](https://github.com/asyncapi/spec-json-schemas) repository.

It should be named with the version of the new release, and a link should be added to the `index.js` file (in the same repository).

An example of doing this is:
- this [commit from the 2.3.0 release](https://github.com/dalelane/spec-json-schemas/commit/9cff7798ac42f609927e1cb9e532ff16d360ab99)
- this [pull request from the 2.3.0 release](https://github.com/asyncapi/spec-json-schemas/pull/139)

#### Update the list of AsyncAPI schema MIME types with the new version
Repository: [parser-js](https://github.com/asyncapi/parser-js)

The file to be updated is `lib/asyncapiSchemaFormatParser.js` in the [parser-js](https://github.com/asyncapi/parser-js) repository.

The new version number should be added to the list in the `getMimeTypes` function.

An example of doing this is:
- this [pull request from the 2.3.0 release](https://github.com/asyncapi/parser-js/pull/426)


### Step 5 - update default branches

Once [release branches have been updated](#step-4---update-release-branches), the default (e.g. "master") branches should be updated to identify the new release branch.

The process for doing this is the same for each of these:
- the [release coordinator](#%22release-coordinator%22) should create a fork of the relevant repository for these changes (_this can be the same fork as used for updating the release branches_)
- the commit message for the change should start with `chore:`
- the change should be contributed in a pull request targeting the **default branch** (normally `master`)
- the [release coordinator](#%22release-coordinator%22) will need to ask the [code owners](#code-owners) for the relevant repository to approve and merge this pull request

#### Update package.json files
There are **two** repositories where `package.json` files need to be updated. In both repositories, the release branch name needs to be updated in the list of branches under `.release.branches`.

- [parser-js](https://github.com/asyncapi/parser-js/blob/master/package.json#L90-L93)
- [spec-json-schemas](https://github.com/asyncapi/spec-json-schemas/blob/master/package.json#L48-L51)

Examples of doing this are:
- this [commit from the 2.3.0 release for parser-js](https://github.com/dalelane/parser-js/commit/1d9f9ed52718269ffbce4d32bd4635c690371f80)
- this [commit from the 2.3.0 release for spec-json-schemas](https://github.com/dalelane/spec-json-schemas/commit/8a4b94aaf86240a6ca2aeb7ce3cc515bad283a2d)


#### Update .releaserc file
The release branch name needs to be updated in the `.releaserc` file in the [spec](https://github.com/asyncapi/spec) repository needs.

An example of doing this is:
- this [commit from the 2.3.0 release](https://github.com/dalelane/spec/commit/210f89adc74f17aaf09d808b84132f232ff2e412)


### Step 6 - prepare announcement blog post

Each new release is announced by a blog post. You can see all of these at https://www.asyncapi.com/blog?tags=Release+Notes

The [release coordinator](#%22release-coordinator%22) should create an empty placeholder blog post that can be added to by different contributors to the release throughout the release process.

The steps to follow for this are:
- Create a fork of the [website](https://github.com/asyncapi/website) repository
- Create a new file at `pages/blog/release-notes-X.X.X.md` (replacing `X.X.X` with the version number for the release)
- Add a standard header at the top of the file (see the release notes for [2.2.0](https://raw.githubusercontent.com/asyncapi/website/master/pages/blog/release-notes-2.2.0.md) and [2.3.0](https://raw.githubusercontent.com/asyncapi/website/master/pages/blog/release-notes-2.3.0.md) for examples)
- Add a (webp format) cover image to the `public/img/posts/release-notes-X.X.X/` folder, and update the `cover` attribute of the blog post header with it. (**Make sure to attribute the image correctly** - unsplash.com is a good source of free images for this). See [this commit from the 2.3.0 release](4050ca0540684f5188300e0c27efc713a6ba1ec2) for an example of doing this.
- Add a (webp format) profile picture of the release coordinator to the `public/img/avatars` folder, and update the `authors` attribute of the blog post header with it. See [this commit from the 2.3.0 release](https://github.com/asyncapi/website/pull/512/commits/006f7df26b0d0803ed2e1dd6b8004dfdaec15617) for an example of doing this.
- Open a **draft** pull request against the [website](https://github.com/asyncapi/website/) repository. Make sure the option **Allow edits and access to secrets by maintainers** is selected to enable support from maintainers.
<img src="./assets/release_process/draft_pr.png" alt="This image shows example pull request created in GitHub with release notes for AsyncAPI specification" height="300">

An example of doing this is:
- this [pull request from the 2.3.0 release](https://github.com/asyncapi/website/pull/512)

### Step 7 - bring updates into release branch

seek out possible updates that are viable candidates for the release

look through open pull requests in the three core repos

pull requests from feature branches into release branch(es)

- Everybody is invited to perform a review of proposals. The [contribution guide](CONTRIBUTING.md) describes all requirements proposal needs to fulfill to reach `Stage 3: Accepted`,
- Pull request must be:
  - labeled as an accepted proposal,
  - created against the feature branch,
  - created in all repositories specified in contribution guide,


### Step 8 - update announcement blog post

Update previously created draft of release notes with information about the new feature. Collaborate closely with feature contributors,


Changes in the specification need to be well described. We need clear information on what has changed, why, and who contributed to the change. A regular changelog is not enough as it is not user-friendly. Every release must have release notes.

A draft pull request with release notes must be opened at the same time release branches are created. Work on release notes should be done on a feature-by-feature basis and not at the end of the release cycle. Cooperate with contributors. They should be able to provide input and also be allowed to work as release notes article co-authors.

In other words, once a feature is introduced in the release branch, make sure it is properly described in release notes.



### Step 9 - prepare release notes

markdown version for releases in git

### Step 10 - notify people the release is coming

meetings
slack

### Step 11 - reviews

- Open draft pull requests in all repositories required by the contribution guide. They should point from the release branch in the upstream to the master branch in the upstream,

- At least one user listed in [CODEOWNERS](CODEOWNERS) must approve the pull request in all related repositories.


### Step 12 - release candidates

_how is this done?_

### Step 13 - merge the release branches

- Merge can be done only by repository [CODEOWNERS](CODEOWNERS),
- Every pull request must have a `feat: ` prefix that, after the merge, produces a release candidate with a minor version update. The major version must have `feat!: ` prefix,
- Pull request in the `parser-js` can be merged only if it uses the release candidate of `@asyncapi/specs` package produced after merge of a pull request in `spec-json-schemas`,
- First, changes are merged into the `spec` repository, then `spec-json-schemas` and then in `parser-js`.

- Release means merge of pull requests created from a release branch against the master branch. First, changes are merged into the `spec` repository, then `spec-json-schemas` and at the end in `parser-js`. Like in the case of the merge of release candidates, a pull request in `parser-js` can be merged only if it uses the final release of the new `@asyncapi/specs` package.

### Step 14 - publish releases


- Merge release notes and once they are published, link them under the GitHub release for the specification, like [here](https://github.com/asyncapi/spec/releases/tag/v2.1.0).


### Step 15 - update website

- Update documentation in [website](https://github.com/asyncapi/website) to promote latest version of the specification. You can do it in the same pull request with release notes. No need to care for the specification markdown file on the Website. It updates automatically during work on release candidates and also after the final release.


### Step 16 - notify tool maintainers


- Notify maintainers of the following repositories that the first feature is merged and that release will be produced and therefore they need to start preparing for it:
  - [JavaScript Converter](https://github.com/asyncapi/converter-js/)
  - [Playground](https://github.com/asyncapi/playground/)
  - [React component](https://github.com/asyncapi/asyncapi-react/)
  - [Markdown template](https://github.com/asyncapi/markdown-template)

- Make sure other maintainers from other projects under the AsyncAPI GitHub organization released their packages


### Step 17 - notify the community

Every release of the release candidate is automatically published on the AsyncAPI Twitter account and in the releases-dedicated Slack channel. Feel free to use other communication channels. Make sure that as many people as possible know about the change. Feel free to contact vendors upfront or other people that are interested in changes in the specification.

- Make sure proper communication is sent from all the official AsyncAPI social accounts and on Slack


### Step 18 - improve the release process

update this doc, and the release issue template
