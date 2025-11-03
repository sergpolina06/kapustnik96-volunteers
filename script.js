// 1️⃣ Вопросы для каждой команды
const teamQuestions = {
  "Волонтёры": [
    "Есть ли у тебя опыт волонтёрства на других мероприятиях? Если да, то расскажи нам об этом!",
    "Сможешь ли ты помогать на мероприятиях до Капустника (квиз 4 декабря с 18 до 22, шахматный турнир 3 декабря)?",
    "Сможешь ли ты помогать на самом Капустнике (5 декабря)?"
  ],
  "Информ": [
    "Есть ли опыт работы?",
    "В какой соцсети хотел бы работать больше (ВК/Телеграм)?"
  ],
  "Фотографы": [
    "Есть ли своя камера? Какая?",
    "Есть ли опыт в фотографии?",
    "Умеешь ли обрабатывать и в какой программе работаешь (Photoshop, Lightroom и т.д.)?",
    "Сможешь ли быть в день Капустника?",
    "Сможешь ли помогать до Капустника (по вечерам)?"
  ],
  "Гиды": ["Есть ли опыт работы гидом?"],
  "Работяги": [
    "Готов ли помогать в застройке/разборке сцены?",
    "Сможешь ли помогать в день Капустника?"
  ],
  "Охранники на Ночь Капустника": [
    "Готов ли помогать ночью с 5 на 6 декабря с 23 до 6?"
  ]
};

// 2️⃣ Элементы формы
const select = document.getElementById("departments");
const extraQuestionsDiv = document.getElementById("extra-questions");
const form = document.getElementById("volunteer-form");

// 3️⃣ Подгрузка динамических вопросов
select.addEventListener("change", () => {
  const selected = Array.from(select.selectedOptions).map(o => o.value);
  extraQuestionsDiv.innerHTML = ""; // очистка старых

  selected.forEach(team => {
    const title = document.createElement("h3");
    title.textContent = team;
    title.style.color = "#66001a";
    extraQuestionsDiv.appendChild(title);

    teamQuestions[team].forEach(question => {
      const label = document.createElement("label");
      label.textContent = question;

      const input = document.createElement("input");
      input.type = "text";
      input.name = `${team}_${question}`.replace(/[^\w]/g, "_");
      input.required = true;

      label.appendChild(input);
      extraQuestionsDiv.appendChild(label);
    });

    // Особое поле для фотографов: портфолио
    if (team === "Фотографы") {
      const label = document.createElement("label");
      label.textContent = "Ссылка на портфолио (если есть):";

      const input = document.createElement("input");
      input.type = "url";
      input.placeholder = "https://...";
      input.name = "Фотографы_портфолио";

      label.appendChild(input);
      extraQuestionsDiv.appendChild(label);
    }
  });
});

// 4️⃣ Отправка формы
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    alert("Пожалуйста, заполните все обязательные поля!");
    return;
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Собираем динамические вопросы
  const extraInputs = extraQuestionsDiv.querySelectorAll("input");
  const extraQuestions = {};
  extraInputs.forEach(input => {
    extraQuestions[input.name] = input.value;
  });
  data.extraQuestions = JSON.stringify(extraQuestions); // в Apps Script ожидаем JSON как строку

  // Преобразуем в URLSearchParams для обхода CORS/preflight
  const params = new URLSearchParams(data);

  fetch("https://script.google.com/macros/s/AKfycbw9mCsNX9aPHmJn8-v5NhFjk69-L9UW-kLuTJgZsmX9Dlvnq3ThqDNVqHYDbZas-4tn/exec", { // замените на URL вашего Web App
    method: "POST",
    body: params
  })
  .then(res => res.json())
  .then(response => {
    if(response.status === "success") {
      alert("Заявка успешно отправлена!");
      form.reset();
      extraQuestionsDiv.innerHTML = "";
    } else {
      alert("Ошибка отправки: " + JSON.stringify(response));
    }
  })
  .catch(err => {
    alert("Ошибка подключения: " + JSON.stringify(err));
  });
});
