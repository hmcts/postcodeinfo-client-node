# postcode-info-client-node

API Client wrapper for [MoJ Postcode Info API](https://github.com/ministryofjustice/postcodeinfo)
which contains public sector information licensed under the Open Government License v2.0

[![Build Status](https://travis-ci.org/hmcts/postcode-info-client-node.svg?branch=master)](https://travis-ci.org/hmcts/postcode-info-client-node.svg?branch=master)  
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)  
[![Greenkeeper badge](https://badges.greenkeeper.io/hmcts/postcode-info-client-node.svg)](https://greenkeeper.io/)

# Usage

## Authentication

You will need an _authentication token_ ('auth token'). If you're using MoJ DS's Postcode Info server, 
you can get one by emailing platforms@digital.justice.gov.uk with a brief summary of:

* who you are
* what project you're going to be using it on
* roughly how many lookups you expect to do per day

If you're running your own server, see https://github.com/ministryofjustice/postcodeinfo#auth_tokens for instructions on how to set a token up.

## Quick start
```bash
$ yarn add @hmcts/postcodeinfo-client
```

Typescript:
```ts
import { PostcodeInfoClient  } from '@hmcts/postcodeinfo-client'

new PostcodeInfoClient('<token here>').lookupPostcode('SN15NB')

```

- Javascript -

```js
const PostcodeInfoClient = require('@hmcts/postcodeinfo-client').PostcodeInfoClient

new PostcodeInfoClient('<token here>').lookupPostcode('SN15NB')
```
