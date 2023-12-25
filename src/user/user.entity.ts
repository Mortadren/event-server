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

	@Column()
	@Field()
	email: string;

	@Column({ select: true })
	password: string;

	@Column({ nullable: true })
	verified: boolean;

	@Column({ nullable: true })
	verificationCode: string;

	@Column({ type: 'timestamp', nullable: true })
	verificationCodeTimestamp: Date;

	@Column({ default: 0 })
	verificationCodeAttempts: number;

	@Column({ nullable: true })
	extraTimeout: number;

	@Column({ type: 'timestamp' })
	createdAt: Date;
}
