# Contributing to AsyncAPI
We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the specification
- Submitting a fix
- Proposing new features

## Summary of the contribution flow

The following is a summary of the ideal contribution flow. Please, note that Pull Requests can also be rejected by the maintainers when appropriate.

```
    ┌───────────────────────┐
    │                       │
    │    Open an issue      │
    │  (a bug report or a   │
    │   feature request)    │
    │                       │
    └───────────────────────┘
               ⇩
    ┌───────────────────────┐
    │                       │
    │  Open a Pull Request  │
    │   (only after issue   │
    │     is approved)      │
    │                       │
    └───────────────────────┘
               ⇩
    ┌───────────────────────┐
    │                       │
    │   Your changes will   │
    │     be merged and     │
    │ published on the next │
    │        release        │
    │                       │
    └───────────────────────┘
```

## Code of Conduct
AsyncAPI has adopted a Code of Conduct that we expect project participants to adhere to. Please [read the full text](./CODE_OF_CONDUCT.md) so that you can understand what sort of behaviour is expected.

## Our Development Process
We use Github to host code, to track issues and feature requests, as well as accept pull requests.

## Issues
[Open an issue](https://github.com/asyncapi/asyncapi/issues/new) **only** if you want to report a bug or a feature. Don't open issues for questions or support, instead join our [Slack workspace](https://www.asyncapi.com/slack-invite) and ask there. It's more likely you'll get help, and much faster!

## Bug Reports
**Great Bug Reports** tend to have:

- A quick summary and/or background.
- Steps to reproduce:
  - Be specific!
  - Give sample document if you can.
- What you expected would happen.
- What actually happens.
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work.)

People **love** thorough bug reports.

## Feature Requests
**Great Feature Requests** tend to have:

- A quick summary and/or background.
- Why you think this should be part of the specification instead of providing the same value as a vendor extension.
- Provide one or more sample documents demonstrating how it would look like if implemented. Don't worry about the quality of the proposal at this point, this is just to make it easier for everyone to understand what you're asking for.
- Notes (something else you want to tell us.)

## Issue Triage
Here are some tags that we're using to better organize issues in this repo:

* `good first issue` - Good candidates for someone new to the project to contribute.
* `help wanted` - Issues that should be addressed and which we would welcome a
PR for but may need significant investigation or work.
* `backlog` - The issue has been taken into account but maintainers decided not to implement it yet.
PR for but may need significant investigation or work.
* `documentation` - Relating to improving documentation for the project.
* `bug` - The issue is a bug report.
* `feature request` - Issue asking for a specific feature that's currently missing. **Please, note that applying this label to an issue doesn't mean it's gonna be implemented**.
* `investigate further` - The issue requires further investigation. This might be related to the complexity and/or risk of implementing it.
* `vX.X.X` - The issue will be released in this version. E.g., `v2.0.0` means the issue will be part of AsyncAPI 2.0.0.

## Pull Requests
**Please, make sure you open an issue before starting with a Pull Request, unless it's a typo or a really obvious error.** Pull requests are the best way to propose changes to the specification (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've updated the specification, update the [schema](./schema/asyncapi.json) too, and vice-versa.
3. Ensure the test suite passes (run `npm test`).
4. Issue that pull request!

## License
When you submit changes, your submissions are understood to be under the same [Apache 2.0 License](https://github.com/asyncapi/asyncapi/blob/master/LICENSE) that covers the project. Feel free to [contact the maintainers](https://www.asyncapi.com/slack-invite) if that's a concern.

## References
This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/master/CONTRIBUTING.md).