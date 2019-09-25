<template>
  <div class="container-fluid">
    <h1 class="h1">Forum topics</h1>
    <b-button variant="outline-secondary" size="sm" v-b-modal.topicModal class="button-create">Новая тема</b-button>
    <hr />
    <section v-if="errored">
      <p>К сожалению, запрашиваемая информация не доступна в данный момент</p>
      <router-link to="/">
        <b-button>На главную</b-button>
      </router-link>
    </section>
    <section v-else>

      <ModalComponent
        @created="getTopics"
        modalHeaderText="Создание новой темы"
      />

      <CardComponent id="topics" :entitiesList="topics" entityUrlName="topics" />

      <b-pagination
        size="md"
        :total-rows="totalItems"
        v-model="currentPage"
        :per-page="perPage"
        align="center"
        first-text="First"
        prev-text="Prev"
        next-text="Next"
        last-text="Last"
        aria-controls="topics"
      />
    </section>
  </div>
</template>

<script>
import ModalComponent from "@/components/topic/ModalComponent";
import CardComponent from "@/components/topic/CardComponent";

export default {
  name: "ForumTopics",

  data() {
    return {
      topics: null,
      totalItems: null,
      currentPage: 1,
      perPage: 3,
      errored: false
    };
  },

  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    }
  },

  components: {
    ModalComponent,
    CardComponent
  },

  methods: {
    getTopics() {
      this.$http
        .get(`/topics/page?page=${this.currentPage - 1}&size=${this.perPage}`)
        .then(response => {
          this.topics = response.data.content;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        });
    },

    getTopicsCount() {
      this.$http
        .get(`/topics/count`)
        .then(response => {
          this.totalItems = response.data;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        });
    }
  },

  watch: {
    currentPage: {
      handler: function() {
        this.getTopics();
        this.getTopicsCount();
      }
    }
  },

  mounted() {
    this.getTopics();
    this.getTopicsCount();
  }
};
</script>

<style scoped>
.h1 {
  margin-top: 10px;
  font-size: 50px;
  font-weight: 500;
  color: #2c3e50;
}
.container-fluid {
  padding: 30px;
}
.mb-3 {
  display: grid;
  grid-template-columns: repeat(2, 5fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
  max-width: 1200px;
  margin: 0px auto;
}
.text-center {
  font-size: 25px;
}
.card-button {
  margin-left: 5px;
  margin-top: 15px;
}
.card-text {
  font-size: 15px;
}
</style>
