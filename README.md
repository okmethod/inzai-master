# master-drill

Firebase Hosting で SPA を公開する。  

## ローカルでの起動方法

- コンテナ起動

  ```sh
  docker compose up
  ```

- ブラウザでアクセス

  http://localhost:5173/

## インターネットへの公開方法

- 静的アセットデプロイ

  ```sh
  (cd skeleton-app && npm run deploy)
  ```

- ブラウザでアクセス

  https://okmethod-master-drill.web.app/
