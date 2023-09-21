const Booking = {
  init(select_date, select_time, id_divtime, prime_name,prime_phone,prime_email,is_member,guest_count,name1,name2,name3,is_car,is_eltel,is_tel,is_bag,comment,summa) {
      this.date = select_date
      this.time = select_time
      this.time_id = id_divtime
      this.name = prime_name
      this.phone = prime_phone
      this.email = prime_email
      this.member = is_member      
      this.g_count = guest_count
      this.guest1 = name1
      this.guest2 = name2
      this.guest3 = name3
      this.car = is_car
      this.el_tel = is_eltel
      this.tel = is_tel
      this.bag = is_bag
      this.comm = comment
      this.price = summa
      return this
  }
}

const windowInnerWidth = window.innerWidth
const windowInnerHeight = window.innerHeight
var txt = ' ';
var dateObject = ' '

if ($(window).width() < 960) {
  var target = document.querySelectorAll('.container');  
  
  var container = $(target).css(
      {width: '100%'});
  console.log(container)

  var target2 = document.querySelectorAll('.form-check-input-pull-right');
  var container2 = Array.from(target2);
  
  container2.forEach(function (element2) {
    element2.style.height = "24px";
    element2.style.marginBottom = "4px"; // Используем стандартное свойство marginBottom
  });
  
  console.log(container2);
  var target3 = document.querySelectorAll('.form-check-label-pull-right');
  var container3 = Array.from(target3);
  
  container3.forEach(function (element3) {
    element3.style.height = "34px";
  });
  
  console.log(container3);
  
  var target4 = document.querySelectorAll('.form-check-c');
  var container4 = Array.from(target4);
  
  container4.forEach(function (element4) {
    element4.style.padding = "5%";

  });
  
  console.log(container4);
  



}

$.datepicker.regional['ru'] = {
  closeText: 'Закрыть',
  prevText: 'Предыдущий',
  nextText: 'Следующий',
  currentText: 'Сегодня',
  monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
  monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
  dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
  dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
  dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
  weekHeader: 'Не',
  dateFormat: 'dd.mm.yy',
  firstDay: 1,
  isRTL: false,
  showMonthAfterYear: false,
  yearSuffix: ''
};
$.datepicker.setDefaults($.datepicker.regional['ru']);


async function getDisabledDates() {
  try {
    const dates_req = await $.ajax({
      type: "GET",
      url: "/api/disable/",
    });

    var currentDate = new Date(); // Get the current date

    while (dates_req.includes(formatDate(currentDate))) {
      // If the current date is in dates_req, increment the date by 1 day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    var formattedDate = formatDate(currentDate); // Format the date as 'dd.mm.yy'

    // Set the input field's value to the current date
    $('#datepicker').val(formattedDate);

    gettimes(formattedDate);

    console.log("Disabled dates request sent successfully");
    return dates_req;
  } catch (error) {
    console.error("Error sending disabled dates request:", error);
    throw error; // Rethrow the error to propagate it if needed
  }
}


async function sendSelectedTime(txt,txt_id){
  await $.ajax({
    type: "POST",
    url: "/api/gettime/",
    data: {
      "time": txt,
      "time_id": txt_id
    },
  });
};

function formatDate(date) {
  var day = date.getDate().toString().padStart(2, '0');
  var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
  var year = date.getFullYear().toString(); // Taking the last two digits of the year

  return day + '.' + month + '.' + year;
}

// Example usage:




async function gettimes(date) {
  try {
    var selected_date = date;

    const response = await fetch(`/api/sendavalible/?selected_date=${selected_date}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const myjson = await response.json();
    const get_data = myjson.variable;
    const picktime = $("#picktime");

    for (const item of get_data) {
      picktime.append(item);
    }

    const boxes = document.querySelectorAll('.col-elem');

    boxes.forEach(box => {
      box.addEventListener('click', async function handleClick(event) {
        const contentPanelId = jQuery(this).attr("id");
    
        if (!$(box).hasClass('active')) {
          // Устанавливаем стили для активного элемента
          $(box).addClass('active');
          $(box).css({
            position: "absolute",
            height: "70px"
          });
        } else {
          // Возвращаем элементу исходные стили и убираем класс "active"
          $(box).removeClass('active');
          $(box).css({
            position: "static",
            height: "47px",
            background: "blue"
          });
          window.txt_id = contentPanelId;
          console.log(txt_id);
          window.txt = $(box).text();
          console.log(txt);

          sendSelectedTime(txt, txt_id);
        }
    
        // Сбрасываем стили для остальных элементов
        boxes.forEach(otherBox => {
          if (otherBox !== box) {
            $(otherBox).removeClass('active');
            $(otherBox).css({
              position: "static",
              height: "47px",
              background: "#009A06"
            });
          }
        });

    
        const itogElement = document.getElementById('timeitog');
        itogElement.innerHTML = txt + ' ' + $('#datepicker').val();
    
        document.getElementById("radio3").disabled = false;
        document.getElementById("radio2").disabled = false;
        document.getElementById("radio1").disabled = false;
    
        if (contentPanelId === "2") {
          document.getElementById("radio3").disabled = true;
          document.getElementById("radio2").disabled = true;
        } else if (contentPanelId === "3") {
          document.getElementById("radio3").disabled = true;
          document.getElementById("radio2").disabled = true;
          document.getElementById("radio1").disabled = true;
        } else if (contentPanelId === "1") {
          document.getElementById("radio3").disabled = true;
        }
      });
    });
    
    
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};





async function sendBooking(create_booking) {
  try {
    await $.ajax({
      type: "POST",
      url: "/api/getbook/",
      data: {
        'date': create_booking.date,
        'time': create_booking.time,
        "time_id": create_booking.time_id,
        'p_name': create_booking.name,
        'p_phone': create_booking.phone,
        'p_email': create_booking.email,
        'is_member': create_booking.member,
        'count': create_booking.g_count,
        'g1': create_booking.guest1,
        'g2': create_booking.guest2,
        'g3': create_booking.guest3,
        'is_car': create_booking.car,
        'is_eltel': create_booking.el_tel,
        'is_tel': create_booking.tel,
        'is_bag': create_booking.bag,
        'comment': create_booking.comm,
        'summ': create_booking.price,
        'is_member':create_booking.is_member,
      },
    });
    console.log("Booking request sent successfully");
  } catch (error) {
    console.error("Error sending booking request:", error);
  }
};

async function sendDate(dateObject) {

  try {
    date = await $.ajax({
      type:"POST",
      url:"/api/getdate/",
      data: {"date":dateObject},
    })
    console.log("date select request sent successfully");
  } catch (error) {
    console.error("Error sending date select request:", error);
  }
  return date
};


$(function(){
  (async () => {
    try {
      const dates = await getDisabledDates();
      // Обработка данных
      console.log(dates);


      $("#datepicker").datepicker({
        beforeShowDay: function(date) {
          var string = jQuery.datepicker.formatDate('dd.mm.yy', date);
          return [dates.indexOf(string) == -1];
        },
        beforeShow: function(input, inst) {
          var dp = $(inst.dpDiv);
          var offset = $(input).outerWidth(true) - dp.outerWidth(true);
          dp.css('margin-right', offset);
        },
        onSelect: function() {
          if (document.querySelectorAll('.col-elem') != null) {
            $(document.querySelectorAll('.col-elem')).remove();
            $(document.querySelectorAll('.col')).remove();
          }
          var nonformdate = $(this).datepicker('getDate');
          // Исходная дата

          // Получение дня, месяца и года
          var day = nonformdate.getDate();
          var month = nonformdate.getMonth() + 1; // Месяцы в JavaScript начинаются с 0, поэтому добавляем 1
          var year = nonformdate.getFullYear();

          // Форматирование даты в формат "01.05.2023"
          var formattedDay = day < 10 ? "0" + day : day;
          var formattedMonth = month < 10 ? "0" + month : month;
          var formattedDate = formattedDay + "." + formattedMonth + "." + year;

          console.log(formattedDate); // Вывод: "05.09.2023"

          
          var dateObject = formattedDate;
          var date = sendDate(dateObject);
          if (date != '') {
            var avalible = gettimes(dateObject);
            return avalible;
          }
          console.log(windowInnerWidth);

          return date;
        }
      });
    } catch (error) {
      // Обработка ошибок
      console.error(error);
    }
  })();
});

$("#button_post").on( "click", function() {
  console.log(txt)
  if (txt != ' '){
    $(document).ready(function() {
      $("#myForm").validate({
        rules: {
          prime_name : {
            required: true,
            minlength: 3
          },
          prime_phone: {
            required: true
          },
          prime_email: {
            required: true,
            email: true
          },
        },
        messages : {
          prime_name: {
            required: "Имя должно быть не менее 3 символов",
            minlength: "Имя должно быть не менее 3 символов"
            
          },
          prime_phone: {
            required: "Пожалуйста, введите корректный номер телефона",
            number: "Пожалуйста, введите корректный номер телефона",
          },
          prime_email: {
            required: "Электронная почта должна быть в формате: abc@domain.tld",
            email: "Электронная почта должна быть в формате: abc@domain.tld"
          }
        }
      });
    });
    if ($("#myForm").valid() == true){
      const create_booking = Object.create(Booking)
      var select_date =  document.getElementById("datepicker").value;
      var prime_name = document.getElementById("prime_name").value;
      var prime_phone = document.getElementById("prime_phone").value; 
      var prime_email = document.getElementById("prime_email").value;
      var is_member = false;
      var select_time =  txt;
      //var id_divtime = '#'+contentPanelId;
      console.log(txt_id)
      var id_divtime = txt_id;
    
      guest_count = $("input[name='radioGroup']:checked").val();
      console.log(guest_count);
      if (guest_count == '3'){
        var name1 = document.getElementById("name1").value;
        var name2 = document.getElementById("name2").value;
        var name3 = document.getElementById("name3").value;
      }
      else if (guest_count == '2'){
        var name1 = document.getElementById("name1").value;
        var name2 = document.getElementById("name2").value;
        var name3 =' ';
      }
      else if (guest_count == '1'){
        var name1 = document.getElementById("name1").value;
        var name2 = ' ';
        var name3 = ' ';
      }
      var is_car = document.getElementById('oborudcheck1').value;
      var is_eltel = document.getElementById('oborudcheck2').value;
      var is_bag = document.getElementById('oborudcheck3').value;
      var is_tel = document.getElementById('oborudcheck4').value;
      console.log(is_tel);
      var comment = document.getElementById("comment").value;
      var summa = totalPrice;
      var is_member = false;
    
    
      
      create_booking.init(select_date, select_time, id_divtime, prime_name,prime_phone,prime_email,is_member,guest_count,name1,name2,name3,is_car,is_eltel,is_tel,is_bag,comment,summa)
      sendBooking(create_booking)

      console.log(Object.values(create_booking));
    }
    else{
      console.log('adasdada')
      return false
    }
  }
  else{
    alert('Выберите дату');
  }; 

});
 
$(document).ready(function () {
  $('input[type="radio"], input[type="number"]').on('change', calculateTotal);

  function calculateTotal(discout) {
    const basePrice = 1000; // Фиксированная цена для одного гостя
    const additionalGuests = parseInt($('input[name="radioGroup"]:checked').val()) || 0;

    // Обновленный расчет стоимости оборудования
    const equipment1Count = parseInt($('#oborudcheck1').val()) || 0;
    const equipment2Count = parseInt($('#oborudcheck2').val()) || 0;
    const equipment3Count = parseInt($('#oborudcheck3').val()) || 0;
    const equipment4Count = parseInt($('#oborudcheck4').val()) || 0;

    const equipmentCost = calculateEquipmentCost(equipment1Count, equipment2Count, equipment3Count, equipment4Count);
    const guestCost = additionalGuests * basePrice;
    if (discout == true) {
      discount_percent = 0.8; // Применить скидку 20%
    } else {
      discount_percent = 1; // Без скидки
    }

    window.totalPrice = (basePrice + guestCost + equipmentCost) * discount_percent + ' ₽';
    $('#button_post').text("Забронировать " + totalPrice);
}

function calculateEquipmentCost(count1, count2, count3, count4) {
    const equipmentPrices = {
        "item1": 200,
        "item2": 300,
        "item3": 250,
        "item4": 150
        // Другие предметы оборудования и их стоимость
    };

    let equipmentCost = 0;

    equipmentCost += count1 * equipmentPrices["item1"];
    equipmentCost += count2 * equipmentPrices["item2"];
    equipmentCost += count3 * equipmentPrices["item3"];
    equipmentCost += count4 * equipmentPrices["item4"];

    return equipmentCost;
}

  // Вызываем calculateTotal() при загрузке страницы, чтобы установить начальное значение
  $('#prime_phone').on('input', function() {
    var phoneNumber = $(this).val();
    $.ajax({
        url: 'api/check_phone/',
        method: 'POST',
        data: { phone_number: phoneNumber },
        success: function(response) {
            if (response.found) {
                $('#discountMessage').show();
                window.discout = true
                calculateTotal(discout);

            } else {
                $('#discountMessage').hide();
                window.discout = false
                  calculateTotal(discout);


            }
        }
    });
});

});




document.addEventListener('DOMContentLoaded', function() {
  const inputContainer = document.getElementById('placetoadd');
  const radioButtons = document.querySelectorAll('input[name="radioGroup"]');

  radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function() {
      inputContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых полей
      
      const numInputs = parseInt(this.value);
      
      for (let i = 1; i <= numInputs; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-group-1';
        input.id =  `name${i}`;
        input.placeholder = `ФИО члена команды ${i}`;
        inputContainer.appendChild(input);
      }
    });
  });
});


