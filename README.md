## Database Structure
Цей застосунок використовує базу даних PostgreSQL з наступними таблицями, розміщеними в схемі train_schedule:

## Таблиця: train_schedule.users
Ця таблиця зберігає інформацію про зареєстрованих користувачів.

CREATE TABLE IF NOT EXISTS train_schedule.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password text NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email)
);
id: Унікальний ідентифікатор користувача (UUID)
email: Email користувача (унікальний)
password: Захешований пароль

## Таблиця: train_schedule.trains
Ця таблиця зберігає розклад потягів, який прив'язаний до користувача через зовнішній ключ user_id.


CREATE TABLE IF NOT EXISTS train_schedule.trains (
  id integer NOT NULL DEFAULT nextval('train_schedule.trains_id_seq'::regclass),
  train_number varchar(20),
  from_station varchar(100) NOT NULL,
  to_station varchar(100) NOT NULL,
  departure_time timestamp NOT NULL,
  arrival_time timestamp NOT NULL,
  user_id uuid NOT NULL,
  CONSTRAINT trains_pkey PRIMARY KEY (id),
  CONSTRAINT fk_user FOREIGN KEY (user_id)
    REFERENCES train_schedule.users (id)
    ON DELETE CASCADE
);
id: Унікальний ідентифікатор потяга
train_number: Номер потяга (необов’язкове поле)
from_station: Станція відправлення
to_station: Станція прибуття
departure_time: Час відправлення
arrival_time: Час прибуття
user_id: Посилання на користувача, якому належить запис (зовнішній ключ)

## Логіка авторизації та роботи з потягами
У застосунку реалізована базова логіка реєстрації та входу користувача. Після успішної авторизації кожен користувач отримує JWT токен , за допомогою якого отримує доступ до функціоналу застосунку.

Кожен користувач може взаємодіяти лише зі своїми особистими записами про потяги: додавати, переглядати та видаляти лише ті потяги, які він створив. Зв’язок між користувачем і його потягами реалізовано через поле user_id у таблиці trains.