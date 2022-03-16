<template>
  <div style="height: 80vh; width: 100vw">
    <l-map
      :bounds="bounds"
      :maxBounds="maxBounds"
      :zoom="zoom"
      :minZoom="minZoom"
      :maxZoom="maxZoom"
      :zoomAnimation="true"
      :markerZoomAnimation="true"
      :center="center"
      @move="log_move('move')"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-polygon
        :lat-lngs="[poly_campus]"
        color="#41b782"
        :fill="true"
        :fillOpacity="0.8"
        fillColor="#41b782"
      />
      <l-marker
        :lat-lng="[43.027503, 131.889759]"
        @moveend="log_move('moveend')"
      >
        <l-icon
          :icon-anchor="staticAnchor"
          :popup-anchor="popupAnchor"
          :icon-size="iconSize"
          :icon-url="iconUrl"
        />
        <l-tooltip>{{ burgers.length }} events</l-tooltip>
        <l-popup>
          <div class="overflow-y-scroll max-h-80">
            <div
              v-for="b in burgers"
              :key="b"
              class="grid grid-cols-2 bg-blue-200 rounded-lg w-60 h-auto mx-4 overflow-hidden"
              @click="counter += 10"
            >
              <div class="col-span-2 justify-self-center">
                <img :src="b.img" class="w-full" />
              </div>
              <span class="col-span-1 text-center py-4">{{ b.title }}</span>
              <span class="col-span-1 text-center py-4">{{ b.price }} ₽</span>
              <!-- Пропагинация -->
              <button
                class="col-span-2 p-2 m-2 justify-self-end border-2 rounded-md border-green-400 cursor-pointer hover:bg-green-400 hover:border-opacity-0 active:bg-violet-500 hover:text-white"
                @click.stop="counter -= 20"
              >
                В корзину
              </button>
            </div>
          </div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<style>
.leaflet-control-container {
  display: none;
}
</style>

<script>
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
import MapIcon from "../assets/img/logo.svg";
import geojson from "../assets/json/geojson";

export default {
  name: "HelloWorld",
  components: {
    LMap,
    LTileLayer,
    LPolygon,
    LMarker,
    LTooltip,
    LPopup,
    LIcon,
  },
  props: {
    msg: String,
  },

  data() {
    return {
      filter: "",
      counter: 0,
      testObj: { title: "Title", price: 300 },
      burgers: [
        {
          title: "Big Tasty",
          price: 490,
          img: "https://macdonald-s.ru/wp-content/uploads/2021/02/makdonalds-big-tejsti.jpg",
        },
        {
          title: "Big Mac",
          price: 100,
          img: "https://macdonald-s.ru/wp-content/uploads/2021/02/makdonalds-big-tejsti.jpg",
        },
        {
          title: "Chiken Burger",
          price: 250,
          img: "https://macdonald-s.ru/wp-content/uploads/2021/02/makdonalds-big-tejsti.jpg",
        },
        {
          title: "Royal Mac",
          price: 290,
          img: "https://macdonald-s.ru/wp-content/uploads/2021/02/makdonalds-big-tejsti.jpg",
        },
        {
          title: "Happy Meal",
          price: 690,
          img: "https://macdonald-s.ru/wp-content/uploads/2021/02/makdonalds-big-tejsti.jpg",
        },
      ],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 15,
      minZoom: 15,
      maxZoom: 18,
      center: [43.027503, 131.889759],
      bounds: [
        [43.034866, 131.881141],
        [43.02, 131.912204],
      ],
      maxBounds: [
        [43.050454, 131.855313],
        [42.998232, 131.935496],
      ],
      popupAnchor: [0, -28],
      staticAnchor: [28, 56],
      iconWidth: 56,
      iconHeight: 56,
      poly_campus: geojson.FEFU_POLY,
    };
  },
  computed: {
    iconUrl() {
      return MapIcon;
    },
    iconSize() {
      return [this.iconWidth, this.iconHeight];
    },
  },
  methods: {
    log_move(move) {
      return move;
    },
  },
};
</script>
