import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class RefreshAuthGuard extends AuthGuard("refresh-jwt") {} //"refresh-jwt" is the name we set for our strategy
