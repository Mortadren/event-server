export const regions = ['RU'];
export type Region = 'RU';

export const codeConfig = {
	timeout: 2, // 2 minutes - Сколько минут будет валиден отправленный код и юзер не сможет запросить новый
	extraTimeout: 5, // 5 minutes - Сколько минут добавляется к общему времени ожидания, если юзер ввёл код неверно 4 раза
	codeLength: 4, // Длина кода
};
