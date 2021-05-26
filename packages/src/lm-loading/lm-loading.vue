<template>
  <div class="loadingBox rowCenter" v-if="visible">
    <i class="el-icon-loading font32 gray666"></i>
  </div>
</template>

<script>
export default {
    name: "LmLoading",
}
</script>
<style scoped lang="scss">
@import "~lm-ui-element/lib/lm-ui-element-style/utils/mix";
.loadingBox{
  @include positionLeftTopSizeIndex($position:fixed,$z-index:9999999999);
}
</style>
