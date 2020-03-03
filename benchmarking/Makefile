ENGINE = podman
IMAGE = cypress/base:12.16.0  # should match ../.github/workflows/benchmarking.yaml

.PHONY: check

check:
	$(ENGINE) run -v "$(PWD):/srv:Z" -w /srv $(IMAGE) .ci/checks.sh
