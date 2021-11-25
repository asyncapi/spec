# Release Process of the AsyncAPI Specification

This document is meant to explain the release process of the AsyncAPI specification. This document aims to describe all details of the process so that any member of the community can jump in and help coordinate.

## Release coordinator

AsyncAPI specification release involves not only spec release but also the release of AsyncAPI-maintained tools. Therefore it requires a single person called `release coordinator` to ensure the release goes well throughout all phases.

The release coordinator doesn't have to do all the work alone. The release coordinator needs to find the right people to do the work required for a given phase and engage as many people as needed.

## Release cadence

AsyncAPI releases happen regularly in the following months:
- January
- April
- June
- September

Regular releases concern only major and minor releases. We do not decide up front if the next release is major or minor. This decision depends on the proposals for changes in the specification and how much they affect specification and tooling in a given release cycle.

Patch releases are automatically released and published.

## Release phases

### Kick off

We start by creating release branches and a placeholder for release notes in the AsyncAPI Blog.

#### Release branch

At the beginning of the release cycle, we need to have a new release branch created in some repositories. The reason is that [contribution guide](CONTRIBUTING.md) for the specification requires changes in different projects to accept a proposal. The following repositories are involved:
- [spec](https://github.com/asyncapi/spec) where contributor works with the specification file,
- [spec-json-schemas](https://github.com/asyncapi/spec-json-schemas) where contributor pushes changes to JSON Schema of the spec,
- [parser-js](https://github.com/asyncapi/parser-js) where contributor makes necessary changes in the JavaScript Parser.

Release branch must have a year and a month of the release as prefix: {YEAR_OF_RELEASE}-{MONTH_OF_RELEASE}-release. For example, a release created in September 2021 has a `2021-09-release` release branch.

<img src="./assets/release_process/create_branch.png" alt="This image shows part of the GitHub UI that shows how you can create a new branch using default branch as a base." height="300">

Once feature branches are created, there must be some initial configuration done in each repository.

Things to do in release branch as `chore: ` changes:
- `spec` - Make sure all the official examples located in the repository use the new version of the specification,
- `spec-json-schemas` - Duplicate newest definition folder (such as `./definitions/2.2.0`) and rename it to the new version. Then generate the bundled version of the schema by running `npm run generate:assets`, and expose it here [here](https://github.com/asyncapi/spec-json-schemas/blob/master/index.js),
- `parser-js` - Make sure the list of supported AsyncAPI schema MIME types is extended with the new version [here](https://github.com/asyncapi/parser-js/blob/master/lib/asyncapiSchemaFormatParser.js#L43.)

Things to do in default branch and release branch as `chore: ` changes:
- Set release branch name in prerelease configuration in some repos repositories:
  - [package.json in parser-js](https://github.com/asyncapi/parser-js/blob/master/package.json#L90)
  - [package.json in spec-json-schemas](https://github.com/asyncapi/spec-json-schemas/blob/master/package.json#L49) 
  - [.releaserc in spec](https://github.com/asyncapi/spec/blob/master/.releaserc#L4)
#### Release notes

Changes in the specification need to be well described. We need clear information on what has changed, why, and who contributed to the change. A regular changelog is not enough as it is not user-friendly. Every release must have release notes.

A draft pull request with release notes must be opened at the same time release branches are created. Work on release notes should be done on a feature-by-feature basis and not at the end of the release cycle. Cooperate with contributors. They should be able to provide input and also be allowed to work as release notes article co-authors.

In other words, once a feature is introduced in the release branch, make sure it is properly described in release notes.

The draft pull request must be opened against the [Website](https://github.com/asyncapi/website/) repository. Make sure the option `Allow edits and access to secrets by maintainers` is selected to enable support from maintainers.

<img src="./assets/release_process/draft_pr.png" alt="This image shows example pull request created in GitHub with release notes for AsyncAPI specification" height="300">

### Review and merge 

There are no step-by-step instructions to follow but a set of rules.

#### Review

- Everybody is invited to perform a review of proposals. The [contribution guide](CONTRIBUTING.md) describes all requirements proposal needs to fulfill to reach `Stage 3: Accepted`,
- Pull request must be:
  - labeled as an accepted proposal,
  - created against the feature branch,
  - created in all repositories specified in contribution guide,
- At least one user listed in [CODEOWNERS](CODEOWNERS) must approve the pull request in all related repositories.

#### Merge

- Merge can be done only by repository [CODEOWNERS](CODEOWNERS),
- Every pull request must have a `feat: ` prefix that, after the merge, produces a release candidate with a minor version update. The major version must have `feat!: ` prefix,
- Pull request in the `parser-js` can be merged only if it uses the release candidate of `@asyncapi/specs` package produced after merge of a pull request in `spec-json-schemas`,
- First, changes are merged into the `spec` repository, then `spec-json-schemas` and then in `parser-js`.

### Next steps

- Update previously created draft of release notes with information about the new feature. Collaborate closely with feature contributors,
- Notify maintainers of the following repositories that the first feature is merged and that release will be produced and therefore they need to start preparing for it:
  - [JavaScript Converter](https://github.com/asyncapi/converter-js/)
  - [Playground](https://github.com/asyncapi/playground/)
  - [React component](https://github.com/asyncapi/asyncapi-react/)
  - [Markdown template](https://github.com/asyncapi/markdown-template)

### Steps only after first feature merge

- Open draft pull requests in all repositories required by the contribution guide. They should point from the release branch in the upstream to the master branch in the upstream,
- Update documentation in [website](https://github.com/asyncapi/website) to promote latest version of the specification. You can do it in the same pull request with release notes. No need to care for the specification markdown file on the Website. It updates automatically during work on release candidates and also after the final release.

#### Communication

Every release of the release candidate is automatically published on the AsyncAPI Twitter account and in the releases-dedicated Slack channel. Feel free to use other communication channels. Make sure that as many people as possible know about the change. Feel free to contact vendors upfront or other people that are interested in changes in the specification.

### Ship it!

The release is scheduled for a given month, not a specific day. You do not have to wait until the last day of the month with the release. We release often, so it can be released in June if the change will not make it in April. Most important is the quality and not quantity of the features. The quality feature means it is properly delivered in as many tools as possible with very good documentation and examples.

- Release means merge of pull requests created from a release branch against the master branch. First, changes are merged into the `spec` repository, then `spec-json-schemas` and at the end in `parser-js`. Like in the case of the merge of release candidates, a pull request in `parser-js` can be merged only if it uses the final release of the new `@asyncapi/specs` package.
- Make sure other maintainers from other projects under the AsyncAPI GitHub organization released their packages
- Merge release notes and once they are published, link them under the GitHub release for the specification, like [here](https://github.com/asyncapi/spec/releases/tag/v2.1.0).
- Make sure proper communication is sent from all the official AsyncAPI social accounts and on Slack

Now relax as the next release is right behind the corner :smiley:
