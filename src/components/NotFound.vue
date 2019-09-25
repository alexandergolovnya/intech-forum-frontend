<template>
  <div class="wrapper">
    <h1>¯\_(ツ)_/¯ </h1>
    <h3>К сожаления такая страница не существует или у вас нет нужных прав</h3>
    <router-link to="/">
        <b-button>На главную</b-button>
      </router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

<style scoped>
.wrapper {
  padding: 50px;
  max-width: 750px;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.wrapper h3 {
  margin: 20px;
  font-weight: 500;
  text-align: center;
}

.wrapper h1 {
  font-size: 70px;
  margin: 20px;
  font-weight: 200;
  text-align: center;
}
</style>
