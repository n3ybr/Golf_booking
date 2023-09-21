var currentDate = new Date();

$(document).ready(function() {
    var input = document.getElementById("guestInput");
    var awesomplete = new Awesomplete(input, {
        minChars: 1,
        maxItems: 3,
        autoFirst: true,
        item: function(text, input) {
            return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
        }
    });

    input.addEventListener("input", function() {
        $.ajax({
            url: "/get_guest_names", // Замените на фактический URL
            method: "GET",
            data: { input_text: input.value },
            success: function(data) {
                awesomplete.list = data.map(function(item) {
                    return item[3] +", "+item[1] + " " + item[2] +" "+item[0]; // Отображаем идентификатор в скобках
                });
            }
        });
    });

    // Обработка выбора элемента из выпадающего списка
    awesomplete.replace = function(text) {
        var selectedText = text.split(" (на: ")[0]; // Извлекаем фамилию
        var selectedId = text.split(",")[0]; // Извлекаем фамилию

        this.input.value = selectedText; // Устанавливаем фамилию в поле ввода
        window.location.href = `/protected/${selectedId}`; // Перенаправляем на нужную страницу
        this.close();
    };
});

function updateDates() {
  var divElements = document.querySelectorAll('.date_');

  divElements.forEach(function(div, index) {
    var newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + index);

    var day = newDate.getDate();
    var month = newDate.getMonth() + 1; // Месяцы в JavaScript начинаются с 0, поэтому добавляем 1
    var year = newDate.getFullYear();

    // Форматирование даты в формат "01.05.2023"
    var formattedDay = day < 10 ? "0" + day : day;
    var formattedMonth = month < 10 ? "0" + month : month;
    var formattedDate = formattedDay + "." + formattedMonth + "." + year;


    div.innerHTML = formattedDate
  });
}

updateDates();

document.getElementById('left').addEventListener('click', function() {
  currentDate.setDate(currentDate.getDate() - 1);
  updateDates();
});

document.getElementById('right').addEventListener('click', function() {
  currentDate.setDate(currentDate.getDate() + 1);
  updateDates();
});

document.addEventListener('DOMContentLoaded', function() {
    var clickableImage = document.querySelector('.dobavit');
    
    clickableImage.addEventListener('click', function() {
      window.location.href = 'calendar'; // Измените 'calendar.html' на нужный вам URL
    });
  });

const dates_nav = document.querySelectorAll('.date_');

dates_nav.forEach(date_nav => {
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                handleDateContentChange(date_nav);
            }
        }
    });

    observer.observe(date_nav, { childList: true });
});

// Глобальное объявление переменной place1

async function handleDateContentChange(date_nav) {
    const url = '/api/getbydate/';
    const checking_date = date_nav.textContent;
    const place1 = document.querySelectorAll('.' + date_nav.id);

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ dat: checking_date })
        });

        const myjson = await response.json();
        const data = myjson.variable;

        const all_times = [
            '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45',
            '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45',
            '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45',
            '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45',
            '17:00', '17:15', '17:30', '17:45'
        ]; // Оставьте ваши времена здесь.

        for (let x = 0; x < 36; x++) {
            const xxx = data[checking_date];

            if (Array.isArray(xxx[all_times[x]])) {
                const elements = xxx[all_times[x]].map(([id, name, status]) => {
                    let statusClass = '';

                    if (status === 'new') {
                        statusClass = 'new-status';
                    } else if (status === 'approve') {
                        statusClass = 'approve-status';
                    } else if (status === 'cancel') {
                        statusClass = 'cancel-status';
                    } else {
                        // Добавьте обработку других возможных значений status, если необходимо
                        statusText = 'Неизвестный статус';
                    }

                    return `<div class="bron_card ${statusClass}"><a href="/protected/${id}">${name}</a></div>`;
                });

                const elementHTML = elements.join('');
                place1[x].innerHTML = elementHTML;
            } else {
                place1[x].innerHTML = ' ';
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}






document.addEventListener('DOMContentLoaded', async function() {
    const dates_nav = document.querySelectorAll('.date_');

    dates_nav.forEach(date_nav => {
        const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    handleDateContentChange(date_nav);
                }
            }
        });

        observer.observe(date_nav, { childList: true });
        
        // Вызываем функцию при инициализации
        handleDateContentChange(date_nav);
    });
});

window.addEventListener('scroll', function() {
    var stickyElement = document.querySelector('.sticky-element');
    var scroll = window.scrollY;
  
    if (scroll >= 300) {
      stickyElement.classList.add('sticky');
    } else {
      stickyElement.classList.remove('sticky');
    }
  });
  

