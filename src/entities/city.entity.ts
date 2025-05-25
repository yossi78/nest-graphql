import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./user.entity";

export enum CityName {
  OR_YEHUDA = "Or-Yehuda",
  TEL_AVIV = "Tel-Aviv",
  JERUSALEM = "Jerusalem",
  HAIFA = "Haifa"
}

@ObjectType()
@Entity()
export class City {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    type: "enum",
    enum: CityName,
    unique: true
  })
  name: CityName;

  @OneToMany(() => User, user => user.city)
  users: User[];
} 