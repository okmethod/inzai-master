deploy-app:
	cd skeleton-app && npm run build
	firebase deploy --only hosting

deploy-firestore:
    firebase deploy --only firestore:rules

deploy:
	make deploy-app
	make deploy-firestore
