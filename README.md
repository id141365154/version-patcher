# Патч версий в нескольких файлах

## Установка

`npm install --save-dev version-patcher`

## Настройка

В корне проекта создайте `version-patcher.config.json`

```json
{
  "patch": [
    {
      "file": "app.json",
      "params": [
        {
          "expo.version": "semantic"
        },
        {
          "expo.android.versionCode": "incriment"
        }
      ]
    },
    {
      "file": "package-example.json",
      "params": [
        {
          "version": "semantic"
        }
      ]
    }
  ]
}
```

### Типы версий

`semantic` - `0.0.1` - Поддерживает команды: `patch` | `minor` | `major`

`incriment` - `1` - Увеличение версии на 1

### Подключение

Отредактируйте package.json

До

`"scripts": { "build": "react-scripts build", ... },`

После

`"scripts": { "build": "version-patcher patch && react-scripts build", ... },`

## Отладка

1. Создать version-patcher.config.json
2. Запустить скрипт `node bin/version-patcher.js`
