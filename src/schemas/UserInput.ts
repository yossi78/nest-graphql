import { InputType, Field } from "type-graphql";
import { CityName } from "../entities/City";
import { registerEnumType } from "type-graphql";

// Register the CityName enum with GraphQL
registerEnumType(CityName, {
  name: "CityName",
  description: "Available cities",
});

@InputType()
export class CreateUserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  birthDate: Date;

  @Field(() => CityName)
  city: CityName;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field(() => CityName, { nullable: true })
  city?: CityName;
} 