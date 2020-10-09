Dashup Module Auth
&middot;
[![Latest Github release](https://img.shields.io/github/release/dashup/module-auth.svg)](https://github.com/dashup/module-auth/releases/latest)
=====

A connect interface for auth on [dashup](https://dashup.io).

## Contents
* [Get Started](#get-started)
* [Connect interface](#connect)

## Get Started

This auth connector adds auths functionality to Dashup auths:

```json
{
  "url" : "https://dashup.io",
  "key" : "[dashup module key here]"
}
```

To start the connection to dashup:

`npm run start`

## Deployment

1. `docker build -t dashup/module-auth .`
2. `docker run -d -v /path/to/.dashup.json:/usr/src/module/.dashup.json dashup/module-auth`