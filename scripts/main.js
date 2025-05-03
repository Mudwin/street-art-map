import Navigation from "./Navigation.js";
import Filters from "./Filters.js";

new Navigation();
new Filters();

initMap();

async function initMap() {
  await ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer } = ymaps3;

  // Иницилиазируем карту
  const map = new YMap(document.getElementById("map"), {
    location: {
      center: [60.603436, 56.838353],
      zoom: 15,
    },
    zoomRange: { min: 12, max: 20 },
  });

  // Добавляем слой для отображения схематической карты
  map.addChild(new YMapDefaultSchemeLayer());
  map.addChild(
    new YMapDefaultSchemeLayer({
      theme: "dark",
      customization: [
        {
          tags: {
            any: ["outdoor", "park", "cemetery", "medical"],
          },
          elements: "label",
          stylers: {
            visibility: "off",
          },
        },
        {
          tags: {
            any: "poi",
            none: ["outdoor", "park", "cemetery", "medical"],
          },
          stylers: {
            visibility: "off",
          },
        },
        {
          tags: {
            any: "road",
          },
          types: "point",
          stylers: {
            visibility: "off",
          },
        },
        {
          tags: {
            any: ["food_and_drink", "shopping", "commercial_services"],
          },
          stylers: {
            visibility: "off",
          },
        },
        {
          tags: {
            any: ["traffic_light"],
          },
          stylers: {
            visibility: "off",
          },
        },
        {
          tags: {
            any: ["entrance"],
          },
          stylers: {
            visibility: "off",
          },
        },
        {
          tags: {
            any: ["road"],
            none: [
              "road_1",
              "road_2",
              "road_3",
              "road_4",
              "road_5",
              "road_6",
              "road_7",
            ],
          },
          elements: "label.icon",
          stylers: {
            visibility: "off",
          },
        },
        {
          tags: {
            any: ["transit"],
          },
          stylers: {
            visibility: "off",
          },
        },
      ],
    })
  );
}
