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

async function sendUpdates(status,id) {
    try {
        await $.ajax({
            type: "POST",
            url: "/api/update_book/",
            data: {
              "status": status,
              "id": id,
            },
          });
    } catch (error) {
        console.error("Error sending updates request:", error);
    }
};



async function commToServer(formattedDateTime, currentUserName, commentText, digitsOnly){

    try {
        await $.ajax({
            type: "POST",
            url: "/api/post_comments/",
            data: {
              "comm_id": digitsOnly,
              "user_id": currentUserName,
              "text": commentText,
              "datetime": formattedDateTime,
            },
          });
    } catch (error) {
        console.error("Error sending updates request:", error);
    }
};

$("#save").on( "click", function() {
    var id = document.getElementById("book-id").textContent;
    var book_id = parseInt(id.replace(/\D+/g,""));

    var selected_status = document.getElementById("status").value;
    sendUpdates(selected_status,book_id);
});

$("#addcomm").on( "click", function() {
    // Получить текст из текстового поля
    var commentText = document.getElementById("myTextarea").value;

    if (commentText.trim() === "") {
        alert("Введите текст комментария");
        return;
    }

    // Получить текущую дату и время
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    var month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
    var day = currentTime.getDate().toString().padStart(2, '0');
    var hours = currentTime.getHours().toString().padStart(2, '0');
    var minutes = currentTime.getMinutes().toString().padStart(2, '0');

    // Форматировать дату и время в строку (например, "05-09-2023 17:45")
    var formattedDateTime = day + '-' + month + '-' + year + ' ' + hours + ':' + minutes;

    // Получить имя текущего пользователя (замените на фактическую логику получения имени)
    var currentUserName = document.getElementById("userr_name").textContent

    // Создать текст комментария с датой, временем и именем пользователя
    var commentWithDateTimeAndUser = formattedDateTime + ' - <span style="color: blue;">' + currentUserName + ': </span>' + commentText;
    var bookId = document.getElementById("book-id").textContent;
    var digitsOnly = bookId.match(/\d+/g).join('');

    commToServer(formattedDateTime, currentUserName, commentText, digitsOnly)

    // Создать новый элемент div с классом "comemt-3" и текстом комментария
    var commentDiv = document.createElement("div");
    commentDiv.className = "comemt-3";
    commentDiv.innerHTML = commentWithDateTimeAndUser;

    // Добавить созданный комментарий в контейнер для комментариев
    var commentsContainer = document.getElementById("comments-container");
    commentsContainer.appendChild(commentDiv);

    // Очистить текстовое поле после создания комментария
    document.getElementById("myTextarea").value = "";
    
});

