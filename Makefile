remove-build:
	-rm -rf dist

release-staging:
	-git branch -D staging
	git checkout -b staging
	git add -f dist
	git commit -m "Staging build"
	git push -f origin staging
	git checkout -
	git push
	git push --tags
