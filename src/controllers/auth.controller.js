import logger from "#config/logger.js";
import {signupSchema} from "#validations/auth.validation.js";
import {formatValidationError} from "#utils/format.js";
import {createUser} from "../service/auth.service.js";
import jwt from "jsonwebtoken";
import {jwttoken} from "#utils/jwt.js";
import {cookie} from "#utils/cookie.js";

export const signup = async (req, res, next) => {

    try {

        const validationResult = signupSchema.safeParse(req.body);
        if (!validationResult.success){
            return res.status(400).json({
                error: "Validation Failed",
                details: formatValidationError(validationResult.error)
            })
        }

        const {name, email, role, password } = validationResult.data;


        //Auth service
        const user = await createUser({name, email, role, password, });

        cookie.set(res, 'token', user.token);

        const token = jwttoken.sign(({
            id: user.id,
            email: user.email,
            role: user.role,

        }))

        logger.info(`user signup successfully, ${ email}`);
        res.status(201).json({
            message : "User signup successfully",
            user:{
                id:1,
                name,
                email,
                role
            }

        })

    } catch (e){
        logger.error("signup error", e);
        if (e.message === 'user with this email already exists') {
            return res.status(409).json(
                {
                    error: 'User with this email already exists',
                }
            )


        }
        next(e);
    }


}
