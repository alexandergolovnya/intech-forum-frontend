<template>
  <div class="navbar">
    <router-link to="/" class="navbar-link">О проекте</router-link>
    <router-link to="/topics" class="navbar-link">Forum topics</router-link>
  </div>
</template>

<script>
export default {
  name: 'NavigationBar',
};
</script>

<style scoped>
.navbar {
  /* overflow: hidden; */
  background-color: #fff;
  /* position: sticky; */
  overflow: hidden;
  top: 0;
  width: 100%;
  opacity: 0.95;
  display: flex;
  justify-content: center;
}

/* Links inside the navbar */
.navbar-link {
  float: left;
  display: block;
  color: #616161;
  text-align: center;
  padding: 12px 16px;
  text-decoration: none;
}

/* Change background on mouse-over */
.navbar a:hover {
  background-color: #f1f1f1;
  color: black;
}

.router-link-exact-active {
  background-color: #f1f1f1;
  color: #000;
}
</style>
