import os
import psycopg2


conn = psycopg2.connect(
            host="127.0.0.1",
            port="5432",
            database="flask_db",
            user='zxc',
            password='Qazwsx12')

cursor = conn.cursor()

# Ваш SQL-запрос для обновления формата даты
sql_query = """
UPDATE aval_time
SET
  date = to_char(to_date(date, 'Mon DD YYYY'), 'DD.MM.YYYY')
WHERE date ~ '^[A-Z][a-z]{2} [0-9]{2} [0-9]{4}$';
"""

# Выполнение запроса
cursor.execute(sql_query)
conn.commit()

# Закрытие соединения
cursor.close()
conn.close()