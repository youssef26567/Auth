import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
          res.json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Incorrect password' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while logging in.' });
      }
  }
