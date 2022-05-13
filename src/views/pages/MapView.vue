<template>
  <Sidebar :singleEvent="singleEvent" />
  <div class="w-screen h-screen">
    <LMap
      :bounds="bounds"
      :maxBounds="maxBounds"
      :zoom="zoom"
      :minZoom="minZoom"
      :maxZoom="maxZoom"
      :zoomAnimation="true"
      :markerZoomAnimation="true"
      :center="center"
      @zoom="log_move('move')"
    >
      <LTileLayer :url="url" :attribution="attribution" />
      <LPolygon
        :lat-lngs="[poly_campus]"
        color="#41b782"
        :fill="true"
        :fillOpacity="0.0"
        fillColor="#41b782"
      />
      <LMarker
        v-for="place in mapInfo"
        :key="place.id + place.event_count"
        :lat-lng="[place.latitude, place.longitude]"
        @click="onClickSelectPlace(place.id, place.event_count)"
        @moveend="log_move('moveend')"
      >
        <LIcon
          :icon-anchor="staticAnchor"
          :icon-size="iconSize"
          :icon-url="iconUrl"
        />
        <LTooltip> {{ place.event_count }} events </LTooltip>
      </LMarker>
    </LMap>
  </div>
</template>

<style>
.leaflet-control-container {
  display: none;
}
</style>

<script>
import Sidebar from "@/components/Sidebar.vue";
import { mapState, mapGetters } from "vuex";
import * as mapComponents from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import MapIcon from "@/assets/img/svg/logo.svg";
import geojson from "@/assets/json/geojson";
import api from "@/service/api";

export default {
  name: "MapPage",
  components: {
    LMap: mapComponents.LMap,
    LTileLayer: mapComponents.LTileLayer,
    LPolygon: mapComponents.LPolygon,
    LMarker: mapComponents.LMarker,
    LTooltip: mapComponents.LTooltip,
    LIcon: mapComponents.LIcon,
    Sidebar,
  },

  data() {
    return {
      mapInterval: null,
      mapTimeout: 30,
      mapInfo: null,
      mapSelectedPlace: null,

      singleEvent: null,

      poly_campus: geojson.FEFU_POLY,

      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 15,
      minZoom: 15,
      maxZoom: 18,
      center: [43.029308, 131.892346],
      bounds: [
        [43.034866, 131.881141],
        [43.011322, 131.937942],
      ],
      maxBounds: [
        [43.050454, 131.855313],
        [42.998232, 131.935496],
      ],

      staticAnchor: [28, 56],
      iconWidth: 56,
      iconHeight: 56,
    };
  },

  computed: {
    ...mapGetters("filter", {
      filterParams: "filterParams",
    }),

    ...mapState("me", {
      userID: (state) => state.user?.id,
    }),

    ...mapState("filter", {
      cachePlaces: (state) => state.cachePlaces,
    }),

    iconUrl() {
      return MapIcon;
    },

    iconSize() {
      return [this.iconWidth, this.iconHeight];
    },
  },

  mounted() {
    this.updateEventList();
    this.mapInterval = setInterval(() => {
      this.updateEventList();
    }, this.mapTimeout * 1000);
  },

  methods: {
    async updateEventList() {
      this.mapInfo = await api.map
        .getInfo(this.filterParams, this.userID)
        .then(({ data }) => data);
    },

    async onClickSelectPlace(placeID, eventCount) {
      if (eventCount === 1) {
        let singleEvent = await api.map
          .getByPlaceID(0, this.filterParams, placeID, this.userID)
          .then(({ data }) => data[0].id);
        if (this.mapSelectedPlace === singleEvent) {
          singleEvent = null;
        }

        this.mapSelectedPlace = this.singleEvent = singleEvent;
        return;
      }
      if (this.cachePlaces?.mapPlace === placeID)
        this.$store.dispatch("filter/SET_MAP_PLACE", null);
      else this.$store.dispatch("filter/SET_MAP_PLACE", placeID);
    },

    log_move(move) {
      return move;
    },
  },

  watch: {
    filterParams: {
      handler() {
        this.updateEventList();
      },
      deep: true,
    },
  },

  beforeUnmount() {
    clearInterval(this.mapInterval);
  },
};
</script>
