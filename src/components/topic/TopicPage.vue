<template>
  <div class="container-fluid">
    <section v-if="errored" class="errored">
      <p>К сожалению, запрашиваемая информация не доступна в данный момент</p>
      <router-link to="/">
        <b-button>На главную</b-button>
      </router-link>
    </section>
    <section v-else>
      <div class="header-section">
        <h1>{{ topic.title }}</h1>
        <p>{{  topic.description }}</p>
        <b-button
          v-b-modal.topicModal
          pill
          variant="outline-secondary"
          size="sm"
          class="card-button"
          v-if="isAdmin"
        >Редактировать тему</b-button>

        <b-button
          @click="deleteTopic"
          pill
          variant="outline-danger"
          size="sm"
          class="card-button"
          v-if="isAdmin"
        >Удалить тему</b-button>
      </div>

      <ModalComponent @created="getTopic" :topicId="this.topic.id" modalHeaderText="Редактирование темы" />
      <MessageCardComponent @modified="getTopicMessages" :entitiesList="topicMessages" id="messages"/>

      <MessageCreateComponent @created="getTopicMessages" />

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

      <hr />

      <b-button to="/topics">Назад</b-button>
    </section>
  </div>
</template>

<script>
import ModalComponent from "@/components/topic/ModalComponent";
import MessageCardComponent from "@/components/topic-message/MessageCardComponent";
import MessageCreateComponent from "@/components/topic-message/MessageCreateComponent";

export default {
  name: "TopicPage",

  data() {
    return {
      topic: {
        id: this.$route.params.id,
        title: "",
        description: "",
        lastMessageDateTime: ""
      },
      topicMessages: [],
      totalItems: null,
      currentPage: 1,
      perPage: 5,
      errored: false
    };
  },

  components: {
    MessageCardComponent,
    ModalComponent,
    MessageCreateComponent
  },

  methods: {
    getTopic() {
      if (this.topic.id !== undefined) {
        this.$http
          .get(`/topics/${this.topic.id}`)
          .then(response => {
            this.topic = response.data;
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          });
      }
    },
    deleteTopic() {
      if (this.topic.id !== undefined) {
        this.$http
          .delete(`/topics/${this.topic.id}`)
          .then(response => {
            this.$router.push('/topics');
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          });
      }
    },
    getTopicMessages() {
      if (this.topic.id !== undefined) {
        this.$http
          .get(
            `/topic-messages/topic/${this.topic.id}?page=${this.currentPage -
              1}&size=${this.perPage}`
          )
          .then(response => {
            this.topicMessages = response.data.content;
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          });
      }
    },
    getTopicMessagesCount() {
      this.$http
        .get(`/topic-messages/topic/${this.topic.id}/count`)
        .then(response => {
          this.totalItems = response.data;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        });
    }
  },

  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    }
  },

  watch: {
    currentPage: {
      handler: function() {
        this.getTopicMessages();
        this.getTopicMessagesCount();
      }
    }
  },

  mounted() {
    this.getTopic();
    this.getTopicMessages();
    this.getTopicMessagesCount();
  }
};
</script>

<style scoped>
.errored {
  margin: 25px;
  font-size: 20px;
}
.container-fluid {
  padding: 30px;
}
/* Главная секция */
.body-section {
  padding: 15px;
}
.body-section-text {
  color: #000;
  text-align: left;
  font-size: 17px;
}
/* Конец главной секции */

/* Правая секция */
.right-section {
  float: right;
}
.right-section-item {
  margin-bottom: 20px;
}
.right-section-item-text {
  color: #000;
  text-align: left;
  font-size: 13px;
}
.h3 {
  text-align: left;
}
.h5 {
  color: #000;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
}
/* Конец правой секции */

/* Styles for Department Cards */
.mb-3 {
  display: inline-block;
  width: 48%;
  margin: 10px;
  max-width: 600px;
}
.text-center {
  font-size: 25px;
}
.card-text {
  font-size: 15px;
}
.card-button {
  margin: 0px 10px 15px 0px;
}
.faculty-text {
  margin: auto;
  font-size: 12px;
  background-color: lightgray;
  max-width: 50%;
}
/* End of styles for Department Cards */
</style>
