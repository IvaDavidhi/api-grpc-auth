import {Repository} from "typeorm";
import {Auth} from "../auth.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import { JwtService as Jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JwtService {
    @InjectRepository(Auth)
    private readonly repository: Repository<Auth>;

    private readonly jwt: Jwt;

    constructor(jwt: Jwt) {
        this.jwt = jwt;
    }

    //Decoding the JWT token
    public async decode(token: string): Promise<unknown> {
        return this.jwt.decode(token, null);
    }

    //Get user by user id we get from decode()
    public async validateUser(decoded: any): Promise<Auth> {
        return this.repository.findOne(decoded.id);
    }

    //generate JWT token
    public generateToken(auth: Auth): string {
        return this.jwt.sign({id: auth.id, email: auth.email})
    }

    //validate user's password
    public isPasswordValid(password: string, userPassword: string): boolean {
        return bcrypt.compareSync(password, userPassword);
    }

    //Encode user's password
    public encodePassword(password: string): string {
        const salt: string = bcrypt.genSaltSync(10);

        return bcrypt.hashSync(password, salt);
    }

    //Validate JWT token, throw forbidden error if JWT token is invalid
    public async verify(token: string): Promise<any>{
        try {
            return this.jwt.verify(token);
        }catch (err){}
    }
}