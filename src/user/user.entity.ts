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
	phoneNumber: string;

	@Column({ unique: true })
	@Field()
	email: string;

	@Column({ select: true })
	password: string;
}
