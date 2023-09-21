$("#left1").on( "click", function() {
    boxes = document.querySelectorAll('.navdate1');
    for (i = 0; i < 7; i++)
    {
        date = new Date(boxes[i].textContent);
        date_m = new Date(date)
        date_m.setDate(date.getDate()-1);
        let text = date_m.toString();
        boxes[i].innerHTML =text.slice(4, 15);
        
        console.log(boxes[i].innerHTML)

    }
});
$("#right1").on( "click", function() {

    boxes2 = document.querySelectorAll('.navdate1');
    url ='/api/getbydate/'
    for (i = 0; i < 1; i++)
    {   
        date = new Date(boxes[i].textContent);
        date_m = new Date(date)
        date_m.setDate(date.getDate()+1);
        let text = date_m.toString();
        date_add = text.slice(4, 15)
        boxes2[i].innerHTML = date_add;
    }
});
const dates_nav2 = document.querySelectorAll('.navdate1');
dates_nav2.forEach(date_nav1 => {
    $(date_nav1).on('DOMSubtreeModified', function(){
        console.log(date_nav1, 'cc')
        var url = '/api/getbydate/'
        if (date_nav1.textContent != ''){
            var cheking_date = date_nav1.textContent;
            fetch(url,
                {
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({dat:cheking_date})
                })
                .then((response) => {
                    return response.json();
                })
                .then((myjson) => {
                    var data = myjson.variable

                    place1 = document.querySelectorAll('.'+date_nav1.id);            
                    for (x = 0; x < 36; x++)
                    {
                        console.log(data[cheking_date])
                        var xxx = data[cheking_date]
                        if (xxx[x][0] != undefined){
                            console.log(xxx[x].length)
                            if (xxx[x].length > 1){
                                more1 = []
                                for (y = 0; y < xxx[x].length; y++){
                                    more1.push('<a href="/admin/'+xxx[x][y][0] +'">'+xxx[x][y][2]+'</a>')
                                    console.log(more1)
                                    place1[x].innerHTML = more1
                                }
                            }
                            else{
                                place1[x].innerHTML = '<a href="/admin/'+xxx[x][0][0] +'">'+xxx[x][0][2]+'</a>'
                            }
                        }
                        else{
                            place1[x].innerHTML = ' '
                        }
                    }
                })
                console.log('end');
        }
    });
});

// Example POST method implementation:
function postData(url = "", data = {}) {
    fetch(url,
    {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
    })
    .then((response) => {
        return response.json();
    })
    .then((myjson) => {
        var get_data = myjson.variable
        console.log(get_data)
        return get_data
    })
};
