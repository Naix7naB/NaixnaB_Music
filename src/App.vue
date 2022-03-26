<template>
  hello wrold
  <button @click="getMessage"></button>
</template>

<script setup>
import { get } from "@/service/base.js";

function getMessage() {
  get("/banner", {
    type: 2,
  }).then((res) => {
    console.log(res);
  });
}
</script>
