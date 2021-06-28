<template>
  <div class="lmLoadingBox rowCenter" v-if="visible">
    <i class="el-icon-loading font32 gray666" :style="{color,'font-size':size ? size+'px' : ''}"></i>
  </div>
</template>

<script>
export default {
    name: "LmLoading",
}
</script>
