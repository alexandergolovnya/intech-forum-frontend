<template>
  <div class="home">
     <div>
      <h1 class="h1">Welcome to the Intech forum</h1>
      <p>
        In order to get info about REST API,<br>
        check out the
        <a href="https://github.com/alexandergolovnya/intech-forum-api" target="_blank" rel="noopener">github</a>.
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home'
};
</script>

<style scoped>
  .home {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

