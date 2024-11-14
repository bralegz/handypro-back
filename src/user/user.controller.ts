import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiResponse, ApiParam, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { UpdateUserDto } from './dtos/updateUser.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Tiene valor por defecto = 1',
        example: '1',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Tiene valor por defecto = 5',
        example: '5',
    })
    @ApiQuery({
        name: 'categories',
        required: false,
        description: 'Si se quiere buscar por mas de una categoria debe separarlo por cómas, es indiferente a las MAYUSC. ES SENSIBLE A LOS ACENTOS',
        example: 'Mecanico, Jardinero',
    })
    @ApiQuery({
        name: 'name',
        required: false,
        description: 'Solo se puede buscar por un nombre a la vez, es indiferente a las MAYUSC',
        example: 'JUAN',
    })
    @Get('professionals')
    async getProfessionals(@Query('categories') categories?: string, @Query('page') page: number = 1, @Query('limit') limit: number = 5, @Query('name') name?: string) {
        return await this.usersService.getProfessionals(categories, Number(page), Number(limit), name);
    }

    @Get('clients')
    async getClients(@Query('page') page: number = 1, @Query('limit') limit: number = 5) {
        return await this.usersService.getClients(Number(page), Number(limit));
    }

    @ApiParam({
        name: 'id',
        required: true,
        description: 'Se requiere el id del profesional',
    })
    @ApiOkResponse({
        description: 'Informacion del profesional con todos los posteos a los cuales aplicó',
        schema: {
            example: [
                {
                    id: '04d7fa9d-a4c9-404e-8293-cf6988628ded',
                    fullname: 'Roberto García',
                    profileImg: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
                    role: 'professional',
                    rating: 4.9,
                    services: ['Muebles personalizados', 'Reparaciones del hogar', 'Restauración de trabajos en madera'],
                    availability: false,
                    bio: 'Con más de 15 años de experiencia, me dedico a crear muebles personalizados y reparar estructuras del hogar. Además, restauro piezas de madera, devolviéndoles su encanto original.',
                    portfolio_gallery: ['https://picsum.photos/600/400?random=7', 'https://picsum.photos/600/400?random=8', 'https://picsum.photos/600/400?random=9'],
                    years_experience: 15,
                    hashedRefreshToken: null,
                    applications: [
                        {
                            status: 'accepted',
                            postedJob: {
                                id: '6a5b437d-b201-41b0-a569-3b0610aa880e',
                                title: 'Necesito estantería',
                                description: 'Construcción de estantería a medida',
                                date: '2024-07-01',
                                priority: 'media',
                                photos: ['https://example.com/job243_1.jpg', 'https://example.com/job243_2.jpg'],
                                status: 'completado',
                                review: {
                                    rating: '5.00',
                                    comment: 'Construcción de estantería perfecta, excelente calidad.',
                                },
                            },
                        },
                        {
                            status: 'accepted',
                            postedJob: {
                                id: '4ad933fa-9551-43a1-ad1b-fb9d4ecd542c',
                                title: 'Instalación de estanterías en la sala',
                                description: 'Montaje de estanterías en pared',
                                date: '2024-07-14',
                                priority: 'media',
                                photos: ['https://example.com/job249_1.jpg', 'https://example.com/job249_2.jpg'],
                                status: 'completado',
                                review: {},
                            },
                        },
                    ],
                    categories: ['Carpintero'],
                    location: 'San Isidro',
                },
            ],
        },
    })
    @Get('professional/:id')
    async getProfessionalById(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.usersService.getProfessionalById(id);

        return user;
    }

    @Get('client/:id')
    async getClientById(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.usersService.getClientById(id);

        return user;
    }

    /* When this endpoint is called the JwtAuthGuard and it activates the JwtStrategy and it looks for the jwt token inside the header of the request and validates it. If its valid, then it will be decoded and the payload will pass through the validate function in the jwt strategy and then appended to Request.user*/
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req) {
        return await this.usersService.getProfile(req.user.id);
    }

    @Post('changeRole/:id')
    @ApiParam({
        name: 'id',
        description: 'El ID del usuario al que se le cambiará el rol. Debe ser un UUID válido.',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiQuery({
        name: 'role',
        description: 'El nuevo rol para asignar al usuario. Puede ser "admin", "client" o "professional".',
        required: true,
        example: 'admin',
    })
    @ApiResponse({
        status: 200,
        description: 'El rol del usuario ha sido cambiado exitosamente.',
    })
    @ApiResponse({
        status: 400,
        description: 'Solicitud inválida. El ID o el rol son incorrectos.',
    })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    async changerole(@Param('id', ParseUUIDPipe) id: string, @Query('role') role: string) {
        return this.usersService.changeRole(id, role);
    }

    @Put('updateProfile/:userId')
    @ApiParam({
        name: 'userId',
        description: 'El UUID del usuario a actualizar',
    })
    @ApiBody({
        description: 'Información del usuario a actualizar',
        schema: {
            example: {
                fullname: 'Vale Contua',
                location: 'San Isidro',
                phone: '+51 946982744',
                profileImg: 'https://testimage.com/150?u=a042581f4e29026704d',
                years_experience: 15,
                services: ['Muebles personalizados', 'Reparaciones del hogar', 'Restauración de trabajos en madera'],
                categories: ['Electricista', 'Carpintero'],
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Perfil actualizado exitosamente',
        schema: {
            example: {
                id: 'cc777717-3935-497c-acf5-4a4a3c099825',
                email: 'ampaso@example.com',
                fullname: 'Lopenizo',
                password: '$2b$10$4ZDP7ysG/9.3.C1Y1krYZeZTJs6t1zESYIJlY3myKYFU2Wg/nI2ee',
                phone: '1123456789',
                profileImg: 'https://testimage/150?u=a042581f4e29026704d',
                role: 'professional',
                rating: null,
                services: ['Muebles personalizados', 'Reparaciones del hogar', 'Restauración de trabajos en madera'],
                availability: false,
                bio: null,
                portfolio_gallery: null,
                years_experience: 15,
                hashedRefreshToken: null,
                categories: [
                    {
                        id: '535467d7-837e-489f-86cb-152c318c443f',
                        name: 'Electricista',
                    },
                    {
                        id: '53a659ca-737b-4ae3-a008-79ab1309c8e0',
                        name: 'Carpintero',
                    },
                ],
                location: {
                    id: 'b31f1074-07d9-4b6d-ac1b-97fc86ac9f0d',
                    name: 'San Isidro',
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description:
            'El location, y las categorias deben ser iguales a las definidas en la base de datos. El phone debe empezar con el código de país y el profileImg debe ser un URL válido',
    })
    async updateProfile(@Body() userNewInfo: UpdateUserDto, @Param('userId', ParseUUIDPipe) userId: string) {
        return await this.usersService.updateProfile(userNewInfo, userId);
    }

    @Get('bannedUser/:id')
    async bannedUser(@Param('id', ParseUUIDPipe) userId: string) {
        return await this.usersService.bannedUser(userId);
    }

    @Get('pruebaEjs')
    async pruebaEjs() {
        return await this.usersService.pruebaEjs();
    }
}
