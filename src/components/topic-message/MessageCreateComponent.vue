<template>
  <div class="container-fluid">
    <section v-if="errored" class="errored">
      <p>К сожалению, запрашиваемая информация не доступна в данный момент</p>
      <router-link to="/">
        <b-button>На главную</b-button>
      </router-link>
    </section>
    <section v-else>
      <b-form @submit="onSubmit" v-if="show" class="form-class">
        <b-form-group
          id="messageTitleLabel"
          label="Заголовок сообщения"
          label-for="messageTitle"
          description="За вами следит ФСБ"
        >
          <b-form-input
            id="messageTitle"
            type="text"
            v-model="topicMessage.messageTitle"
            required
            oninvalid="this.setCustomValidity('Пожалуйста заполните это поле')"
            placeholder="Введите название сообщения"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="messageBodyLabel" label="Текст сообщения" label-for="messageBody">
          <b-form-textarea
            id="messageBody"
            v-model="topicMessage.messageBody"
            placeholder="Введите текст сообщения"
            required
            oninvalid="this.setCustomValidity('Пожалуйста заполните это поле')"
            :rows="3"
            :max-rows="6"
          ></b-form-textarea>
        </b-form-group>
        <div class="button">
          <b-button type="submit" variant="outline-primary">Сохранить</b-button>
        </div>
      </b-form>
    </section>
  </div>
</template>

<script>
export default {
  name: "MessageCreateComponent",

  props: ['topicMessageId'],

  data() {
    return {
      topicMessage: {
        id: this.topicMessage,
        messageTitle: "",
        messageBody: "",
        accountId: this.$store.getters.userId,
        topicId: this.$route.params.id
      },
      departments: null,
      errored: false,
      show: true
    };
  },

  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$http
        .post(`/topic-messages`, this.topicMessage)
        .then(resp => {
          this.$emit("created");
          this.topicMessage.messageTitle = "";
          this.topicMessage.messageBody = "";
        })
        .catch(err => {
          this.errored = true;
          console.error(err);
        });
    },
    onReset(evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.topicMessage.messageTitle = "";
      this.topicMessage.messageBody = "";
      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    getTopicMessage() {
      if (this.topicMessageId !== undefined) {
        this.$http
          .get(`/topic-messages/${this.topicMessageId}`)
          .then(() => {
            this.$emit("modified");
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          });
      }
    },
  }
};
</script>

<style scoped>
.h1 {
  margin-top: 10px;
  font-size: 35px;
  font-weight: 500;
  color: #2c3e50;
}
.jumbotron {
  background-color: #f8f8f8;
  padding: 20px;
  padding-bottom: 10px;
  margin-top: 25px;
}
.form-class {
  padding: 20px;
  max-width: 700px;
  text-align: left;
  margin: auto;
}
.container-fluid {
  padding: 0px;
}
.button {
  display: flex;
  justify-content: flex-end;
}
</style>
