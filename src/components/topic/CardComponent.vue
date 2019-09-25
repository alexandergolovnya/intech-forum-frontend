<template>
  <div class="mb-3">
    <b-card-group deck v-for="entity in entitiesList" :key="entity.id">
      <b-card :header="entity.title" class="topic-card" @click="gotoTopicPage(entity.id)">
        <p class="card-text">{{ entity.description }}</p>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
export default {
  name: "CardComponent",

  props: ["entitiesList", "entityUrlName"],

  methods: {
    gotoTopicPage(topicId) {
      this.$router.push(`/topics/${topicId}`);
    }
  },

  computed: {
    isAdmin() {
      return !this.$store.getters.isAdmin;
    }
  }
};
</script>

<style scoped>
.mb-3 {
  display: grid;
  grid-template-columns: repeat(2, 5fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
  max-width: 1200px;
  margin: 0px auto;
}
.topic-card {
  font-size: 25px;
}
.topic-card:hover {
  cursor: pointer;
  background-color: rgb(250, 249, 249);
}
.card-button {
  margin-left: 5px;
  margin-top: 15px;
}
.card-text {
  font-size: 15px;
}
</style>
