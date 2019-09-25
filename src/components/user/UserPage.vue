<template>
  <div class="container-fluid">
    <section v-if="isError">
      <p>К сожалению, запрашиваемая информация не доступна в данный момент</p>
      <router-link to="/">
        <b-button>На главную</b-button>
      </router-link>
    </section>
    <section v-else>
      <div class="header-section">
        <h1 class="h1">{{ user.firstName + ' ' + user.middleName + ' ' + user.lastName }}</h1>
        <p>Email-адрес: {{ user.email }}</p>
        <p>Телефон: {{ user.phone }}</p>
        <p>Роль в системе: {{ this.userRoleText }}</p>
        <hr />
      </div>
    
      <router-link to="/">
        <b-button>На главную</b-button>
      </router-link>
    </section>
  </div>
</template>

<script>
export default {
  name: "UserPage",

  data() {
    return {
      accountId: this.$route.params.id,
      user: "",
      isError: false,
      show: true
    };
  },

  methods: {
    getUser() {
      if (this.accountId == undefined) {
        this.$http
          .get("/accounts/current-user")
          .then(response => {
            this.user = response.data;
          })
          .catch(error => {
            console.log(error);
            this.isError = true;
          });
      } else {
        this.$http
          .get(`/accounts/${this.accountId}`)
          .then(response => {
            this.user = response.data;
          })
          .catch(error => {
            console.log(error);
            this.isError = true;
          });
      }
    },
  },

  computed: {
    userRoleText() {
      if (this.isAdmin) {
        return "Администратор";
      } else return "Пользователь";
    },

    userId() {
      return this.$store.getters.userId;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    }
  },

  mounted() {
    this.getUser();
  }
};
</script>

<style scoped>
.form-class {
  max-width: 1000px;
  text-align: left;
  margin: auto;
}
.faculty-text {
  margin: auto;
  font-size: 18px;
  background-color: lightgray;
  max-width: 40%;
}
.container-fluid {
  padding: 0px;
}
.h1 {
  margin-top: 10px;
  font-size: 35px;
  font-weight: 500;
  color: #2c3e50;
}
.button {
  margin-right: 5px;
}
</style>
