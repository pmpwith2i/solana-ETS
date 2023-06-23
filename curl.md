curl --request POST \
  --url https://api.tatum.io/v3/custodial/wallet \
  --header 'content-type: application/json' \
  --header 'x-api-key: 06c0c717-2471-4f93-a0a4-e00cbd73359d' \
  --data '{"chain":"SOL"}'

  {"walletId":"34b2da69-4b1c-4124-9470-b795a03dd882","address":"H9omU2N37X7VUyRnZAjspCz1ZjpKszVJRi1iJsea1JCU","chain":"SOL"}

  curl -i -X GET \
  'https://api.tatum.io/v3/solana/account/balance/H9omU2N37X7VUyRnZAjspCz1ZjpKszVJRi1iJsea1JCU' \
  -H 'x-api-key: 06c0c717-2471-4f93-a0a4-e00cbd73359d'

