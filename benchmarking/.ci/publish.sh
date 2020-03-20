# Usage: .ci/publish.sh base_path
#
# Commit and push the sapper export to the default branch of the base_path
# repository under the same user

if [ -z "$1" ]; then
	echo "base_path must be the first argument" &&  exit 1
fi
if [ -z "$GITHUB_REPOSITORY" ]; then
	echo "GITHUB_REPOSITORY must be set" && exit 1
fi

base_path="$1" &&
if [ ! -d "./$base_path" ]; then
	git clone "git@github.com:${GITHUB_REPOSITORY%%/*}/$base_path.git"
fi &&
cd "$base_path" &&
git --work-tree="../__sapper__/export/$base_path/" add . &&
git checkout . &&
git commit -m "$(git -C .. log -1 --format=%h) make publish" &&
git push
