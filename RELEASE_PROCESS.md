# Release Process of the AsyncAPI Specification

This document is ment to explain the release process of the AsyncAPI specification. Goal of this document is to describe all details of the process so that any member of the community can jump in and help coordinating.

## Release coordinator

AsyncAPI specification release involves not only spec release but also the release of AsyncAPI-maintained tools, therefore it requires a single person called `release coordinator` that makes sure the release goes well through out all phases.

Release coordinator doesn't have to do all the work alone. Release coordinator needs to find the right people to do the work that is needed for a given phase and needs to engage as many people as needed.

## Release cadence

AsyncAPI releases happen on a regular basis in the following months:
- January
- April
- June
- September

Regular releases concern only major and minor releases. We do not decide upfront if next release is major or minor. This is a decision that depends on the proposals for changes in the specification and how much they affect specification and tooling in a given release cycle.

Patch releases are automatically released and published.

## Release phases

### Kick off

We start by creating release branches and placeholder for release notes in the AsyncAPI Blog.

#### Release branch

At the beginning of the release cycle, we need to have a new release branch created in some repositories. The reason is that [contribution guide](https://github.com/asyncapi/spec/blob/master/CONTRIBUTING.md) for the specification requires changes in different projects to get a proposal accepted. The following repositories are involved:
- [spec](https://github.com/asyncapi/spec) where contributor works with the specification file,
- [spec-json-schemas](https://github.com/asyncapi/spec-json-schemas) where contributor pushes changes to JSON Schema of the spec,
- [parser-js](https://github.com/asyncapi/parser-js) where contributor makes necessary changes in the JavaScript Parser.

Release branch must have a year and a month of the release as prefix: {YEAR_OF_RELEASE}-{MONTH_OF_RELEASE}-release. For example release created in September 2021 has a release branch called `2021-09-release`.

<img src="./assets/release_process/create_branch.png" alt="This image shows part of the GitHub UI that shows how you can create new branch using default branch as base." height="300">

#### Release notes



### Review and merge 

TODO: proposal phases, who reviews/accepts/merges, what are prerequisites for the merge, what happens after the merge. Remember about updating release notes on issue by issue case to not have it at the end of the release cycle. What about tooling updates? release candidates? After first merge we should already have draft PR to master opened in all required repos

### Ship it!

TODO: what needs to be done in json schema repo, what in parser repo. How to trigger release, when merge release notes, who to inform, social networks, communication, beer or wine!



