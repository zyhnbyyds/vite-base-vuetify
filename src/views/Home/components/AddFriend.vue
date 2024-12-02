<script lang='ts' setup>
const visible = defineModel<boolean>({ default: true })

const searchUserName = ref('')

const userList = [
  {
    name: 'John',
    group: 'Group 1',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
  },
  {
    name: 'Jane',
    group: 'Group 2,5 +98i',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
  },
]

function handleClickApply() {
  visible.value = false
}
</script>

<template>
  <v-dialog v-model="visible" max-width="800px">
    <v-card
      prepend-icon="mdi-account-plus"
      title="Add friend"
    >
      <template #actions>
        <v-spacer />

        <v-btn @click="visible = false">
          Disagree
        </v-btn>

        <v-btn @click="handleClickApply">
          Send Apply
        </v-btn>
      </template>

      <div class="px-5">
        <v-autocomplete
          v-model="searchUserName"
          :items="userList"
          color="blue-grey-lighten-2"
          item-title="name"
          item-value="name"
        >
          <template #item="{ props, item }">
            <v-list-item
              v-bind="props"
              :prepend-avatar="item.raw.avatar"
              :subtitle="item.raw.group"
              :title="item.raw.name"
            />
          </template>
        </v-autocomplete>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
