<template>
  <div class="about">
    <h1>This is a playground page</h1>
    <Teleport to="#teleport-target">
      <h1>Playground</h1>
    </Teleport>
    <h2>Test List</h2>
    <list :lists="lists" />
    <h2>Test Modal Input</h2>
    <div>
      Visible: <input type="checkbox" v-model="modalVisible" />
      <br />
      Value: <input type="text" v-model="modalValue" />
    </div>
    <modal-input v-model:visible="modalVisible" v-model:value="modalValue" />
    <h2>Test Load User</h2>
    <Suspense>
      <template #default>
        <load-user />
      </template>
      <template #fallback>
        Loading...
      </template>
    </Suspense>
    <h2>Test Component Switch</h2>
    <div id="test-teleport">Default Teleport</div>
    <component :is="componentName" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import List from "@/components/List.vue";
import ModalInput from "@/components/ModalInput.vue";
import LoadUser from "@/components/LoadUser.vue";
import TestTeleport1 from "@/components/TestTeleport1.vue";
import TestTeleport2 from "@/components/TestTeleport2.vue";

export default defineComponent({
  name: "Playground",
  components: {
    List,
    ModalInput,
    LoadUser,
    TestTeleport1,
    TestTeleport2
  },
  data() {
    return {
      lists: [
        "Albert",
        "Bri1",
        "Supreme",
        "Jun1",
        "FX",
        "UGL",
        "MF",
        "Piktogram",
        "i18n",
        "MV",
        "MP",
        "Jun3"
      ],
      modalVisible: false,
      modalValue: "",
      componentName: "test-teleport1"
    };
  },
  mounted() {
    const components = ["test-teleport1", "test-teleport2"];
    let idx = 0;
    setInterval(() => {
      this.componentName = components[idx];
      idx = idx === 0 ? 1 : 0;
    }, 1000);
  }
});
</script>
