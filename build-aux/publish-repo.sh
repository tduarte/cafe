#!/usr/bin/env bash
# Turn the OSTree repo that `gtkx deploy --target flatpak` leaves behind into a
# static site that Flatpak can install and update from: the signed repo itself,
# a .flatpakref for the app, a .flatpakrepo for the remote, and a landing page.
#
# gtkx deploy does not sign anything here, so this signs the app commit, then
# the summary and the appstream branch, all with the same key, and embeds the
# public half in the two descriptor files, which is how a client comes to trust
# the remote.
#
# From-scratch static deltas are generated because a first install otherwise
# fetches every object as its own HTTP request, which is slow on a static host.
#
# The secret key is looked up in GNUPGHOME, or ~/.gnupg when that is unset.
#
# Usage: build-aux/publish-repo.sh <repo-dir> <site-dir> <base-url> <key-fingerprint>
set -euo pipefail

repo="$1"
site="$2"
url="${3%/}"
key="$4"

app=io.github.tduarte.cafe
branch=stable
homepage=https://github.com/tduarte/cafe
summary="Coffee beans and water ratio calculator"
here="$(dirname "$0")"
root="$here/.."

gpg_home=()
if [ -n "${GNUPGHOME:-}" ]; then
  gpg_home=(--gpg-homedir="$GNUPGHOME")
fi

if ! ostree refs --repo="$repo" | grep -qx "app/$app/[^/]*/$branch"; then
  echo "publish-repo: $repo has no app/$app/*/$branch ref" >&2
  exit 1
fi

flatpak build-sign "$repo" "$app" "$branch" --gpg-sign="$key" "${gpg_home[@]}"

flatpak build-update-repo "$repo" \
  --title=Cafe --comment="$summary" --homepage="$homepage" \
  --default-branch="$branch" \
  --gpg-sign="$key" "${gpg_home[@]}" \
  --generate-static-deltas --prune

rm -rf "$site"
mkdir -p "$site"
cp -a "$repo" "$site/repo"

pubkey="$(gpg --batch --export "$key" | base64 -w0)"
if [ -z "$pubkey" ]; then
  echo "publish-repo: no public key found for $key" >&2
  exit 1
fi

cat > "$site/cafe.flatpakref" <<REF
[Flatpak Ref]
Title=Cafe
Name=$app
Branch=$branch
Url=$url/repo
SuggestRemoteName=cafe
Homepage=$homepage
Comment=$summary
IsRuntime=false
RuntimeRepo=https://dl.flathub.org/repo/flathub.flatpakrepo
GPGKey=$pubkey
REF

cat > "$site/cafe.flatpakrepo" <<REPO
[Flatpak Repo]
Title=Cafe
Url=$url/repo
Homepage=$homepage
Comment=$summary
DefaultBranch=$branch
GPGKey=$pubkey
REPO

sed "s|@URL@|$url|g" "$here/pages/index.html" > "$site/index.html"
cp "$root/data/icons/hicolor/scalable/apps/$app.svg" "$site/icon.svg"
cp "$root/assets/Screenshot.png" "$site/screenshot.png"

echo "publish-repo: wrote $site for $url"
