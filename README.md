# Използвани технологии

JavaScript, CSS и HTML.

---

## Реализирани функционалности:

- Валидация на данните (мейл, имена и парола)
- Записване на данните в релационна база данни (MySQL)
- Login/Logout
- Страница за промяна на имена и парола на потребителя
- Кепча верификация при регистрация

---

## Валидация на данните

- Имената не може да съдържат цифри и трябва да са с дължина между 2 и 30 символа.
- Имейлът трябва да е валиден (да следва шаблона `xxx@xxx.xxx`).
- Паролата бива оценявана чрез лента, която се променя динамично спрямо силата на паролата. В зависимост от това дали съдържа специален символ, главна буква, цифра и дали покрива минималния критерий за дължина. Единственото задължително за регистрацията е критерият за дължина.
- Паролата трябва да се повтори при регистрация.
- При успешно преминаване на валидацията потребителят се регистрира и данните му се записват в SQL таблица `users`.

---

## Записване на данните в релационна база данни

- Използвам модулът в JavaScript за работа с MySQL.
- Данните на потребителите се въвеждат в предварително създадена таблица `users` в базата данни `TELEBID_PROJECT`.
  ![image](https://github.com/user-attachments/assets/ef2b141c-3daf-42f1-8715-5b1fe284a1a3)

- Използвам `queryString` за по-лесно писане на заявките и за по-голяма безопасност от SQL инжекции.

---

## Login/Logout

- Първо проверявам дали имейлът и паролата на потребителя съвпадат с някои в базата данни.
- Ако съвпадат – потребителят влиза в профила си.
- Използвам бисквитки, за да запазя сесията му и докато той не затвори браузъра или не излезе от профила си (с бутон **Log out**), данните му ще се показват на страницата `profile`.
- Ако потребителят избере да излезе от профила си, бисквитките се трият и той бива пренасочен към `login` страницата.
- Ако потребителят се опита да посети `profile` страницата без да е влязъл в профила си, няма да види никакви потребителски данни, а само съобщение, че не е авторизиран.

---

## Страница за промяна на имена

- При въведени валидни имена, **Front-end** изпраща `POST` заявка към сървъра, където имената на потребителя се променят в таблица `users`.
- След това той бива пренасочен към профила си.

---

## Страница за промяна на парола

- При въведена валидна парола и след като тя се повтори, се изпраща `POST` заявка към сървъра, където паролата на потребителя се променя в таблица `users`.
- След това той автоматично се **log out-ва**, за да може да влезе с новата парола.

---

## Кепча верификация при регистрация

- Генерирам случайни главни и малки букви и цифри.
- След това ги нанасям върху елемент `canvas` на случайни вертикални координати, като всеки символ може да бъде или черен, или сив (на случаен принцип).
- Потребителят трябва да въведе какво пише на `canvas-а` в текстово поле.
- Ако е отговорил вярно, верификацията преминава и той се регистрира.

