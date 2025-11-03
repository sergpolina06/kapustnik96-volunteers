// 1️⃣ Вопросы для каждой команды
const teamQuestions = {
  "Волонтёры": [
    "Есть ли у тебя опыт волонтёрства на других мероприятиях? Если да, то расскажи нам об этом!",
    "Сможешь ли ты помогать до Капустника с доставками? (Принимать/отвозить посылки)",
    "Сможешь ли ты помогать на шахматном турнире 3 декабря 18:30-21:00?",
    "Сможешь ли ты помогать на квизе 4 декабря с 18:00-22:00?",
    "Сможешь ли ты помогать на самом Капустнике 5 декабря?"
  ],
  "Информ": [
    "Есть ли опыт работы в этой сфере?",
    "Тебе больше интересна съемка видео или написание постов?"
  ],
  "Фотографы": [
    "Есть ли своя камера? Какая?",
    "Есть ли опыт в фотографии?",
    "Умеешь ли обрабатывать и в какой программе работаешь (Photoshop, Lightroom и т.д.)?",
    "Сможешь ли быть в день Капустника 5 декабря?",
    "Сможешь ли помогать до Капустника (по вечерам)?",
    "Ссылка на портфолио (если есть)"
  ],
  "Гиды": [
    "Хорошо ли ты ориентируешься на факультете? Сможешь ответить на вопросы делегатов?",
    "Сможешь ли ты помогать делегации на квизе 4 декабря?",
    "Сможешь ли ты помогать на самом Капустнике 5 декабря? (Приблизительная занятость: весь вечер + Капустник найт)"
  ],
  "Работяги": [
    "Есть ли у тебя машина/готов взять каршеринг?",
    "Готов ли ты помогать за день до Капустника? (Поздно вечером 4 декабря)",
    "Сможешь ли помогать на самом Капустнике 5 декабря?",
    "Место жительства (если не общежитие - напиши ближайшую станцию метро)"
  ],
  "Охранники на Ночь Капустника": [
    "Готов помогать в ночь с 5 на 6 декабря с 23:00 до 6:00?"
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

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    alert("Пожалуйста, заполните все обязательные поля!");
    return;
  }

  // 1️⃣ Берём все стандартные поля формы
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // 2️⃣ Добавляем динамические вопросы прямо в data
  const extraInputs = extraQuestionsDiv.querySelectorAll("input");
  extraInputs.forEach(input => {
    data[input.name] = input.value; // теперь каждый вопрос отдельное поле
  });

  // 3️⃣ Преобразуем в URLSearchParams для отправки
  const params = new URLSearchParams(data);

  fetch("https://script.google.com/macros/s/AKfycbxzl-idODLyVlV_Xo3wkJB3u9894iUmottrDC2DAma5Vrujr8sYlAlJMKtSU9K33AZg/exec", {
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
