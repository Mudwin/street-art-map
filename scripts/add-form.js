const form = document.forms["add-form"];
const submitButton = form.querySelector("#submit-button");
const messageContainer = document.querySelector("#form-message");

emailjs.init("Kaql03ntqTlT36CSZ");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  messageContainer.textContent = "";
  messageContainer.className = "form__message";

  if (!validateForm()) {
    return;
  }

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Отправка...";

    const formData = new FormData(form);
    const location = formData.get("location");
    const description = formData.get("description");
    const photoFile = formData.get("photo");

    const photoUrl = await uploadImageToImgBB(photoFile);

    await emailjs.send("service_4nmmf59", "template_nczbc6n", {
      location: location,
      description: description || "Нет дополнительной информации",
      photo: photoUrl,
    });

    messageContainer.textContent =
      "Ваше предложение отправлено на модерацию, спасибо!";
    messageContainer.classList.add("success");

    form.reset();
  } catch (error) {
    console.error("Ошибка отправки", error);
    messageContainer.textContent =
      "Произошла ошибка. Пожалуйста, попробуйте позже.";
    messageContainer.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Отправить";
  }
});

function validateForm() {
  let isValid = true;
  const locationInput = document.querySelector("#location");
  const photoInput = document.querySelector("#photo");
  const locationError = document.querySelector("#location-error");
  const photoError = document.querySelector("#photo-error");

  document.querySelectorAll(".form__error").forEach((elem) => {
    elem.textContent = "";
  });

  if (!locationInput.value.trim()) {
    locationError.textContent = "Пожалуйста, укажите местоположение объекта";
    isValid = false;
  }

  if (!photoInput.files.length) {
    photoError.textContent = "Пожалуйста, загрузите фото объекта";
    isValid = false;
  } else {
    const file = photoInput.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      photoError.textContent = "Неправильный тип изображения";
      isValid = false;
    }

    if (file.size > 5 * 1024 * 1024) {
      photoError.textContent =
        "Слишком большое изображение, максимальный размер: 5 МБ";
      isValid = false;
    }
  }

  return isValid;
}

async function uploadImageToImgBB(file) {
  const apiKey = "f0d4e5c0ed419895dae221023d3de695";
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error("Не удалось загрузить изображение");
  }

  return data.data.url;
}
