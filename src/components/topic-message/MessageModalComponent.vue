<template>
  <b-modal id="topicMessageModal" ref="modal" size="lg" hide-footer centered>
    <b-form @submit.prevent="handleSubmit">
      <b-form-group id="messageNameLabel" :label="`Название сообщения`" label-for="messageName">
        <b-form-input
          id="messageName"
          type="text"
          v-model="message.messageTitle"
          :state="messageTitleState"
          aria-describedby="messageNameLiveFeedback"
          oninvalid="this.setCustomValidity('Введите название')"
          :placeholder="`Введите название сообщения`"
        ></b-form-input>

        <b-form-invalid-feedback id="messageNameLiveFeedback">Введите не менее 10 символов</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="messageDescriptionLabel"
        :label="`Текст сообщения`"
        label-for="messageDescription"
      >
        <b-form-textarea
          id="messageDescription"
          v-model="message.messageBody"
          :state="messageBodyState"
          aria-describedby="messageDescriptionLiveFeedback"
          :placeholder="`Введите текст сообщения`"
          rows="3"
        ></b-form-textarea>

        <b-form-invalid-feedback id="messageDescriptionLiveFeedback">Введите не менее 25 символов</b-form-invalid-feedback>
      </b-form-group>

      <b-btn type="submit" size="sm" class="form-button">Сохранить</b-btn>
      <b-btn
        type="reset"
        size="sm"
        class="form-button"
        variant="danger"
        @click="handleClose"
      >Отменить</b-btn>
    </b-form>

    <div slot="modal-header" class="modal-header-class">
      <h4 class="modal-header-text">{{ this.modalHeaderText }}</h4>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "MessageModalComponent",

  props: ["topicMessageId", "modalHeaderText"],

  data() {
    return {
      message: {
        id: this.topicMessageId,
        messageTitle: "",
        messageBody: "",
        accountId: this.$store.getters.userId,
        topicId: this.$route.params.id
      },
      startValidate: false
    };
  },

  computed: {
    messageTitleState() {
      if (this.startValidate) {
        return this.message.messageTitle.length > 10 ? true : false;
      }
    },

    messageBodyState() {
      if (this.startValidate) {
        return this.message.messageBody.length > 25 ? true : false;
      }
    }
  },

  methods: {
    handleClose() {
      this.message.messageTitle = "";
      this.message.messageBody = "";
      this.startValidate = false;
      this.$refs.modal.hide();
    },

    handleSubmit() {
      this.startValidate = true;
      if (this.messageTitleState && this.messageBodyState) {
        if (this.topicMessageId === undefined) {
          this.$http
            .post(`/topic-messages`, this.message)
            .then(() => {
              this.$emit("created");
              this.message.messageTitle = "";
      this.message.messageBody = "";
              this.startValidate = false;
              this.$refs.modal.hide();
            })
            .catch(error => {
              console.log(error);
              alert("Ошибка при создании сообщения");
            });
        } else {
          this.$http
            .put(`/topic-messages/${this.topicMessageId}`, this.message)
            .then(() => {
              this.$emit("created");
               this.message.messageTitle = "";
      this.message.messageBody = "";
              this.startValidate = false;
              this.$refs.modal.hide();
            })
            .catch(error => {
              console.log(error);
              alert("Ошибка при редактировании сообщения");
            });
        }
      }
    },

    getTopicMessage() {
      if (this.topicMessageId !== undefined) {
        this.$http
          .get(`/topic-messages/${this.topicMessageId}`)
          .then(response => {
            this.message = response.data;
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          });
      }
    },
  },

  mounted() {
    this.getTopicMessage()
  }
};
</script>

<style scoped>
.form-button {
  margin: 15px 0px 5px 10px;
  float: right;
}

.modal-header-class {
  margin: auto;
}

.modal-header-text {
  font-size: 25px;
  font-weight: 500;
  color: #2c3e50;
}
</style>
