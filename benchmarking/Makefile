ENGINE = podman
IMAGE = cypress/base:12.16.0  # should match ../.github/workflows/benchmarking.yaml

.PHONY: check copy

check:
	$(ENGINE) run -v "$(PWD):/srv:Z" -w /srv $(IMAGE) .ci/checks.sh

copy:
	test -d "$(SRC)"  # SRC should be set and exist as a directory
	test -n "$(NAME)" # validate NAME
	test -d "static/data/$(NAME)" || mkdir "static/data/$(NAME)"
	find "$(SRC)" -name metadata.json -exec cp {} "static/data/$(NAME)/" \;
	find "$(SRC)" -mindepth 1 -maxdepth 1 -type d | \
	while read i; do echo "static/data/$(NAME)/$${i##*/}"; done | \
	while read i; do test -d "$$i" || mkdir "$$i"; done
	find "$(SRC)" -mindepth 2 -maxdepth 2 -name '*.html' | \
	while read i; do cp "$$i" "static/data/$(NAME)/$${i##$(SRC)/}"; done
