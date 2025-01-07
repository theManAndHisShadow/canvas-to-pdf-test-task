/**
 * Возвращает случайное число из диапазона (min, max)
 * @param min - Начало диапазона
 * @param max - конец диапазона (включительно)
 * @returns - случайное число
 */
export function getRandomNumber(min: number, max: number): number {
    let randomNUmber = min + Math.random() * (max + 1 - min);
  
    return Math.floor(randomNUmber);
}



/**
 * Переводит градусы в радианы
 * @param degrees - граудсы
 * @returns - радианы
 */
export function degrees2radians(degrees: number) {
    return degrees * (Math.PI / 180);
}



/**
 * Преобразует радианы в градусы
 * @param radians 
 * @returns 
 */
export function radians2degrees(radians: number){
    return radians * (180 / Math.PI);
}



/**
 * Преобразует цвет в десятеричной системе в rgba массив, где каждый канал представлен чилом [r, g, b, a]
 * @param decimal 
 * @returns 
 */
export function decimal2RGBA(decimal: number): [number, number, number, number] {
    const r = (decimal >> 16) & 0xff; // Красный
    const g = (decimal >> 8) & 0xff;  // Зелёный
    const b = decimal & 0xff;         // Синий
    return [r, g, b, 1]; // a = 1 (полная непрозрачность)
}



/**
 * Преобразует цвет в десятеричной системе в rgba строку "rgba(r, g, b, a)"
 * @param decimal 
 * @returns 
 */
export function decimal2RGBString(decimal: number): string {
    const r = (decimal >> 16) & 0xff; // Красный
    const g = (decimal >> 8) & 0xff;  // Зелёный
    const b = decimal & 0xff;         // Синий
    return `rgba(${r}, ${g}, ${b}, 1)`;
}



/**
 * Превращает HTML изображение в HTML холст, после чего возвращает результат
 * @param image - HTML изображение
 * @returns - готовый холст с изображдением
 */
export function imageToCanvas(image: HTMLImageElement): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context not available');
    context.drawImage(image, 0, 0);
    return canvas;
}



/**
 * Превращает холст в Uint8Array
 * @param canvas - HTML холст
 * @returns - последовательность чисел в виде Uint8Array
 */
export function canvasToUint8Array(canvas: HTMLCanvasElement): Uint8Array {
    const dataUrl = canvas.toDataURL('image/png');
    const base64 = dataUrl.split(',')[1];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }
    return array;
}



/**
 * Превращает Uint8Array в base64 строку
 * @param uint8Array 
 * @returns 
 */
export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    // Преобразуем Uint8Array в строку
    const binaryString = Array.from(uint8Array)
        .map(byte => String.fromCharCode(byte))
        .join('');
    // Кодируем строку в Base64
    return btoa(binaryString);
}



/**
 * Выводит отладочную инфо в консоль в удобнмо формате
 * @param status - статус сообщения
 * @param messageText - текст сообщения
 */
export function debugLog(status: 'ok' | 'warn' | 'err' | 'info', messageText: string): void {
    /**
     * Собирает стиль для текста, отображаемого в console.log()
     * @param textColor - цвет текста
     * @param backgroundColor - цвет фона текста
     * @param fontWeight - толщина текста
     * @param padding - внутренние отступы 
     * @param borderRadius - закругление фона текста
     * @returns - Возвращате готовую строку стиля
     */
    const consturctConsoleStyle = (
        textColor: string, 
        backgroundColor: string, 
        fontWeight: 'bold' | 'regular',
        padding: string,
        borderRadius: number
    ) => {
        return `color: ${textColor}; background-color: ${backgroundColor}; font-weight: ${fontWeight}; padding: ${padding}; border-radius: ${borderRadius}px;`
    };

    /**
     * Возвращает дефолтный стиль стиль для консоли
     * @returns 
     */
    const getClearFixStyle = () => consturctConsoleStyle('white', 'transparent', 'regular', '0px', 0);

    /**
     * Возвращает стиль для элемента "пузырь с текстом"
     * @param textColor - цвет текста
     * @param backgroundColor - цвет фона
     * @returns 
     */
    const getColoredBubbleStyle = (textColor: string, backgroundColor: string) => consturctConsoleStyle(textColor, backgroundColor, 'bold', '2px 4px', 4);

    // Дебаг статусы
    const debugStatuses: {[key: string]: {[key: string]: string}} = {
        ok: { 
            labelText: 'OK',
            fg: 'rgb(56, 172, 60, 1)',       
            bg: 'rgb(14, 60, 16, 1)',
        },

        warn: { 
            labelText: 'Warning',
            fg: 'rgb(172, 144, 56, 1)',     
            bg: 'rgb(60, 41, 14, 1)'    
        },

        err: { 
            labelText: 'Error',
            fg: 'rgb(172, 56, 56, 1)',       
            bg: 'rgb(60, 14, 14, 1)'      
        }
    };

    if(status === 'info') {
        console.log(
            `%c[Debug log]:%c ${messageText}.`, 
    
            // Получаем стили с помощью кастомных локальных функций
            getColoredBubbleStyle('white', 'rgba(0, 0, 0, 0.4)'),
            getClearFixStyle(),
        );
    } else {
        const fgColor = debugStatuses[status].fg;
        const bgColor = debugStatuses[status].bg;

        console.log(
            `%c[${debugStatuses[status].labelText}]%c %c[Debug log]:%c ${messageText}.`, 
    
            // Получаем стили с помощью кастомных локальных функций
            getColoredBubbleStyle(fgColor, bgColor),
            getClearFixStyle(),
            getColoredBubbleStyle('white', 'rgba(0, 0, 0, 0.4)'),
            getClearFixStyle(),
        );

        if(status === 'err') {
            // Вручную прерываем исполнение коды и указываем трассировку исполнения
            const error = new Error('Please pay attention to the error message above. Check execution trace below: ');
            Error.captureStackTrace(error, debugLog);
            throw error;
        }
    }
}



/**
 * Вспомогательная функция, которая позволяет получить rgba-код цвета по названию.
 * @param query - запрос - вернёт rgba цвет, если такой есть, если передан сам rgba цвет то вернёт его название
 * @returns 
 */
export function getColor(query: string): string {
    // Создаём локальный интерфейс для хранения пар "ключ (название цвета): код цвета (rgba)"
    interface colorStorage {
        [key: string]: string,
    }

    const colors: colorStorage = {
        carbon:      'rgba(14, 14, 14, 1)',
        lightCarbon: 'rgba(54, 54, 54, 1)',
        
        darkRed:     'rgba(38, 12, 12, 1)',
        brightRed:   'rgba(114, 6, 6, 1)',

        darkBlue:    'rgba(12, 16, 38, 1)',
        brightBlue:  'rgba(9, 12, 104, 1)',

        darkGreen:   'rgba(12, 38, 12, 1)',
        brightGreen: 'rgba(6, 114, 6, 1)',

        darkSilver:   'rgba(96, 96, 96, 1)',
        brightSilver: 'rgba(212, 212, 212, 1)',

        salad:        'rgba(102, 255, 12, 1)',
        chocolate:    'rgba(107, 47, 2, 1)',
        blueberry:    'rgba(106, 0, 255, 1)',

        white: 'rgba(255, 255, 255, 1)',
    }

    return /rgba/.test(query) ? Object.entries(colors).find(([key, value]) => value === query)?.[0] : colors[query];
}



/**
 * Returns formatted current date in 'yearMonthDay_hourMinutesSeconds' fromat.
 * @returns 
 */
export function getFormattedDate() {
    const now = new Date();

    const pad = (num: number) => String(num).padStart(2, '0');

    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1); // Месяцы начинаются с 0
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}