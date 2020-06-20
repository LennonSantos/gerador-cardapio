<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Gerador de Cardápio
        </q-toolbar-title>

        <div>Athos MKT</div>
      </q-toolbar>
    </q-header> -->

    <!-- <q-drawer
      v-model="leftDrawer"
      side="left"
      bordered
      content-class="bg-grey-2"
    >
      <q-scroll-area class="fit q-pa-sm">
      </q-scroll-area>
    </q-drawer> -->

    <q-page-container class="bg-grey-3">
      <vue-page-transition
        name="fade"
      >
        <router-view />
      </vue-page-transition>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',

  data () {
    return { 
      leftDrawer: true
    }
  }
}
</script>
