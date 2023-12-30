export const regions = ['RU'];
export type Region = 'RU';

export const codeConfig = {
	timeout: 1, // Сколько минут будет валиден отправленный код и юзер не сможет запросить новый
	extraTimeout: 5, // Сколько минут добавляется к общему времени ожидания, если юзер ввёл код неверно 4 раза
	codeLength: 6, // Длина кода
};
