import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
  UnauthorizedException,
  Patch
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiResponse, ApiParam, ApiOkResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
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
    example: '1'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Tiene valor por defecto = 5',
    example: '5'
  })
  @ApiQuery({
    name: 'categories',
    required: false,
    description: 'Si se quiere buscar por mas de una categoria debe separarlo por cómas, es indiferente a las MAYUSC. ES SENSIBLE A LOS ACENTOS',
    example: 'Mecanico, Jardinero'
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Solo se puede buscar por un nombre a la vez, es indiferente a las MAYUSC',
    example: 'JUAN'
  })
  @ApiOperation({
    summary:
      'Lista de todos los profesionales. Se puede filtrar por categoria y por nombre. Protección por rol: ["professional", "client", "admin"] (Vista de cliente o admin)'
  })
  @Get('professionals')
  async getProfessionals(
    @Query('categories') categories?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('name') name?: string
  ) {
    return await this.usersService.getProfessionals(categories, Number(page), Number(limit), name);
  }

  @Get('clients')
  @ApiOperation({
    summary: 'Lista de todos los clientes. Protección por rol: ["admin"]. (Vista de admin)'
  })
  async getClients(@Query('page') page: number = 1, @Query('limit') limit: number = 5) {
    return await this.usersService.getClients(Number(page), Number(limit));
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'Se requiere el id del profesional'
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
          portfolio_gallery: [
            'https://picsum.photos/600/400?random=7',
            'https://picsum.photos/600/400?random=8',
            'https://picsum.photos/600/400?random=9'
          ],
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
                  comment: 'Construcción de estantería perfecta, excelente calidad.'
                }
              }
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
                review: {}
              }
            }
          ],
          categories: ['Carpintero'],
          location: 'San Isidro'
        }
      ]
    }
  })
  @ApiOperation({
    summary: 'Busca un sólo profesional por id. Protección por rol: ["professional", "client", "admin"] (Vista de cliente o admin)'
  })
  @Get('professional/:id')
  async getProfessionalById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.getProfessionalById(id);

    return user;
  }

  @Get('client/:id')
  @ApiOperation({
    summary: 'Busca un sólo cliente por id. Protección por rol: ["admin"] (Vista de admin)'
  })
  async getClientById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.getClientById(id);

    return user;
  }

  /* When this endpoint is called the JwtAuthGuard and it activates the JwtStrategy and it looks for the jwt token inside the header of the request and validates it. If its valid, then it will be decoded and the payload will pass through the validate function in the jwt strategy and then appended to Request.user*/
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lista de un cliente por id. No tiene protección por rol. Si el usuario está logueado podrá ver su perfil.'
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return await this.usersService.getProfile(req.user.id);
  }

  @ApiOperation({
    summary:
      'Un cliente logueado podrá cambiar su rol de "client" a "professional" o viceversa pero no podrá ser cambiado a "admin". No podrá cambiar la información de otro usuario.'
  })
  @ApiParam({
    name: 'id',
    description: 'El ID del usuario al que se le cambiará el rol. Debe ser un UUID válido.',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiQuery({
    name: 'role',
    description: 'El nuevo rol para asignar al usuario. Puede ser "client" o "professional". No puede ser cambiado a "admin"',
    required: true,
    example: 'professional'
  })
  @ApiResponse({
    status: 200,
    description: 'El rol del usuario ha sido cambiado exitosamente.'
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud inválida. El ID o el rol son incorrectos.'
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Patch('changeRole/:id')
  async changerole(@Param('id', ParseUUIDPipe) id: string, @Query('role') role: string, @Req() req) {
    // if (req.user?.id !== id) {
    //     throw new ForbiddenException(
    //         'No puedes cambiar el rol de otra persona',
    //     );
    // }
    return this.usersService.changeRole(id, role);
  }

  @ApiParam({
    name: 'userId',
    description: 'El UUID del usuario a actualizar'
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
        bio: 'Experienced professional in home repairs and custom furniture.',
        services: ['Muebles personalizados', 'Reparaciones del hogar', 'Restauración de trabajos en madera'],
        categories: ['Electricista', 'Carpintero'],
        portfolio_gallery: ['https://example.com/portfolio1.jpg', 'https://example.com/portfolio2.jpg'],
        availability: true
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado exitosamente',
    schema: {
      example: {
        id: 'ea1b3201-aa68-4a2e-bb20-b317e3409cd9',
        email: 'maria.rodriguez@example.com',
        fullname: 'Vale Contua',
        phone: '+51 946982744',
        profileImg: 'https://testimage.com/150?u=a042581f4e29026704d',
        role: 'professional',
        rating: null,
        services: ['Muebles personalizados', 'Reparaciones del hogar', 'Restauración de trabajos en madera'],
        availability: false,
        bio: 'Experienced professional in home repairs and custom furniture.',
        portfolio_gallery: ['https://example.com/portfolio1.jpg', 'https://example.com/portfolio2.jpg'],
        years_experience: 15,
        is_active: true,
        created_at: '2024-11-04T17:26:47.697Z',
        categories: [
          {
            id: '5e880ec2-d039-48c4-9dd8-1ca5af1b47e6',
            name: 'Electricista',
            is_active: true
          },
          {
            id: 'fe9c68bc-1007-4483-840c-4e2257b747a8',
            name: 'Carpintero',
            is_active: true
          }
        ],
        location: {
          id: '91446f84-5354-4066-9d87-ce668a2cabdd',
          name: 'San Isidro',
          is_active: true
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description:
      'El location, y las categorias deben ser iguales a las definidas en la base de datos. El phone debe empezar con el código de país y el profileImg debe ser un URL válido'
  })
  @ApiOperation({
    summary: 'Un usuario podrá cambiar su información de perfil si está logueado. No podrá cambiar la información de otra persona.'
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Patch('updateProfile/:userId')
  async updateProfile(@Body() userNewInfo: UpdateUserDto, @Param('userId', ParseUUIDPipe) userId: string, @Req() req) {
    // if (userId !== req.user.id) {
    //     throw new ForbiddenException(
    //         'No puedes cambiar la información de otra persona',
    //     );
    // }
    return await this.usersService.updateProfile(userNewInfo, userId);
  }

  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Permite al administrador cambiar el estado activo de un usuario.'
  })
  @ApiParam({
    name: 'id',
    description: 'El ID del usuario cuyo estado activo se cambiará. Debe ser un UUID válido.',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'El estado activo del usuario ha sido cambiado exitosamente.'
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud inválida. El ID es incorrecto.'
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  // @UseGuards(JwtAuthGuard)
  @Patch('toggleActiveStatus/:id')
  async toggleActiveStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.toggleUserActiveStatus(id);
  }

  @ApiOperation({
    summary: 'Obtiene una lista de todos los usuarios inactivos. Protección por rol: ["admin"].'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios inactivos obtenida exitosamente.'
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud inválida.'
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron usuarios inactivos.'
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get('inactiveUsers')
  async getInactiveUsers() {
    return this.usersService.getInactiveUsers();
  }

  @ApiOperation({
    summary: 'Obtiene una lista de todos los usuarios con rol de administrador. Protección por rol: ["admin"].'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios administradores obtenida exitosamente.'
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud inválida.'
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron usuarios administradores.'
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get('admins')
  async getAdmins() {
    return this.usersService.getAdmins();
  }
}
