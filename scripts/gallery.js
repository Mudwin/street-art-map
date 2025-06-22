import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const galleryElement = document.querySelector(".gallery__container");

async function loadGallery() {
  try {
    const q = query(
      collection(db, "artObjects"),
      where("isApproved", "==", true)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const art = { id: doc.id, ...doc.data() };

      const artImage = `
      <div class="gallery__item">
        <img src="${art.photoURL}" alt="${art.title}" loading="lazy">
        <div class="gallery__info">
          <div class="gallery__info-content">
            <div class="gallery__info-title">
              ${art.title}
            </div>
            <div class="gallery__info-subtitle">${art.district} район</div>
          </div>
        </div>
      </div>`;

      galleryElement.innerHTML += artImage;

      const galleryInfoContainers = document.querySelectorAll(
        ".gallery__info-content"
      );

      galleryInfoContainers.forEach((container) => {
        if (container.offsetHeight < 60) {
          container.querySelector(".gallery__info-title").style.fontSize =
            "20px";
        }

        if (container.offsetHeight > 112) {
          container.querySelector(".gallery__info-title").style.fontSize =
            "12px";
        }
      });
    });
  } catch (error) {
    console.error("Ошибка загрузки объектов:", error);
    alert("Не удалось загрузить данные с карты :(");
  }
}

loadGallery();
