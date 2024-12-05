<script setup lang="ts">
import DetectionCanvas from '@/components/detection/DetectionCanvas.vue'
import PanoramicViews from '@/components/detection/PanoramicViews.vue'

definePage({
  meta: {
    icon: 'mdi-molecule',
    title: 'Detection',
    drawerIndex: 3,
  },
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="9">
                <DetectionCanvas />
              </v-col>
              <v-col cols="3">
                <PanoramicViews />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
