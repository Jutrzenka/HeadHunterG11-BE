import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAllGuard extends AuthGuard(['jwtStudent', 'jwtHr']) {}
