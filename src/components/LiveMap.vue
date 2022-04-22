<template>
  <div>
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
        :key="place.id"
        :lat-lng="[place.latitude, place.longitude]"
        @click="onClickSelectPlace(place.id)"
        @moveend="log_move('moveend')"
      >
        <LIcon
          :icon-anchor="staticAnchor"
          :popup-anchor="popupAnchor"
          :icon-size="iconSize"
          :icon-url="iconUrl"
        />
        <LTooltip>{{ place.event_count }} events</LTooltip>
        <LPopup class="w-70">
          <div v-if="!isLoaded" class="flex items-center h-full py-5">
            <svg
              class="animate-spin h-12 w-12 text-primary mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-40"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="2"
              ></circle>
              <path
                class="opacity-80"
                stroke="currentColor"
                stroke-width="2"
                d="M4.85857 5C3.09032 6.80375 2 9.27455 2 12C2 17.5228 6.47715 22 12 22"
              />
            </svg>
          </div>
          <div v-else class="max-h-80 overflow-y-scroll">
            <div
              v-for="event in selectedPlaceEvents"
              :key="event"
              class="hover:bg-hoverColor cursor-pointer"
            >
              <EventBlock class="w-4/5 xl:px-4" :event="event" />
            </div>
          </div>
        </LPopup>
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
import { mapState } from "vuex";
import { EventBlock } from "@/components/template";
import {
  LMap,
  LTileLayer,
  LPolygon,
  LMarker,
  LTooltip,
  LPopup,
  LIcon,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import MapIcon from "@/assets/img/svg/logo.svg";
import geojson from "../assets/json/geojson";
import api from "@/service/api";

export default {
  name: "LiveMapComponent",
  components: {
    EventBlock,
    LMap,
    LTileLayer,
    LPolygon,
    LMarker,
    LTooltip,
    LPopup,
    LIcon,
  },

  data() {
    return {
      mapInterval: null,
      mapTimeout: 30,
      mapInfo: null,

      isLoaded: false,
      page: 1,
      selectedPlace: null,
      selectedPlaceEvents: [],

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

      popupAnchor: [0, -28],
      staticAnchor: [28, 56],
      iconWidth: 56,
      iconHeight: 56,
    };
  },

  computed: {
    ...mapState("filter", {
      filterParams: (state) => state,
    }),

    ...mapState("auth", {
      userID: (state) => state.user?.id,
    }),

    skip() {
      return 10 * this.page;
    },

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

    async onClickSelectPlace(placeID) {
      this.isLoaded = false;

      this.selectedPlace = placeID;
      this.selectedPlaceEvents = await api.map
        .getByPlaceID(0, this.filterParams, this.selectedPlace, this.user)
        .then(({ data }) => {
          this.isLoaded = true;
          return data;
        });
    },

    log_move(move) {
      return move;
    },
  },

  watch: {
    selectedPlace() {
      this.page = 1;
    },

    filterParams: {
      handler() {
        this.page = 1;
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
