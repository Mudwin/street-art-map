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
const filters = {
  districts: new Set(),
  festivals: new Set(),
  status: "Существует",
};

async function loadArtObjects() {
  try {
    const q = query(
      collection(db, "artObjects"),
      where("isApproved", "==", true)
    );

    const snapshot = await getDocs(q);
    clearMarkers();

    snapshot.forEach((doc) => {
      const art = { id: doc.id, ...doc.data() };
      createMarker(art);
    });

    initFilters();
  } catch (error) {
    console.error("Ошибка загрузки объектов:", error);
    alert("Не удалось загрузить данные с карты :(");
  }
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

  const markerData = {
    marker,
    element: markerElement,
    art,
  };

  map.addChild(marker);
  markers.push(markerData);

  return markerData;
}

function initFilters() {
  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      updateFilterSet(checkbox.name, checkbox.value, true);
    });

  document
    .querySelectorAll('.filters__content input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", handleFilterChange);
    });

  applyFilters();
}

function updateFilterSet(filterName, value, isChecked) {
  switch (filterName) {
    case "district":
      if (isChecked) {
        filters.districts.add(value);
      } else {
        filters.districts.delete(value);
      }
      break;

    case "festival":
      if (isChecked) {
        filters.festivals.add(value);
      } else {
        filters.festivals.delete(value);
      }
      break;

    case "status":
      if (isChecked) filters.status = value;
      break;
  }
}

function handleFilterChange(e) {
  const { name, value, checked } = e.target;

  if (name == "status") {
    if (checked) {
      document.querySelectorAll('input[name="status"]').forEach((checkbox) => {
        if (checkbox !== e.target) checkbox.checked = false;
      });

      updateFilterSet(name, value, true);
    } else {
      e.target.checked = true;
      return;
    }
  } else {
    updateFilterSet(name, value, checked);
  }

  applyFilters();
}

function applyFilters() {
  markers.forEach((markerData) => {
    const { art, element } = markerData;
    let visible = true;

    if (art.status !== filters.status) {
      visible = false;
    }

    if (visible) {
      if (filters.districts.size > 0) {
        visible = filters.districts.has(art.district);
      } else {
        visible = false;
      }
    }

    if (visible) {
      if (filters.festivals.size > 0) {
        visible = filters.festivals.has(art.festival);
      } else {
        visible = false;
      }
    }

    element.style.display = visible ? "" : "none";
  });
}

function clearMarkers() {
  markers.forEach(({ marker }) => {
    map.removeChilde(marker);
  });
  markers = [];
}

function openSidePanel(art) {
  document
    .querySelector("#card-img")
    .insertAdjacentHTML(
      "afterbegin",
      `<img src="${art.photoURL}" alt="Изображение объекта" crossorigin="anonymous">`
    );
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

  // const clickCallback = (object, event) => {
  //   try {
  //     if (object.type == "hotspot") {
  //       console.log("it is a hotspot");
  //     } else {
  //       console.log("is is something else???");
  //     }
  //   } catch (e) {
  //     console.log("it is an inactive area");
  //   }
  // };

  // // Объект-слушатель
  // const mapListener = new YMapListener({
  //   layer: "any",
  //   onClick: clickCallback,
  // });

  // map.addChild(mapListener);
}

new Navigation();
new Filters();

initMap();
