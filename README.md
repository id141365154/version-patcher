# Patch версий в нескольких файлах

## Установка

`npm install --save-dev version-patcher`

## Настройка

В корне проекта создайте `version-patcher.config.json`

`JSON
{
	"patch": [
	{
		"file": "app.json",
		"params": [
		{
			"version": "semantic"
		}
		{
			"versionCode": "incriment"
		}]
	},
	{
		"file": "package.json",
		"params": [
		{
			"version": "semantic"
		}]
	}, ],
}
`



### Типы версий

`semantic` - 0.0.1 
Поддерживает команды `patch` `minor` `major`

`incriment` - 1 
Увеличение версии на 1




### Подключение

Отредактируйте package.json

До

`"scripts": { "start": "react-scripts start", "build": "react-scripts build", ... },`

После

`"scripts": { "start": "node ./node_modules/.bin/version-patcher && react-scripts start", "build": "react-scripts build", ... },`

## Отладка

1. Создать version-patcher.config.json
2. Запустить скрипт `node bin/version-patcher.js`
