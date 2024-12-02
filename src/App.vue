<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import { useAppStore } from './store/app'

const { snackbarProps } = useAppStore()
const { t } = useI18n()
const theme = useTheme()

const preferredColor = usePreferredColorScheme()
const dark = useDark()

watch(preferredColor, (color) => {
  theme.global.name.value = color
}, {
  immediate: true,
})

watch(theme.global.name, (theme) => {
  dark.value = theme === 'dark'
})
</script>

<template>
  <v-theme-provider>
    <v-responsive>
      <v-snackbar
        v-model="snackbarProps.visible"
        :text="snackbarProps.text"
      >
        <template #actions>
          <v-btn
            color="pink"
            variant="text"
            @click="snackbarProps.visible = false"
          >
            {{ t('close') }}
          </v-btn>
        </template>
      </v-snackbar>
      <v-app>
        <RouterView />
      </v-app>
    </v-responsive>
  </v-theme-provider>
</template>
