<template>
  <div>
    <b-card-group v-for="entity in entitiesList" :key="entity.id">
      <b-card :title="entity.messageTitle" class="message-card">
        <b-card-text class="text-left">{{ entity.messageBody }}</b-card-text>

        <div class="card-buttons">
          <b-button
            v-b-modal.topicMessageModal
            pill
            size="sm"
            variant="outline-secondary"
            class="card-button"
            v-if="entity.accountId == getCurrentUserId"
          >Редактировать</b-button>

          <b-button
            @click="deleteTopicMessage(entity.id)"
            pill
            size="sm"
            variant="outline-danger"
            class="card-button"
            v-if="isAdmin || entity.accountId == getCurrentUserId"
          >Удалить сообщение</b-button>
        </div>

        <div class="message-author">
          <router-link :to="'/accounts/' + entity.accountId">{{ entity.accountFullName }}</router-link>
        </div>

        <MessageModalComponent
          @created="emitMessageModified"
          :topicMessageId="entity.id"
          modalHeaderText="Редактирование сообщения"
        />
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import MessageModalComponent from "@/components/topic-message/MessageModalComponent";

export default {
  name: "MessageCardComponent",

  props: ["entitiesList"],

  components: {
    MessageModalComponent
  },

  methods: {
    deleteTopicMessage(messageId) {
      if (messageId !== undefined) {
        this.$http
          .delete(`/topic-messages/${messageId}`)
          .then(() => {
            this.$emit("modified");
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          });
      }
    },
    emitMessageModified() {
      this.$emit("modified");
    }
  },

  computed: {
    getCurrentUserId() {
      return this.$store.getters.userId;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    }
  }
};
</script>

<style scoped>
.message-author {
  display: flex;
  /* align-items: right; */
  justify-content: flex-end;
}
.message-card {
  margin: 15px;
  font-size: 15px;
}
.card-button {
  margin: 5px;
}
.card-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
