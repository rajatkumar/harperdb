#
# Directories
#
ROOT_SLASH	:= $(dir $(realpath $(firstword $(MAKEFILE_LIST))))
ROOT		:= $(patsubst %/,%,$(ROOT_SLASH))
TEST		:= $(ROOT)/test
TOOLS		:= $(ROOT)/tools
GITHOOKS_SRC	:= $(TOOLS)/githooks
GITHOOKS_DEST	:= $(ROOT)/.git/hooks


#
# Generated Directories
#
NODE_MODULES	:= $(ROOT)/node_modules
NODE_BIN	:= $(NODE_MODULES)/.bin
COVERAGE	:= $(ROOT)/coverage


#
# Tools and binaries
#
NPM		:= npm
NPX		:= $(NODE_BIN)/NPX
ESLINT		:= $(NODE_BIN)/eslint
MOCHA		:= $(NODE_BIN)/mocha
_MOCHA		:= $(NODE_BIN)/_mocha
ISTANBUL	:= $(NODE_BIN)/istanbul
NSP		:= $(NODE_BIN)/nsp
COVERALLS	:= $(NODE_BIN)/coveralls
NSP_BADGE	:= $(TOOLS)/nspBadge.js
CHANGELOG	:= $(TOOLS)/changelog.js
PKG-LOCK    := $(ROOT)/package-lock.json


#
# Files and globs
#
PACKAGE_JSON	:= $(ROOT)/package.json
SHRINKWRAP	:= $(ROOT)/npm-shrinkwrap.json
GITHOOKS	:= $(wildcard $(GITHOOKS_SRC)/*)
TEST_ENTRY	:= $(ROOT)/test/index.js
LCOV		:= $(COVERAGE)/lcov.info
ALL_FILES	:= $(shell find $(ROOT) \
			-not \( -path $(NODE_MODULES) -prune \) \
			-not \( -path $(COVERAGE) -prune \) \
			-name '*.js' -type f)
TEST_FILES	:= $(shell find $(TEST) -name '*.js' -type f)

#
# Targets
#

$(NODE_MODULES): $(PACKAGE_JSON) ## Install node_modules
	@$(NPM) install
	@touch $(NODE_MODULES)


.PHONY: help
help:
	@perl -nle'print $& if m{^[a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) \
		| sort | awk 'BEGIN {FS = ":.*?## "}; \
		{printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


.PHONY: githooks
githooks: $(GITHOOKS) ## Symlink githooks
	@$(foreach hook,\
		$(GITHOOKS),\
		ln -sf $(hook) $(GITHOOKS_DEST)/$(hook##*/);\
	)


.PHONY: changelog
changelog: $(NODE_MODULES) $(CHANGELOG) ## Run changelog
	@$(CHANGELOG) generate


## .PHONY: release
##release: $(NODE_MODULES) $(CHANGELOG) ## Create a release
##	@$(CHANGELOG) release


.PHONY: lint
lint: $(NODE_MODULES) $(ESLINT) $(ALL_FILES) ## Run lint checker (eslint).
	@$(ESLINT) $(ALL_FILES)

.PHONY: pretty
pretty: $(NODE_MODULES) $(NPX) $(ALL_FILES) ## Run prettier on your code (eslint).
	@$(NPX) prettier --write $(ALL_FILES)

.PHONY: lint-fix
lint-fix: $(NODE_MODULES) pretty $(ESLINT) $(ALL_FILES) ## Run lint with prettier and auto fixing (eslint).
	@$(ESLINT) $(ALL_FILES) --fix

.PHONY: nsp
nsp: $(NODE_MODULES) $(NSP) $(NSP_BADGE) ## Run nsp. Shrinkwraps dependencies, checks for vulnerabilities.
ifeq ($(wildcard $(SHRINKWRAP)),)
	@$(NPM) shrinkwrap --dev
	@($(NSP) check) | $(NSP_BADGE)
	@rm $(SHRINKWRAP)
else
	@($(NSP) check) | $(NSP_BADGE)
endif

.PHONY: prepush
prepush: $(NODE_MODULES) pretty lint coverage nsp ## Git pre-push hook task. Run before committing and pushing.


.PHONY: test
test: $(NODE_MODULES) $(MOCHA) ## Run unit tests.
	@$(MOCHA) -R spec --full-trace --no-exit --no-timeouts $(TEST_ENTRY)


.PHONY: coverage
coverage: $(NODE_MODULES) $(ISTANBUL) $(_MOCHA) $(COVERAGE_BADGE) ## Run unit tests with coverage reporting. Generates reports into /coverage.
	@$(ISTANBUL) cover $(_MOCHA) --report lcovonly -- -R spec $(TEST_FILES)

.PHONY: coverage-html
coverage-html: $(NODE_MODULES) $(ISTANBUL) $(_MOCHA) $(COVERAGE_BADGE) ## Run unit tests with coverage reporting in html. Generates reports into /coverage.
	@$(ISTANBUL) cover $(_MOCHA) --report html -- -R spec $(TEST_FILES)


.PHONY: report-coverage ## Report unit test coverage to coveralls
report-coverage: coverage
	@cat $(LCOV) | $(COVERALLS)

.PHONY: first-release
first-release: $(NODE_MODULES) $(NPX) ## Generate the changelog for the first release
	$(NPX) standard-version -- --first-release

.PHONY: release
release: $(NODE_MODULES) $(NPX) ##  Generate version and changelog for release
	$(NPX) standard-version

.PHONY: pre-release-%
pre-release-%: $(NODE_MODULES) $(NPX) ## Generate version and changelog for a pre release
	$(NPX) standard-version -- --prerelease $*

.PHONY: release-as-%
release-as-%: $(NODE_MODULES) $(NPX) ## Generate version and changelog for a targetted version
	$(NPX) standard-version -- --release-as $*

.PHONY: clean
clean: ## Cleans unit test coverage files and node_modules.
	@rm -rf $(NODE_MODULES)
	@rm -rf $(COVERAGE)
	@rm $(PKG-LOCK)


#
## Debug -- print out a a variable via `make print-FOO`
#
print-%  : ; @echo $* = $($*)
