DISPLAY= :0
ENGINE = podman
IMAGE = cypress/base:12.16.0

cache = --env=CYPRESS_CACHE_FOLDER="/srv/.ci/cypress_cache"
directory = -v "$(PWD):/srv:Z" -w /srv
timeout = --env=WAIT_ON_TIMEOUT=5000

.PHONY: check copy clean

cypress-open:
	$(ENGINE) run -it --rm \
		--net host \
		--ipc host \
		--volume=/tmp/.X11-unix:/tmp/.X11-unix \
		--env=DISPLAY=$(DISPLAY) \
		$(cache) \
		$(directory) \
		$(IMAGE) \
		yarn run cypress open

check:
	$(ENGINE) run $(cache) $(directory) $(timeout) $(IMAGE) .ci/checks.sh

browse:
	firefox --private-window http://127.0.0.1:3000/benchmarking-preview

copy:
	test -d "$(WORKDIR)"  # WORKDIR should be set and exist as a directory
	test -n "$(NAME)" # validate NAME
	test -d "static/production/$(NAME)" || \
	mkdir "static/production/$(NAME)"
	find "$(WORKDIR)" -name metadata.json \
	-exec cp {} "static/production/$(NAME)" \;
	find "$(WORKDIR)" -mindepth 1 -maxdepth 1 -type d | \
	while read i; do echo "static/production/$(NAME)/$${i##*/}"; done | \
	while read i; do test -d "$$i" || mkdir "$$i"; done
	find "$(WORKDIR)" -mindepth 2 -maxdepth 2 -name '*.html' | \
	while read i; do \
	cp "$$i" "static/production/$(NAME)/$${i##$(WORKDIR)/}"; done

clean:
	rm -rf __sapper__ coverage src/node_modules cypress/screenshots

# Serve exported assets
# Use Python's http.server because it is likely already installed and
# clear has no connection to the JavaScript ecosystem.
serve:
	python3 -m http.server --directory __sapper__/export
