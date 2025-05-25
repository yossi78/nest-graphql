import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { User } from "../entities/User";
import { City, CityName } from "../entities/City";
import { CreateUserInput, UpdateUserInput } from "../schemas/UserInput";
import { AppDataSource } from "../config/database";

@Resolver()
export class UserResolver {
  private userRepository = AppDataSource.getRepository(User);
  private cityRepository = AppDataSource.getRepository(City);

  constructor() {
    this.initializeCities().catch(console.error);
  }

  private async initializeCities() {
    for (const cityName of Object.values(CityName)) {
      const existingCity = await this.cityRepository.findOne({
        where: { name: cityName }
      });

      if (!existingCity) {
        const city = this.cityRepository.create({ name: cityName });
        await this.cityRepository.save(city);
      }
    }
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userRepository.find({
      relations: ["city"]
    });
  }

  @Query(() => [City])
  async cities(): Promise<City[]> {
    return this.cityRepository.find();
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => ID) id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ["city"]
    });
  }

  @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUserInput): Promise<User> {
    let city = await this.cityRepository.findOne({
      where: { name: data.city }
    });

    if (!city) {
      throw new Error(`City ${data.city} not found`);
    }

    const user = this.userRepository.create({
      ...data,
      city
    });

    return this.userRepository.save(user);
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateUserInput
  ): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      relations: ["city"]
    });

    const { city: cityName, ...updateData } = data;

    if (cityName) {
      // Find city by name (case-insensitive)
      const city = await this.cityRepository.findOne({
        where: { name: Object.values(CityName).find(name => 
          name.toLowerCase() === cityName.toLowerCase()
        ) }
      });

      if (!city) {
        throw new Error(`City ${cityName} not found. Available cities are: ${Object.values(CityName).join(', ')}`);
      }

      await this.userRepository.update(id, {
        ...updateData,
        cityId: city.id
      });
    } else if (Object.keys(updateData).length > 0) {
      await this.userRepository.update(id, updateData);
    }

    const updatedUser = await this.userRepository.findOne({
      where: { id },
      relations: ["city"]
    });

    if (!updatedUser) {
      throw new Error(`User ${id} not found after update`);
    }

    return updatedUser;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id", () => ID) id: number): Promise<boolean> {
    try {
      await this.userRepository.delete(id);
      return true;
    } catch {
      return false;
    }
  }
} 