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
          "path": "expo.version"
        },
        {
          "path": "expo.android.versionCode"
        }
      ]
    },
    {
      "file": "package-example.json",
      "params": [
        {
          "path": "version"
        }
      ]
    },
    {
      "file": "test.json",
      "params": [
        {
          "path": "version",
          "reference": {
            "file": "app.json",
            "params": {
              "path": "expo.version"
            }
          }
        }
      ]
    }
  ]
}
```

### Параметры вызова

`patch` | `minor` | `major`

### Подключение

Отредактируйте package.json

До

`"scripts": { "build": "react-scripts build", ... },`

После

`"scripts": { "build": "version-patcher patch && react-scripts build", ... },`

## Отладка

1. Создать version-patcher.config.json
2. Запустить скрипт `node bin/version-patcher.js`
