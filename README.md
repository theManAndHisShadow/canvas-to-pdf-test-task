
# О проекте

Работая с элементом `HTML Canvas`, иногда возникает потребность в экспорте отрисованного содержимого. В зависимости от типа и качества требуемого результата можно выбрать несколько подходов:

- **Простой способ** — конвертировать `canvas` в `Blob`, который можно легко скачать на компьютер пользователя как изображение.  
- **Сложнее** — использовать библиотеку, например, [jsPDF](https://github.com/parallax/jsPDF), чтобы разместить содержимое холста в качестве изображения на странице PDF-документа. Однако для высококачественного результата вместо увеличения разрешения изображения (что одновременно увеличивает размер файла) лучше импортировать содержимое холста как векторную графику. Здесь начинаются ограничения: jsPDF поддерживает векторную графику и текст лишь частично и с трудом справляется со сложной графикой.  
- **Продвинутый способ** — использовать модуль `CanvasKit` из графической библиотеки [Skia](https://github.com/google/skia) от Google. Эта библиотека работает со сложной графикой, включая поддержку WebGL и GPU-ускорение. Кроме того, Skia предоставляет API для конвертации `canvas` в PDF высокого качества (Skia PDF Backend). Модуль `CanvasKit` представляет собой сборку WebAssembly, которая позволяет использовать Skia в браузере, поскольку оригинальная библиотека написана на `C++`. В данном проекте реализовано именно это решение.

# Основная концепция

**Цель**: создать PDF-файл высокого качества на основе содержимого `canvas`.  
Так как исходные данные уже рендерятся с помощью [Pixi.js v7.2.4](https://www.npmjs.com/package/pixi.js-legacy/v/7.2.4), необходимо написать прослойку для интеграции двух библиотек.

Спойлер: это самая простая часть задачи. Код прослойки оказался довольно объёмным, поскольку команды одной библиотеки приходится транслировать в команды другой. Однако полученная реализация позволяет эффективно проецировать содержимое из холста Pixi.js в холст Skia, и вот пора приступать к конвертации.

### Хьюстон, у нас проблема

Изучение [документации](https://skia.org/docs/) и [форумов](https://groups.google.com/g/skia-discuss/c/SzTGfl_rQdI/m/QBv4tENHAgAJ) показало, что в последних версиях `CanvasKit` сборка `canvaskit.wasm` не включает функциональность конвертации холста Skia в PDF. Причина в том, что переменная `use_skia_pdf` в bash-скрипте сборки по умолчанию равна `false`.

Однако это не означает, что функционал отсутствует. В исходном коде он есть, но не включён в официальную сборку. Решение проблемы — пересобрать модуль самостоятельно с `use_skia_pdf=true`, чем я и занялся, а на выходе получил [свою сборку](https://github.com/theManAndHisShadow/skia-browser-pdf/tree/main) `skia/canvaskit`.

### Мост между мирами

Для вызова функций из C++ в JavaScript используется [Emscripten](https://github.com/emscripten-core/emscripten). Этот транспилятор управляет вызовами функций на C++ из JavaScript. Для этого используется механизм **байндингов (bindings)**, который описывает, как интерпретировать типы и структуры из JavaScript в соответствующие типы на C++.

Если байндинг для определённой функции отсутствует, из JavaScript её вызвать нельзя. Как оказалось, в текущей версии `CanvasKit` байндинги для PDF-конвертации отсутствуют.

![Screen Shot 2025-01-09 at 20 06 40](https://github.com/user-attachments/assets/9d0205fa-f2ff-4299-87e3-4eb6827b4a81)




### Давайте сделаем вид, что всё работало из коробки

Эту проблему я решил, написав собственный [кастомный байндинг](https://github.com/theManAndHisShadow/skia-browser-pdf/blob/main/modules/canvaskit/canvaskit_extended_bindings.cpp). Этот байндинг добавляет метод `canvaskit.ConvertToPDF()`, который конвертирует холст `SkCanvas` в PDF (`SkPDF`). Метод возвращает поток данных, который можно превратить в `Blob` и скачать на компьютер пользователя.

# Результат
Теперь, когда 2 библиотеки подружились, а все пробелы закрыты, приложение успешно выполняет поставленную задачу - позволяет экспортировать содержимое холста `Pixi.js` в PDF файл в виде векторной и растровой графики, если были использованы спрайты.

![image](https://github.com/user-attachments/assets/f661f224-4137-414e-af69-6f0b0302c7bb)
