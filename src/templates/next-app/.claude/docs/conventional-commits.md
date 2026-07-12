# Conventional Commits 1.0.0 (Official Spec)

> Source: https://www.conventionalcommits.org/en/v1.0.0/
> Saved locally so the skill can reference the full spec without needing network access.

## Summary

The Conventional Commits specification is a lightweight convention on top of
commit messages. It provides an easy set of rules for creating an explicit
commit history, making it easier to write automated tools on top of it. This
convention dovetails with SemVer by describing the features, fixes, and
breaking changes made in commit messages.

The commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Structural elements, to communicate intent to consumers of your library:

- `fix:` a commit of the type `fix` patches a bug in your codebase
  (correlates with **PATCH** in Semantic Versioning).
- `feat:` a commit of the type `feat` introduces a new feature to the
  codebase (correlates with **MINOR** in Semantic Versioning).
- `BREAKING CHANGE:` a commit that has a footer `BREAKING CHANGE:`, or
  appends a `!` after the type/scope, introduces a breaking API change
  (correlates with **MAJOR** in Semantic Versioning). A BREAKING CHANGE can
  be part of commits of any type.
- Types other than `fix:` and `feat:` are allowed, e.g.
  `@commitlint/config-conventional` (based on the Angular convention)
  recommends `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`,
  `perf:`, `test:`, and others.
- Footers other than `BREAKING CHANGE: <description>` may be provided and
  follow a convention similar to git trailer format.

A scope MAY be provided to a commit's type to give additional contextual
information, contained within parenthesis, e.g.
`feat(parser): add ability to parse arrays`.

## Examples

**Commit message with description and breaking change footer**
```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

**Commit message with `!` to draw attention to breaking change**
```
feat!: send an email to the customer when a product is shipped
```

**Commit message with scope and `!`**
```
feat(api)!: send an email to the customer when a product is shipped
```

**Commit message with both `!` and BREAKING CHANGE footer**
```
feat!: drop support for Node 6

BREAKING CHANGE: use JavaScript features not available in Node 6.
```

**Commit message with no body**
```
docs: correct spelling of CHANGELOG
```

**Commit message with scope**
```
feat(lang): add Polish language
```

**Commit message with multi-paragraph body and multiple footers**
```
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from latest request.

Remove timeouts which were used to mitigate the racing issue but are
obsolete now.

Reviewed-by: Z
Refs: #123
```

## Specification (RFC 2119 keywords apply)

1. Commits MUST be prefixed with a type (noun: `feat`, `fix`, etc.),
   followed by an OPTIONAL scope, OPTIONAL `!`, and REQUIRED terminal
   colon and space.
2. The type `feat` MUST be used when a commit adds a new feature.
3. The type `fix` MUST be used when a commit represents a bug fix.
4. A scope MAY be provided after a type, as a noun in parenthesis, e.g.
   `fix(parser):`.
5. A description MUST immediately follow the colon and space after the
   type/scope prefix, e.g.
   `fix: array parsing issue when multiple spaces were contained in string`.
6. A longer commit body MAY be provided, one blank line after the
   description, giving additional context.
7. The body is free-form and MAY consist of multiple newline-separated
   paragraphs.
8. One or more footers MAY be provided, one blank line after the body.
   Each footer MUST consist of a word token, followed by `: ` or ` #`,
   followed by a string value (inspired by git trailer convention).
9. A footer token MUST use `-` in place of whitespace (e.g. `Acked-by`),
   except for `BREAKING CHANGE`.
10. Breaking changes MUST be indicated either in the type/scope prefix
    (`!`) or as a footer entry.
11. If in the footer, it MUST be the uppercase text `BREAKING CHANGE:`
    followed by a description.
12. If indicated via `!`, `BREAKING CHANGE:` in the footer MAY be omitted,
    and the description SHALL describe the breaking change.
13. Types other than `feat`/`fix` MAY be used, e.g. `docs: update ref docs`.
14. Units of information MUST NOT be treated as case-sensitive, except
    `BREAKING CHANGE`, which MUST be uppercase.
15. `BREAKING-CHANGE` MUST be synonymous with `BREAKING CHANGE` as a
    footer token.

## Why use Conventional Commits

- Automatically generating CHANGELOGs.
- Automatically determining a semantic version bump.
- Communicating the nature of changes to teammates and stakeholders.
- Triggering build and publish processes.
- Making it easier for people to contribute, via a structured history.

## FAQ (selected)

- **Revert commits:** the spec doesn't define exact revert behavior. A
  common convention: use the `revert` type with a footer referencing the
  reverted commit SHAs, e.g.
  ```
  revert: let us never again speak of the noodle incident

  Refs: 676104e, a215868
  ```
- **Multiple unrelated changes in one commit:** split into multiple commits
  whenever possible — that's part of the value of the convention.
- **Wrong type used:** fix via `git rebase -i` before merge/release; after
  release it depends on your tooling.