<template>
  <b-modal id="topicModal" ref="modal" size="lg" hide-footer centered>
    <b-form @submit.prevent="handleSubmit">
      <b-form-group id="entityNameLabel" :label="`Название темы`" label-for="entityName">
        <b-form-input
          id="entityName"
          type="text"
          v-model="entity.title"
          :state="titleState"
          aria-describedby="entityNameLiveFeedback"
          oninvalid="this.setCustomValidity('Введите название')"
          :placeholder="`Введите название темы`"
        ></b-form-input>

        <b-form-invalid-feedback id="entityNameLiveFeedback">Введите не менее 10 символов</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="entityDescriptionLabel"
        :label="`Описание темы`"
        label-for="entityDescription"
      >
        <b-form-textarea
          id="entityDescription"
          v-model="entity.description"
          :state="descriptionState"
          aria-describedby="entityDescriptionLiveFeedback"
          :placeholder="`Введите описание темы`"
          rows="3"
        ></b-form-textarea>

        <b-form-invalid-feedback id="entityDescriptionLiveFeedback">Введите не менее 25 символов</b-form-invalid-feedback>
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
  name: "ModalComponent",

  props: ["topicId", "modalHeaderText"],

  data() {
    return {
      entity: {
        id: this.topicId,
        title: "",
        description: "",
        lastMessageDateTime: ""
      },
      startValidate: false
    };
  },

  computed: {
    titleState() {
      if (this.startValidate) {
        return this.entity.title.length > 10 ? true : false;
      }
    },

    descriptionState() {
      if (this.startValidate) {
        return this.entity.description.length > 25 ? true : false;
      }
    }
  },

  methods: {
    handleClose() {
      this.entity.title = "";
      this.entity.description = "";
      this.startValidate = false;
      this.$refs.modal.hide();
    },

    handleSubmit() {
      this.startValidate = true;
      if (this.titleState && this.descriptionState) {
        if (this.topicId === undefined) {
          this.$http
            .post(`/topics`, this.entity)
            .then(() => {
              this.$emit("created");
              this.entity.title = "";
              this.entity.description = "";
              this.startValidate = false;
              this.$refs.modal.hide();
            })
            .catch(error => {
              console.log(error);
              alert("Ошибка при создании темы");
            });
        } else {
          this.$http
            .put(`/topics/${this.topicId}`, this.entity)
            .then(() => {
              this.$emit("created");
              this.entity.title = "";
              this.entity.description = "";
              this.startValidate = false;
              this.$refs.modal.hide();
            })
            .catch(error => {
              console.log(error);
              alert("Ошибка при редактировании темы");
            });
        }
      }
    },

    getTopic() {
      if (this.topicId !== undefined) {
        this.$http
          .get(`/topics/${this.topicId}`)
          .then(response => {
            this.entity = response.data;
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          });
      }
    },
  },

  mounted() {
    this.getTopic()
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
