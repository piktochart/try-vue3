# New Feature & Improvement

## No Reactivity Caveats

- No need to use `Vue.set` anymore
- Tried on `piktodev` page `test_component` which is still using Vue2, and not finding the reactivity caveats
- Yet I recalled some of the devs faced this caveats before
- Anyway, good to know that Vue3 has resolved this caveats

## Vue Portal Target (renamed to Teleport)

- VuePortal now natively works in Vue3 without any plugin
- But, they have renamed it from <Portal> to <Teleport>, to avoid potential conflict with native <portal> component
- And, the prop name is renamed from `target` to `to`.
- Since no documentation reported about this yet, I figure it out all thanks to their commit history here:
https://github.com/vuejs/vue-next/commit/eee50956924d7d2c916cdb8b99043da616e53af5
- And seems like, currently it still have some bugs. Open challenge for you to help them ;)

## Multiple Root Nodes

- Good news, finally Vue allows multiple root nodes!
- Ignore the linting, I guess it's still outdated or following the Vue2 rules

# Suspense

- A wrapper component that supports the new composition API and handling the case of asynchronous setup
- Show the #fallback template as the default one while setup() is still not returning the values


# API Changes

## Install Vue plugin from the createApp

- BREAKING CHANGE! Vue.use is deprecated
- BREAKING CHANGE! You may not able to run Vue plugin functionality from the script that's not under Vue instance
- Can only install app from the object returned from `createApp`
- A good sign to keep the immutability of the original Vue class

## Multiple v-model

- BREAKING CHANGE! Because the `model` option is deprecated
- To emit the changes back to the parent component, must use `$emit('update:propName', value)`
- Ignore the linting, I guess it's still outdated or following the Vue2 rules
- RFC: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0005-replace-v-bind-sync-with-v-model-argument.md

## $on Deprecated

- `vm.$on` is undefined
- Officially introduced in the RFC: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0020-events-api-change.md

# Unconfirmed or WIP

## Using Class-based Component

- NOT STABLE or FINALIZED yet
- vue-class-component is working, but without the support of vue-property-decorator yet

## Vue.nextTick deprecated

- Vue 3 nextTick are planned to be removed from the VM instance
- Users will have to migrate over to importing it from Vue directly `import { nextTick } from 'vue'`.
- The current beta version still allows `vm.$nextTick`
- RFC: https://github.com/vuejs/rfcs/blob/master/active-rfcs/0000-vtu-improve-async-workflow.md
