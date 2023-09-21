// Получение элементов модального окна и кнопок
var modal = document.getElementById("dateModal");
var openModalBtn = document.getElementById("openDateBtn");
var closeModalBtn = document.getElementById("closeDateBtn");

// Обработчик открытия модального окна
openModalBtn.onclick = function () {
    modal.style.display = "block";
};

// Обработчик закрытия модального окна
closeModalBtn.onclick = function () {
    modal.style.display = "none";
};

// Закрыть модальное окно при клике вне его области
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
async function senddisabled(dateText) {  
    var send_dats = $.ajax({
        type:"POST",
        url:"/api/disable/",
        data: {
            'dates':dateText
          },
    })
    return send_dats
}; 


async function doSomething() {
    try {
        const dates_req = await $.ajax({
            type: "GET",
            url: "/api/disable/",
        });
        console.log("Disabled dates request sent successfully");
        return dates_req;
    } catch (error) {
        console.error("Error sending disabled dates request:", error);
        throw error;
    }
}

$(document).ready(function () {
    try {
        var datesArray = doSomething(); // Получить данные о доступных и недоступных датах


        $('#datePicker').multiDatesPicker({
            dateFormat: 'dd.mm.yy',
            beforeShowDay: function (date) {
                var string1 = $.datepicker.formatDate('dd.mm.yy', date);
                var index = $.inArray(string1, datesArray);
                return [index === -1, ''];
            },
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            firstDay: 1 // Начало недели с понедельника
        });
    } catch (error) {
        console.error("Error:", error);
    }
});

$(document).ready(function() {
    // Function to show a custom notification
    function showNotification(message) {
        // You can customize this function to display a notification
        alert(message); // For simplicity, using an alert here
    }

    // Function to close the date modal
    function closeDateModal() {
        $('#dateModal').hide();
    }

    // Event handler for the "Отключить даты" button
    $('#send_disable').click(function() {
        // Assuming some action is taken to disable dates here
        senddisabled(document.getElementById("datePicker").value)

        // Show a notification message
        showNotification("Даты успешно отключены");

        // Close the modal
        closeDateModal();
    });

    // Event handler for closing the modal using the close button
    $('#closeDateBtn').click(function() {
        closeDateModal();
    });
});