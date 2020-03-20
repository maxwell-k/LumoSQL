DISPLAY= :0
ENGINE = podman
IMAGE = cypress/base:12.16.0

cache = --env=CYPRESS_CACHE_FOLDER="/srv/.ci/cypress_cache"
directory = -v "$(PWD):/srv:Z" -w /srv
timeout = --env=WAIT_ON_TIMEOUT=5000


run = $(ENGINE) run --rm $(directory)
base_path = $$( \
	$(run) $(IMAGE) -p 'require("./src/configuration.js").BASE_PATH' )

.PHONY: browse check clean copy cypress-open serve

browse:
	firefox --private-window http://127.0.0.1:3000/$(base_path)

check:
	$(run) $(cache) $(timeout) $(IMAGE) .ci/check.sh

clean:
	rm -rf __sapper__ coverage src/node_modules cypress/screenshots

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

cypress-open:
	$(run) -it \
		--net=host \
		--ipc=host \
		--volume=/tmp/.X11-unix:/tmp/.X11-unix \
		--env=DISPLAY=$(DISPLAY) \
		$(cache) \
		$(IMAGE) \
		yarn run cypress open

dev:
	$(run) --env=COLLECTION -it --net=host $(IMAGE) yarn run sapper dev

export:
	$(run) --env=COLLECTION=production $(IMAGE) \
		yarn run sapper export --basepath $(base_path)

publish:
	.ci/publish.sh $(base_path)

# Serve exported assets
# Use Python's http.server because it is likely already installed and
# clear has no connection to the JavaScript ecosystem.
serve:
	python3 -m http.server --directory __sapper__/export
