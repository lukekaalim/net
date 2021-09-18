# http-client

Simple abstraction over the various platforms HTTP clients, to make simple REST calls using Promises.

[![CircleCI](https://img.shields.io/circleci/build/github/lukekaalim/http-client)](https://circleci.com/gh/lukekaalim/workflows/http-client)
[![npm (scoped)](https://img.shields.io/npm/v/@lukekaalim/http-client)](https://www.npmjs.com/package/@lukekaalim/http-client)

## Motivation
Fetch is a pretty good function for making network requests, but is a pretty complicated interface to implement.

This library provides a shared abstraction for a fetch-like client object, which can be constructed for the browsers `window.fetch` property, or node's `require('http').request` property.

The intention is then further, more specific libraries can be written that use this client's interface so functionality can be the same across node and in web without any complicated gymnastics.