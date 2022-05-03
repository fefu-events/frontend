![Logo](.github/assets/logo.png)

-----

Клиентская часть [FEFU Events](https://github.com/fefu-events/fefu-events).

# Быстрый старт
Для подготовки окружения необходимо выполнить следующие команды:

```cmd
git clone https://github.com/fefu-events/frontend.git
cd frontend
npm install
npm install -g serve
```

Затем сделайте сборку проекта:

```
yarn build
```

Для запуска необходимо выполнить команду:
```
serve -s dist
```

# Запуск с помощью Docker
TODO

# Структура проекта
```
├───public
└───src
    ├───assets
    │   ├───css
    │   ├───img
    │   │   └───svg
    │   └───json
    ├───components
    │   ├───icon
    │   ├───interface
    │   ├───layout
    │   └───template
    ├───router
    ├───service
    │   ├───api
    │   └───auth
    ├───store
    │   └───modules
    └───views
```
