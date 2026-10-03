# Releasing

Pushing a `v*` tag runs [release.yml](../.github/workflows/release.yml). It
builds the tag with `gtkx deploy`, signs it, and publishes it in two places:

- a Flatpak repository on GitHub Pages, at `https://tduarte.github.io/cafe/`,
  which is what installs update from;
- the `.flatpak` bundle on the GitHub release for the tag.

The site is rebuilt whole on every release and holds one commit per ref, so it
does not grow.

## One-time setup

### Signing key

Clients trust the repository through a GPG key whose public half is embedded in
`cafe.flatpakref`. Use a key made for this and nothing else. It has no
passphrase because CI has nobody to type one. The user id is published with the
key, so it names the project rather than a person.

```bash
export GNUPGHOME="$(mktemp -d)"
gpg --batch --passphrase '' --quick-generate-key \
    "Cafe releases (https://github.com/tduarte/cafe)" ed25519 sign never
gpg --armor --export-secret-keys > cafe-signing-key.asc
gh secret set FLATPAK_GPG_PRIVATE_KEY --repo tduarte/cafe < cafe-signing-key.asc
```

Store `cafe-signing-key.asc` somewhere offline, then delete the local copy and
the temporary `GNUPGHOME`. If the key is lost, the next release has to be signed
with a new one, and every existing install must remove and re-add the remote to
keep updating.

### GitHub Pages

Set the Pages source to GitHub Actions, under Settings → Pages, or:

```bash
gh api -X POST repos/tduarte/cafe/pages -f build_type=workflow
```

The `github-pages` environment that this creates only accepts deployments from
the default branch, and a release deploys from a tag. Under Settings →
Environments → github-pages → Deployment branches and tags, add a tag rule for
`v*`, or:

```bash
gh api -X POST repos/tduarte/cafe/environments/github-pages/deployment-branch-policies \
    -f name='v*' -f type=tag
```

Without the rule the `pages` job fails with "Tag "v…" is not allowed to deploy
to github-pages due to environment protection rules".

## Cutting a release

1. Set `version` in `package.json`. `gtkx deploy` names the release after it,
   and the workflow refuses a tag that does not match. Optionally add a
   `releases` entry to the `deploy` block in `gtkx.config.ts`, which becomes the
   release notes in the AppStream metainfo that GNOME Software shows.
2. Merge to `main` and let CI finish.
3. Tag and push:

   ```bash
   git tag -a v1.0.0 -m "Cafe 1.0.0"
   git push origin v1.0.0
   ```

If the GitHub release for the tag already exists, the bundle is added to it.
Otherwise one is created with generated notes.

## Publishing a tag again

```bash
gh workflow run release.yml --repo tduarte/cafe --ref main -f tag=v1.0.0
```

This checks out and builds the tag, using that tag's own source, scripts and
config. A fix to the workflow file itself takes effect from the branch the run
is started from.

## Checking a release

```bash
flatpak remote-ls --user cafe
flatpak update --user io.github.tduarte.cafe
```

On a machine that has never had it:

```bash
flatpak install --user https://tduarte.github.io/cafe/cafe.flatpakref
```

## Testing the publishing step locally

[publish-repo.sh](../build-aux/publish-repo.sh) is the part of the workflow that
turns the repo `gtkx deploy` leaves behind into the signed site, and runs
anywhere. With a throwaway key in a temporary `GNUPGHOME`:

```bash
pnpm build:flatpak
build-aux/publish-repo.sh build/targets/flatpak/repo site http://localhost:8765 $KEY
python3 -m http.server 8765 --directory site
```

Install from it into a scratch Flatpak directory, leaving the real one alone:

```bash
FLATPAK_USER_DIR=/tmp/fp-test flatpak --user install --no-deps \
    http://localhost:8765/cafe.flatpakref
```
