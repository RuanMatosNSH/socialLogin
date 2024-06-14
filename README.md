<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Descrição
SSE (Server Side Extensions) responsável pelo login social, parte de autenticação do OCC (Oracle Commerce Cloud). Implementa funcionalidade de SSO (Single sign-on - login único) em protocolo SAML, baseado em projeto de Giovanni Luro.


## Requisitos
- node 14.20.1

## Instalação
### Desenvolvimento
```bash
$ npm install
```

### Produção
Instalar somente dependências necessárias e remover dependências providas pela Oracle, express e winston.
```bash
$ npm run deploy:prod
```

## Executar serviço
```bash
# modo de produção
$ npm run build
$ npm run start

# modo de desenvolvimento
$ npm run start:dev
```

## Endpoints
| Método | Caminho                             | Descrição                                                                                       |
| ------ | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| GET    | /v1/single-sign-on/healthcheck      | verificar a saúde do serviço, mensagem 'ok'                                                     |
| GET*   | /v1/single-sign-on/idp-descriptor   | retorna retorna descritor do identity provider (IdP), paramento 'encode' para retorno em base64 |
| POST   | /v1/single-sign-on/login/micaffenio | realizar processo de autenticação social micaffenio                                             |

*endpoints que exigem autenticação básica


## Acesso aos logs
As utimas linhas de registro
```bash
curl --location --request GET 'https://p7716487c1dev-admin.occa.ocs.oraclecloud.com/ccadminx/custom/v1/logs/tail?loggingLevel=info' \
--header 'Authorization: Bearer <TOKEN>
```

Todos os logs compactado em formato zip
```bash
curl --location --request GET 'https://p7716487c1dev-admin.occa.ocs.oraclecloud.com/ccadminx/custom/v1/logs' \
--header 'Authorization: Bearer <TOKEN>
```

Mais detalhes
https://docs.oracle.com/en/cloud/saas/cx-commerce/22c/cxocc/api-admin-extension-server-extension-server-tail-logs.html
https://docs.oracle.com/en/cloud/saas/cx-commerce/21b/cxocc/api-admin-extension-server-logs.html


## Como configurar a aplicação

### Obter os descritores do Service Provider (SP)
```bash
# ADMIN
$ curl --location --request GET 'https://p7716487c1dev-admin.occa.ocs.oraclecloud.com/ccadmin/v1/merchant/samlSettings' --header 'Authorization: Bearer <TOKEN>'
# STORE
$ curl --location --request GET 'https://dev.caffenio.com/ccstore/v1/merchant/samlSettings?encode=true'
# STORE
$ curl --location --request GET 'https://p7716487c1dev-store.occa.ocs.oraclecloud.com/ccstore/v1/merchant/samlSettings?encode=true' \
--header 'Authorization: Basic <AUTH>'
```
### Gerar par de chaves privada e publica
```base
$ openssl genrsa -passout pass:foobar -out privateKey.pem 4096
$ openssl req -new -x509 -key privateKey.pem -out publicKey.cer -days 3650
```

### Configurar SSO keys
Na pasta 'config' do projeto adicionar as chaves, idp para as chaves privada e publica e sp os descritores do Service Provider.<br>
Obs. para os descritores do Service Provider deve decodificar de base64 para xml e nome do arquivo se refere a identificação do site.
```bash
config/
├── idp
│   ├── privateKey.pem
│   └── publicKey.cer
└── sp
    ├── dev.caffenio.com.xml
    ├── p7716487c1dev-admin.occa.ocs.oraclecloud.com.xml
    └── p7716487c1dev-store.occa.ocs.oraclecloud.com.xml
```


### Habilitar autenticação SAML
```
$ curl --location --request PUT 'https://p7716487c1dev-admin.occa.ocs.oraclecloud.com/ccadmin/v1/merchant/samlSettings' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <TOKEN>' \
  --data-raw '{
    "enabled": true,
    "nameIdPolicyFormat": "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
    "requireEncryptedAssertions": false,
    "requireSignedResponse": true,
    "signAuthnRequest": true,
    "nameIdPolicyAllowCreate": true
  }'
```

### Obter descritor do identity provider (IdP)
```
$ curl --location --request GET 'https://p7716487c1dev-store.occa.ocs.oraclecloud.com/ccstorex/custom/v1/single-sign-on/idp-descriptor?encode=true' \
  --header 'Authorization: Basic <AUTH>'
```

### Subir descritor do identity provider (IdP)
```
$ curl --location --request PUT 'https://p7716487c1dev-admin.occa.ocs.oraclecloud.com/ccadmin/v1/samlIdentityProviders/default' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <TOKEN>' \
  --data-raw '{
      "loginAttributeName": "email",
      "emailAttributeName": "email",
      "encodedIdpMetadata": "<IDP_BASE64>",
      "requiredAttributeToPropertyMap": {
          "email": "email"
      },
      "optionalAttributeToPropertyMap": {
          "firstName": "firstName",
          "lastName": "lastName",
          "dateOfBirth": "dateOfBirth",
          "x_phone_number": "x_phone_number",
          "x_occupation": "x_occupation",
          "x_id_mi_caffenio": "x_id_mi_caffenio"
      }
  }'
```


## Validar autenticação
### Obter descritor de autenticação
obs. descritor em campo 'context' em base64
```bash
curl --location --request POST 'https://p7716487c1dev-store.occa.ocs.oraclecloud.com/ccstorex/custom/v1/single-sign-on/login/micaffenio' \
--header 'referer: https://dev.caffenio.com' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "admin",
    "password": "1234"
}'
```

### Realizar login com descritor de autenticação
```bash
curl --location --request POST 'https://dev.caffenio.com/ccstoreui/v1/login/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=saml_credentials' \
--data-urlencode 'saml_response=<DESCRITOR_BASE64>'
```
obs. para o erro é 401 { "error": "invalid_request" }, se trata de uma resposta genérica para qualquer tipo de erro ocorrido, desta forma necessário rever todos os passos


# Documentações
- [samlify - lib Identity Provider](https://samlify.js.org/#/)
- [OCC - Implement Storefront Single Sign-On](https://docs.oracle.com/en/cloud/saas/cx-commerce/21a/ccdev/implement-storefront-single-sign1.html)
