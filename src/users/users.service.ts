import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) {
    try{
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: createUserDto.password
        },
        select:{ id:true, name: true, email: true }
      })
      return user;
    }catch(error){
      console.log(error)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND)
    }
  }

  async findAll() {
    const user = await this.prisma.user.findMany()

    if(user) return user;

    throw new HttpException('Não tem registros', HttpStatus.NOT_FOUND)
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: id },
      select: { id: true, email: true }
    })

    if(user) return user;

    throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND)
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try{
      // verifica se existe o id do usuário
      const user = await this.prisma.user.findFirst({
        where: { id: id },
      })

      // se não existir retorna o erro
      if(!user) { 
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND) 
      }
      // caso exista então atualiza
      const updateUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { 
          name: updateUserDto.name ? updateUserDto.name : user.name, 
          email: updateUserDto.email ? updateUserDto.email : user.email, 
          password: updateUserDto.password ? user.password : user.password
      },
      // retorna os dados
      select: { id: true, name: true, email: true }
    })

    return updateUser;
    
    } catch(error) {
      console.log(error)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND)
    }
  }

  async remove(id: number) {
    try{
      const user = await this.prisma.user.findFirst({
        where: { id: id }
      })

      if(!user){ throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND) }
    
      await this.prisma.user.delete({
        where: { id: user.id}
      })
    }catch(error){
      console.log(error)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND)
    }
  }
}