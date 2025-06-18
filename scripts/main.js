import Navigation from "./Navigation.js";
import Filters from "./Filters.js";
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

let map;
let markers = [];

async function loadArtObjects() {
  try {
    const q = query(
      collection(db, "artObjects"),
      where("isApproved", "==", true)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const art = { id: doc.id, ...doc.data() };
      createMarker(art);
    });
  } catch (error) {
    console.error("Ошибка загрузки объектов:", error);
    alert("Не удалось загрузить данные с карты :(");
  }
}

function createMarker(art) {
  const markerElement = createMarkerElement();
  const marker = new ymaps3.YMapMarker(
    {
      coordinates: [art.coords._long, art.coords._lat],
    },
    markerElement
  );

  markerElement.addEventListener("click", () => {
    openSidePanel(art);
  });

  map.addChild(marker);
  markers.push(marker);
}

function createMarkerElement() {
  const markerContainerElement = document.createElement("div");
  markerContainerElement.classList.add("marker-container");

  const markerElement = document.createElement("div");
  markerElement.classList.add("marker");

  const markerImage = document.createElement("img");
  markerImage.src = "./icons/pin.svg";
  markerImage.classList.add("image");
  markerImage.alt = "Маркер";

  markerElement.appendChild(markerImage);
  markerContainerElement.appendChild(markerElement);

  return markerContainerElement;
}

function openSidePanel(art) {
  document.querySelector("#card-title").textContent = art.title;
  document.querySelector("#card-author").textContent = art.author;
  document.querySelector("#card-festival").textContent = art.festival;
  document.querySelector("#card-status").textContent = art.status;
  document.querySelector(
    "#card-coords"
  ).textContent = `${art.coords._lat}, ${art.coords._long}`;

  document.querySelector("#card").classList.remove("is-closed");
  document.querySelector(".filters__open-button").classList.add("is-opened");

  if (!document.querySelector(".filters").classList.contains("is-closed")) {
    document.querySelector(".filters").classList.add("is-closed");
  }

  document.querySelector("#card-close-button").addEventListener("click", () => {
    closeSidePanel();
  });
}

function closeSidePanel() {
  document.querySelector("#card").classList.add("is-closed");
  document.querySelector(".filters__open-button").classList.remove("is-opened");
}

new Navigation();
new Filters();

initMap();

async function initMap() {
  await ymaps3.ready;

  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapListener,
    YMapMarker,
  } = ymaps3;

  // Инициализация карты
  map = new YMap(document.getElementById("map"), {
    location: {
      center: [60.603436, 56.838353],
      zoom: 15,
    },
    zoomRange: { min: 12, max: 20 },
    mode: "vector",
  });

  // Слой для отображения схематической карты
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

  map.addChild(new YMapDefaultFeaturesLayer({}));

  loadArtObjects();

  // --------------------------------------------------------------------

  const clickCallback = (object, event) => {
    try {
      if (object.type == "hotspot") {
        console.log("it is a hotspot");
      } else {
        console.log("is is something else???");
      }
    } catch (e) {
      console.log("it is an inactive area");
    }
  };

  // Объект-слушатель
  const mapListener = new YMapListener({
    layer: "any",
    onClick: clickCallback,
  });

  map.addChild(mapListener);
}
