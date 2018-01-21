remove-build:
	-rm -rf dist

release-staging:
	-git branch -D staging
	git checkout -b staging
	git push -f origin staging
	git checkout -
	git push
	git push --tags
