<template>
  <div id="app">
    <div id="teleport-target"></div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/playground">Playground</router-link> |
      <router-link to="/dragdrop">Drag Drop</router-link> |
      <router-link to="/editor/1">Editor</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
