import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
	constructor() {}

	async getAll() {
		return [
			{
				id: 1,
				name: 'artyom',
			},
		];

		// return 'chel';
	}
	async getNum() {
		return Math.floor(100000 + Math.random() * 900000);
	}
}
