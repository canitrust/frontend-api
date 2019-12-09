# CanITrust.in

:rocket: Visit us under [canitrust.in](https://canitrust.in)!

## What is CanITrust.in?

Browsers nowadays have a lot of built-in security features to help make the web more safe by default. Although this is a great thing, unfortunately, different browsers implement these features slightly different than other browsers. And sometimes, the implementations also differ from browser version to browser version.

This is where [CanITrust.in](https://canitrust.in) comes to the rescue. Inspired by the great [caniuse.com](https://caniuse.com), we built an environment to test all those different security features. This web site makes the results available.

## How can I contribute?

Please check out the corresponding [guide](https://github.com/canitrust/backend/wiki/How-to-contribute).

## Start the server

Its easiest with docker-compose:

```
docker-compose up --build
```

This should start the API under http://localhost:9191 and you can test a call to it with:

```
curl 'http://localhost:9191/api/v1/testcase?page=1'
```

Alternatively, you can checkout and start the [React UI](https://github.com/canitrust/frontend-client) for it.

## License

Copyright (c) mgm security partners GmbH. All rights reserved.

Licensed under the [AGPLv3](LICENSE.md) License.
