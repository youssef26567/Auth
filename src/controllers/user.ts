import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import { OAuth2Client } from 'google-auth-library';
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function Register(req:Request,
    res:Response,
    next:NextFunction) {
       try{
        const data = req.body;
        const hashedPassword = await bcrypt.hash(data.password, 10); // You can adjust the number of rounds for the hashing

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
       password:hashedPassword
      },
    })
    
  
    const allUsers = await prisma.user.findMany({
    })
    console.dir(allUsers, { depth: null })
       }catch(err){
        console.log(`error:${err}`)
       }
  }

  export async function login(req:Request,res:Response){
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
          where: { email },
        });
    
        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          //gerar token
          const token = jwt.sign({id:user.id},process.env.SECRET as string,{
            expiresIn:300
          })
          //salvar token no cookie
          res.cookie('token',token,{
            httpOnly:true
          })

        if (passwordMatch) {
          res.json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Incorrect password' });
        }
      }} catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while logging in.' });
      }
    }

    export async function logout(req:Request,res:Response){
      try{
        res.clearCookie('token')
        res.json({message:'logout successful'})
      }catch(err){
        console.log(`error:${err}`)
      }
    }

    export async function googleAuth(req: Request, res: Response) {
      try {
        const { idToken } = req.body;
        const ticket = await client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const name = payload?.name;
        const email = payload?.email;
        if (!email) {
          return res.status(400).json({ error: 'Invalid payload' });
        }
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          await prisma.user.create({
            data: {
              name: name ?? 'Default Name',
              email,
              password: 'defaultPassword',
            },
          });
        }
        const token = jwt.sign({ email }, process.env.SECRET as string, {
          expiresIn: 300,
        });
        res.cookie('token', token, {
          httpOnly: true,
        });
        res.json({ message: 'Login successful' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while logging in.' });
      }
    }
    

