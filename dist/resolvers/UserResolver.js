"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const City_1 = require("../entities/City");
const UserInput_1 = require("../schemas/UserInput");
const database_1 = require("../config/database");
let UserResolver = class UserResolver {
    constructor() {
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
        this.cityRepository = database_1.AppDataSource.getRepository(City_1.City);
        this.initializeCities().catch(console.error);
    }
    async initializeCities() {
        for (const cityName of Object.values(City_1.CityName)) {
            const existingCity = await this.cityRepository.findOne({
                where: { name: cityName }
            });
            if (!existingCity) {
                const city = this.cityRepository.create({ name: cityName });
                await this.cityRepository.save(city);
            }
        }
    }
    async users() {
        return this.userRepository.find({
            relations: ["city"]
        });
    }
    async cities() {
        return this.cityRepository.find();
    }
    async user(id) {
        return this.userRepository.findOne({
            where: { id },
            relations: ["city"]
        });
    }
    async createUser(data) {
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
    async updateUser(id, data) {
        const user = await this.userRepository.findOneOrFail({
            where: { id },
            relations: ["city"]
        });
        const { city: cityName, ...updateData } = data;
        if (cityName) {
            // Find city by name (case-insensitive)
            const city = await this.cityRepository.findOne({
                where: { name: Object.values(City_1.CityName).find(name => name.toLowerCase() === cityName.toLowerCase()) }
            });
            if (!city) {
                throw new Error(`City ${cityName} not found. Available cities are: ${Object.values(City_1.CityName).join(', ')}`);
            }
            await this.userRepository.update(id, {
                ...updateData,
                cityId: city.id
            });
        }
        else if (Object.keys(updateData).length > 0) {
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
    async deleteUser(id) {
        try {
            await this.userRepository.delete(id);
            return true;
        }
        catch (_a) {
            return false;
        }
    }
};
exports.UserResolver = UserResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Query)(() => [City_1.City]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "cities", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => User_1.User),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInput_1.CreateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => User_1.User),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UserInput_1.UpdateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
exports.UserResolver = UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [])
], UserResolver);
//# sourceMappingURL=UserResolver.js.map