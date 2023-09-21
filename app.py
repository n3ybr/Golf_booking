import psycopg2
from flask import Flask, render_template, request, url_for, redirect,jsonify
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import date, time, datetime,timedelta
import flask_login

from sqlalchemy.sql import func 
import logging
import random





logging.basicConfig(level=logging.DEBUG, filename='1ap.log', format='%(asctime)s - %(levelname)s - %(message)s')




app = Flask(__name__)

app.secret_key = 'Qazwsx12'  # Change this!

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://zxc:Qazwsx12@127.0.0.1:5432/flask_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning

db = SQLAlchemy(app)
migrate = Migrate(app, db)

def get_db_connection():
    conn = psycopg2.connect(
    host="127.0.0.1",
    port="5432",
    database="flask_db",
    user='zxc',
    password='Qazwsx12')
    return conn

def new_user(name, passw):
    # Генерация случайного целого числа между 1 и 100
    random_number = random.randint(1, 100)
    conn = get_db_connection()
    cur = conn.cursor()

    # Execute a command: this creates a new table
    cur.execute('INSERT INTO users (id,name, pass)'
                'VALUES (%s, %s, %s);',
                (random_number, name, passw))

    conn.commit()
    cur.close()
    conn.close()
def get_user_db():
    userrs_to=[]
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT  name, pass FROM users;")
    users_ok = cur.fetchall()
    for us in users_ok:
        userrs_to.append({us[0]:{'password':us[1]}})
    return userrs_to

login_manager = flask_login.LoginManager()

login_manager.init_app(app)
users = get_user_db()
print(users)

class User(flask_login.UserMixin):
    pass


@login_manager.user_loader
def user_loader(email):
    for ck_user in users:
        print(ck_user)
        if ck_user.get(email) != None:
            user = User()
            user.id = email
            print(user.id)

            return user


@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    for ck_user1 in users:
        print(ck_user1)
        if ck_user1.get(email) != None:
            user = User()
            user.id = email

            return user



class Comment(db.Model):
    __tablename__ = 'comments'

    comm_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Text)
    text = db.Column(db.Text)
    datetime = db.Column(db.Text)
    book_id = db.Column(db.Integer)

    def __init__(self, user_id, text, datetime, book_id):
        self.user_id = user_id
        self.text = text
        self.datetime = datetime
        self.book_id = book_id


    def __repr__(self):
        return f'<Comment(comm_id={self.comm_id}, user_id={self.user_id}, text={self.text}, datetime={self.datetime},book_id={self.book_id})>'


class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Text, nullable=False )
    p_name = db.Column(db.Text, nullable=False)
    p_phone = db.Column(db.Text, nullable=False)
    p_email = db.Column(db.Text, nullable=False)
    is_member = db.Column(db.Boolean, nullable=False)
    count = db.Column(db.Integer)
    guest1 = db.Column(db.Text)
    guest2 = db.Column(db.Text)
    guest3 = db.Column(db.Text)
    car_c = db.Column(db.Integer, nullable=False)
    eltel_c = db.Column(db.Integer, nullable=False)
    tel_c = db.Column(db.Integer, nullable=False)
    bag_c = db.Column(db.Integer, nullable=False)
    comm = db.Column(db.Text)
    price = db.Column(db.Integer, nullable=False)
    time = db.Column(db.Text)
    id_time = db.Column(db.Text)
    status = db.Column(db.Text)
    def __repr__(self):
        return f'<Test {self.p_name}>'
    
class AvalTime(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Text, nullable=False)
    time = db.Column(db.Text, nullable=False)
    val = db.Column(db.Integer, nullable=False)


class Guest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    last_name = db.Column(db.String(100), nullable=False)

def getbyid(student_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT  * FROM test WHERE id="+"'"+str(student_id)+"'"+";")
    unavalible = cur.fetchall()
    class Get():
        id = unavalible[0][0]
        date = unavalible[0][1]
        p_name = unavalible[0][2]
        p_phone = unavalible[0][3]
        p_email = unavalible[0][4]
        is_member = unavalible[0][5]
        count = unavalible[0][6]
        guest1 = unavalible[0][7]
        guest2 = unavalible[0][8]
        guest3 = unavalible[0][9]
        comm = unavalible[0][10]
        price = unavalible[0][11]
        time = unavalible[0][12]
        status = unavalible[0][14]
        car_c = unavalible[0][15]
        eltel_c = unavalible[0][16]
        tel_c = unavalible[0][17]
        bag_c = unavalible[0][18]

        def __repr__(self):
            return f'<Get {self.p_name}>'
    cur.close()
    conn.close()
    return Get




@app.route('/')
def redirect_main():
    return redirect("/calendar", code=302)

from datetime import datetime

def get_from_db(date):
    all_times = [
        '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45',
        '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45',
        '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45',
        '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45',
        '17:00', '17:15', '17:30', '17:45'
    ]

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT time, id, p_name, status FROM test WHERE date = %s;", (date,))
    results = cur.fetchall()
    cur.close()
    conn.close()

    data = {}
    for time in all_times:
        data[time] = []

    for row in results:
        db_time, id, p_name, status = row
        db_time = datetime.strptime(db_time, '%H:%M').time()
        for time in all_times:
            if db_time == datetime.strptime(time, '%H:%M').time():
                data[time].append((id, p_name, status))

    return data



def get_from_db_2(date):
    all_times = ['9:00','9:15','9:30','9:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45']
    
    conn = get_db_connection()
    cur = conn.cursor()

    result = []

    for time in all_times:
        cur.execute("SELECT * FROM test WHERE date = %s AND time = %s;", (date, time))
        unavalible = cur.fetchall()
        
        if not unavalible:
            result.append({time: ' '})
        else:
            result.extend(unavalible)
    
    cur.close()
    conn.close()
    
    return result


def disable_to_db(disabled_dates):
    conn = get_db_connection()
    cur = conn.cursor()
    print(disabled_dates)
    for i in disabled_dates:
            print(i)
            cur.execute("INSERT INTO date_disabled VALUES ('"+i+"', true);")
    conn.commit()
            
    cur.close()
    conn.close()

def disable_from_db():
    itog_disable =[]
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT date FROM date_disabled;")
    dates_to_dis = cur.fetchall()
    cur.close()
    conn.close()
    for date in dates_to_dis:
        itog_disable.append(date[0])
    return itog_disable
# ...

def check_is_member(check_p):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM members;")
    members = cur.fetchall()
    cur.close()
    conn.close()
    for member in members:
        if check_p in member:
            return True
    return False
    
@app.route('/calendar', methods=('GET', 'POST'))
def calendar():
    return render_template('snippets.html')

@app.route('/api/gettime/', methods=('GET', 'POST'))
def gettime():
    global selected_time
    if request.method == 'POST':
        selected_time = request.form.get('time')
        return selected_time,204
    if request.method == 'GET':
        data = { 
                "time":selected_time
            }
        return jsonify(data)
    


@app.route('/api/getdate/', methods=('GET', 'POST'))
def getdate():
    if request.method == 'POST':
        selected_date = request.form.get('date')
        return selected_date
@app.route('/get_guest_names', methods=['GET'])
def get_guest_names():
    input_text = request.args.get('input_text', '')
    guest_names = Test.query.filter(Test.p_name.ilike(f'%{input_text}%')).all()
    guest_names = [(guest.date, guest.p_name,guest.time, guest.id) for guest in guest_names]
    return jsonify(guest_names)


@app.route('/api/update_book/', methods=('GET', 'POST'))
def updateBook():
    status = request.form.get('status')
    book_id = request.form.get('id')
    updateToDB(status,book_id)
    return ' ', 200

def updateToDB(status,book_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("UPDATE test SET status = %s WHERE id = %s;",(status,book_id))
        conn.commit()     
        cur.close()
        conn.close()
    except psycopg2.OperationalError as e:
        logging.error(' error to update book!\n{0}').format(e)
        return RuntimeError

@app.route('/api/sendavalible/', methods=('GET', 'POST'))
def sendavalible():
    aval_divs = []
    img_map = {
        0: '<div><img class="time-avalible" src="/static/img/yes.png"><img class="time-avalible" src="/static/img/yes.png"><img class="time-avalible" src="/static/img/yes.png"><img class="time-avalible" src="/static/img/yes.png"></div>',
        1:'<div><img class="time-avalible" src="/static/img/no.jpg"><img class="time-avalible" src="/static/img/yes.png"><img class="time-avalible" src="/static/img/yes.png"><img class="time-avalible" src="/static/img/yes.png"></div>',
        2: '<div><img class="time-avalible" src="/static/img/no.jpg"><img class="time-avalible" src="/static/img/no.jpg"><img class="time-avalible" src="/static/img/yes.png"><img class="time-avalible" src="/static/img/yes.png"></div>',
        3: '<div><img class="time-avalible" src="/static/img/no.jpg"><img class="time-avalible" src="/static/img/no.jpg"><img class="time-avalible" src="/static/img/no.jpg"><img class="time-avalible" src="/static/img/yes.png"></div>',
    }

    if request.method == 'GET':
        selected_date = request.args.get('selected_date')
        unavalible = get_unavailable_times(selected_date)
        for item in unavalible:
            aval_divs.append(generate_aval_div(item, img_map))
        return jsonify(variable=aval_divs)


def generate_aval_div(item, img_map):
    img_html = img_map.get(item[1], "")
    return f'<div class="col"><div id="{item[1]}" class="col-elem">{item[0]}{img_html}</div></div>'

def execute_query(query, params=None):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(query, params)
    result = cur.fetchall()
    cur.close()
    conn.close()
    return result

def update_aval_time(date, time, val):
    query = "UPDATE aval_time SET val = val + %s WHERE date = %s AND time = %s"
    execute_query(query, (val, date, time))

def get_unavailable_times(selected_date):
    query = "SELECT time, val FROM aval_time WHERE date = %s AND val != 4 ORDER BY id"
    return execute_query(query, (selected_date,))

@app.route('/api/post_comments/', methods=["POST"])
def postcomment():
    if request.method == 'POST':
        com_id = request.form.get('comm_id')
        user_id = request.form.get('user_id')
        c_text = request.form.get('text')
        dtime = request.form.get('datetime')
        comment = Comment(user_id=user_id, text=c_text, datetime=dtime, book_id=com_id)
        # Добавление комментария в сессию
        db.session.add(comment)
        # Выполнение коммита для сохранения изменений в базе данных
        db.session.commit()
        return '', 200

@app.route('/api/comments', methods=['GET'])
def get_comments():
    book_id = request.args.get('book_id')
    
    # Здесь вы можете выполнить запрос к базе данных,
    # чтобы выбрать комментарии, связанные с определенной книгой (book_id)
    # Пример:
    comments = Comment.query.filter_by(book_id=book_id).all()
    
    # Преобразование комментариев в формат JSON
    comments_json = [
        {
            'comm_id': comment.comm_id,
            'user_id': comment.user_id,
            'text': comment.text,
            'datetime': comment.datetime
        }
        for comment in comments
    ]
    
    return jsonify(comments_json)


# Получение комментария по comm_id
def get_comment_by_book_id(book_id):
    comment = Comment.query.filter_by(book_id=book_id).first()
    return comment


@app.route('/api/disable/', methods=('GET', 'POST'))
def disable():
    if request.method == 'GET':
        disable_dates = disable_from_db()
        return disable_dates
    if request.method == 'POST':
        disab = request.form.get('dates')
        x = disab.split(", ")
        dis_date = disable_to_db(x)
        print(dis_date)
        return "dis suc", 200
    
@app.route('/api/check_phone/', methods=['POST'])
def check_phone():
    phone_number = request.form.get('phone_number')
    client = check_is_member(phone_number)

    if client:
        return jsonify({'found': True, 'discount': True})
    else:
        return jsonify({'found': False})

@app.route('/api/getbook/', methods=('GET', 'POST'))
def getbook():
    if request.method == 'POST':
        logging.debug("getttttttttt")

        selected_date = request.form.get('date')
        logging.debug(selected_date)

        class Book():
            date=request.form.get('date'),
            time=request.form.get('time'),
            id_time = request.form.get('time_id'),
            p_name=request.form.get('p_name'),
            p_phone=request.form.get('p_phone'),
            p_email=request.form.get('p_email'),
            is_member= check_is_member(check_p = request.form.get('p_phone')),
            if request.form.get('count') != None:
                count=1+int(request.form.get('count')),
            else: count=1
            g1=request.form.get('g1'),
            g2=request.form.get('g2'),
            g3=request.form.get('g3'),
            is_car=request.form.get('is_car'),
            is_eltel=request.form.get('is_eltel'),
            is_tel=request.form.get('is_tel'),
            is_bag=request.form.get('is_bag'),
            commend=request.form.get('comment'),
            price_book=request.form.get('summ').replace(' ₽',''),
        booking = Book()

   
        try:    
            book_id = bookInDB(booking)
            updateAvalInDB(booking)
        except RuntimeError:
            return 'error'
        # Получить текущую дату и время
        now = datetime.now()

# Форматировать дату и время в нужный формат
        formatted_datetime = now.strftime("%d-%m-%Y %H:%M")
        comment = Comment(user_id="Система", text="Поступило бронирование\n Комментарий: {}".format(booking.commend), datetime=formatted_datetime, book_id=book_id)

        # Добавление комментария в сессию
        db.session.add(comment)

        # Выполнение коммита для сохранения изменений в базе данных
        db.session.commit()


        logging.debug(booking.p_name)
    return "ok",204

def bookInDB(booking):
    conn = get_db_connection()
    status = 'new'
    
    try:
        cur = conn.cursor()

        # Execute a command: this creates a new table
        cur.execute('INSERT INTO test (date, time, p_name, p_phone, p_email, is_member, count, guest1, guest2, guest3, car_c, eltel_c, tel_c, bag_c, comm, price, id_time, status)'
                    'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id',
                    (booking.date, booking.time, booking.p_name, booking.p_phone, booking.p_email, 
                    booking.is_member, booking.count, booking.g1, booking.g2, booking.g3, booking.is_car, 
                    booking.is_eltel, booking.is_tel, booking.is_bag, booking.commend, booking.price_book, booking.id_time, status))
        
        # Получить ID последней вставленной записи
        inserted_id = cur.fetchone()[0]

        conn.commit()
        cur.close()
        conn.close()

        return inserted_id
    except psycopg2.OperationalError as e:
        logging.error('Unable to connect!\n{0}').format(e)
        return RuntimeError


def updateAvalInDB(booking):   
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute ("""
            UPDATE aval_time
            SET val=val+%s
            WHERE date=%s AND time=%s
        """, (booking.count, booking.date, booking.time))
        conn.commit()
        cur.close()
        conn.close()
    except psycopg2.OperationalError as e:
        logging.error('Unable to connect!\n{0}').format(e)
        return RuntimeError


@app.route('/api/getbydate/', methods=('GET', 'POST'))
def getbydate():

    if request.method == 'POST':
        seele = request.json.get('dat')
        asd = get_from_db(seele)
        return jsonify(variable={seele:asd})

    
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')

    email = request.form['email']
    for check_us in users:
        if email in check_us and request.form['password'] == check_us[email]['password']:
            user = User()
            print(user)
            user.id = email
            flask_login.login_user(user)
            
            return redirect(url_for('protected'))

    return redirect(url_for('login'))


@app.route('/protected')
@flask_login.login_required
def protected():
    if flask_login.current_user.is_authenticated:
        user= flask_login.current_user.id
        return render_template('test_W.html',user = user)
    else:
        return redirect(url_for('login'))



@app.route('/protected/day')
@flask_login.login_required
def day():

    all_times = ['9:00','9:15','9:30','9:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45']

    d1=datetime.today().date()

    datetime.strptime("Wed 26 2020", "%a %d %Y")
    return render_template('day.html', day1=get_from_db(d1.strftime("%b %d %Y")),
                           all_times=all_times,
                            date1=d1.strftime("%b %d %Y"))


@app.route('/protected/disables')
@flask_login.login_required
def disables():
    return render_template('disable.html')

@app.route('/protected/user_add', methods=['GET', 'POST'])
@flask_login.login_required
def newuser():
    if request.method == 'POST':
        username = request.form.get('username')
        passwo = request.form.get('password')
        # u_email = request.form.get('email')
        # role = request.form.get('role')
        new_user(username,passwo)
        return "user", 200







@app.route('/protected/<student_id>')
@flask_login.login_required
def student(student_id):
    user= flask_login.current_user.id

    return render_template('student.html', student=getbyid(student_id),user = user)



@app.route('/logout')
def logout():
    flask_login.logout_user()
    return redirect(url_for('login'))
@login_manager.unauthorized_handler
def unauthorized_handler():
    return redirect(url_for('login'))
