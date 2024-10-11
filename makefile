deploy-app:
	cd skeleton-app && npm run build
	firebase deploy --only hosting

deploy:
	make deploy-app
