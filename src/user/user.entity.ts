import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class User {
	@PrimaryGeneratedColumn()
	@Field(() => ID)
	id: number;

	@Column()
	@Field()
	name: string;

	@Column({ unique: true })
	@Field()
	email: string;

	@Column({ select: false })
	password: string; // Обратите внимание, что поле пароля не должно быть доступно через API
}
