ymaps.ready(init);

function init() {
  const map = new ymaps.Map("map", {
    center: [56.838281, 60.603365],
    zoom: 15,
    controls: [],
  });

  var myPlacemark = new ymaps.Placemark([56.838281, 60.603365], {
    balloonContentHeader: "Заголовок",
    balloonContentBody: "Тело",
    balloonContentFooter: "Футер",
    hintContent: "Тест",
  });

  map.geoObjects.add(myPlacemark);

  setMapLayer(map, "dark");
}

// Изменение темы карты
// --------------------------------------------------------
function setMapLayer(map, map_type) {
  const MAP = "custom#" + map_type;
  ymaps.layer.storage.add(MAP, function mapLayer() {
    return new ymaps.Layer(
      "https://core-renderer-tiles.maps.yandex.net/tiles?l=map" +
        (map_type == "dark" ? "&theme=dark" : "") +
        "&%c&%l"
    );
  });
  ymaps.mapType.storage.add(MAP, new ymaps.MapType(map_type, [MAP]));
  map.setType(MAP);
}
