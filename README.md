# Asistente Caja Ande

[![](https://img.shields.io/badge/types-TypeScript-blue?style=for-the-badge)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://prettier.io)

Asistente virtual tipo chatbot para asistir a clientes de Caja Ande.

## Antes de Iniciar

- Activar husky

Se debe ejecutar el siguiente comando para activar `husky`.

```sh
npm run prepare
```

Esto se usa para formatear el codigo automaticamente usando prettier antes de cada commit. De esta manera el código se
mantendrá siempre organizado.

- Crear variables de entorno

Se debe crear un archivo `development.env` en la carpeta `/env`, para esto puede ejecutar el siguiente comando y copiar
la plantilla de variables proporcionada

```sh
cp env/.env.template env/production.env
```

Nota: crear `production.env` para usar en producción.

## Comandos

```sh
npm install

npm run dev # run app in mode developer

npm start # run app in mode production
```

## Diagramas

- Arbol de Decisiones

![tree](docs/decisions-tree.png)

- Especificacion del modelo de codigo

![model](docs/model-specification.drawio.png)
