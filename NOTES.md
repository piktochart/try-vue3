# Install Vue plugin from the createApp

- BREAKING CHANGE! Vue.use is deprecated
- Can only install app from the object returned from `createApp`
- A good sign to keep the immutability of the original Vue class
- BREAKING CHANGE! You may not able to run Vue plugin functionality from the script that's not under Vue instance

# Using Class-based Component

- NOT STABLE or FINALIZED yet
- vue-class-component is working, but without the support of vue-property-decorator yet

# No Reactivity Caveats

- No need to use `Vue.set` anymore
- Tried on `piktodev` page `test_component` which is still using Vue2, and not finding the reactivity caveats
- Yet I recalled some of the devs faced this caveats before
- Anyway, good to know that Vue3 has resolved this caveats

# Portal Target (renamed to Teleport)

- VuePortal natively works in Vue3 without any plugin
- But, I couldn't reproduce it yet.... in the current Vue beta :(
- Okay, they have renamed it from <Portal> to <Teleport>, to avoid potential conflict with native <portal> component
- And, the prop name is renamed from `target` to `to`.
- Since no documentation reported about this yet, I figure it out all thanks to their commit history here:
https://github.com/vuejs/vue-next/commit/eee50956924d7d2c916cdb8b99043da616e53af5
- And seems like, still got bugs. Open challenge for you to help them ;)

# Multiple Root Nodes

- Good news, finally Vue allows multiple root nodes!
- Ignore the linting, I guess it's still outdated or following the Vue2 rules

# Multiple v-model

- Considered a BREAKING CHANGE! Because the `model` option is deprecated
- To emit the changes back to the parent component, must use `$emit('update:propName', value)`
- Ignore the linting, I guess it's still outdated or following the Vue2 rules

# Suspense

- A wrapper component that supports the new composition API and handling the case of asynchronous setup
- Show the #fallback template as the default one while setup() is still not returning the values