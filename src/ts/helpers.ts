
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
 * @param name - название цвета
 * @returns 
 */
export function getColor(name: string): string {
    // Создаём локальный интерфейс для хранения пар "ключ (название цвета): код цвета (rgba)"
    interface colorStorage {
        [key: string]: string,
    }

    const colors: colorStorage = {
        carbon:      'rgba(14, 14, 14, 1)',
        
        darkRed:     'rgba(38, 12, 12, 1)',
        brightRed:   'rgba(114, 6, 6, 1)',

        darkBlue:    'rgba(12, 16, 38, 1)',
        brightBlue:  'rgba(9, 12, 104, 1)',

        darkGreen:   'rgba(12, 38, 12, 1)',
        brightGreen: 'rgba(6, 114, 6, 1)',
    }

    return colors[name];
}