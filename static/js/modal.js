// Получение элементов модального окна и кнопок
var umodal = document.getElementById("userModal");
var uopenModalBtn = document.getElementById("openUserBtn");
var ucloseModalBtn = document.getElementById("closeUserBtn");

// Обработчик открытия модального окна
uopenModalBtn.onclick = function () {
    umodal.style.display = "block";
};

// Обработчик закрытия модального окна
ucloseModalBtn.onclick = function () {
    umodal.style.display = "none";
};

// Закрыть модальное окно при клике вне его области
window.onclick = function (event) {
    if (event.target == umodal) {
        umodal.style.display = "none";
    }
};
